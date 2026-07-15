import { spawn, type ChildProcess } from "node:child_process";
import type { Readable } from "node:stream";
import { randomUUID } from "node:crypto";
import { app } from "electron";
import { existsSync } from "node:fs";
import path from "node:path";
import { getDesktopWebUrl, getRunnerState } from "../store";

const PORT_LINE_RE = /^RPA_ENGINE_PORT=(\d+)$/m;
const HANDSHAKE_TIMEOUT_MS = 15_000;
const HEALTH_TIMEOUT_MS = 5_000;
const RESTART_BACKOFF_MS = [1_000, 3_000, 5_000, 10_000];

type RpaChild = ChildProcess & { stdout: Readable; stderr: Readable };

type EngineState = {
    child: RpaChild | null;
    port: number | null;
    token: string | null;
    starting: boolean;
    restartAttempts: number;
};

const state: EngineState = {
    child: null,
    port: null,
    token: null,
    starting: false,
    restartAttempts: 0,
};

function resolvePython(): { command: string; args: string[]; cwd: string } {
    if (!app.isPackaged) {
        // Em dev, __dirname é dist-electron/electron/services (4 níveis até apps/),
        // mas via ts-node seria electron/services (3 níveis). Tenta candidatos.
        const candidates = [
            path.resolve(__dirname, "../../../../robots"),
            path.resolve(__dirname, "../../../robots"),
            path.resolve(app.getAppPath(), "../robots"),
            path.resolve(process.cwd(), "../robots"),
        ];
        const enginePath = candidates.find((candidate) => existsSync(candidate));

        if (enginePath) {
            const venvPython = path.join(enginePath, ".venv", "bin", "python");
            const command = existsSync(venvPython) ? venvPython : "python3";
            return {
                command,
                args: ["-m", "rpa_engine"],
                cwd: enginePath,
            };
        }

        console.warn("[robots] engine dir não encontrado em dev; candidatos:", candidates);
    }

    const resourcesPath = process.resourcesPath ?? "";
    const binName = process.platform === "win32" ? "robots.exe" : "robots";
    const packagedEngine = path.join(resourcesPath, "robots", binName);
    return {
        command: packagedEngine,
        args: [],
        cwd: path.dirname(packagedEngine),
    };
}

function buildEnv(token: string): NodeJS.ProcessEnv {
    const auth = getRunnerState().auth;
    return {
        ...process.env,
        RPA_AUTH_TOKEN: token,
        RPA_USER_DATA_DIR: app.getPath("userData"),
        APLIQUEFY_WEB_URL: getDesktopWebUrl(),
        APLIQUEFY_WEB_TOKEN: auth.token ?? "",
        PYTHONUNBUFFERED: "1",
    };
}

async function pingHealth(port: number, token: string, timeoutMs = HEALTH_TIMEOUT_MS): Promise<boolean> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(`http://127.0.0.1:${port}/health`, {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
        });
        return res.ok;
    } catch {
        return false;
    } finally {
        clearTimeout(timer);
    }
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// O engine imprime a porta ANTES do uvicorn começar a ouvir (build_app importa
// openai/playwright, o que leva alguns segundos). Faz poll no /health até o
// servidor responder de fato, em vez de uma única tentativa imediata.
async function waitForHealth(port: number, token: string, deadlineMs = 20_000): Promise<boolean> {
    const deadline = Date.now() + deadlineMs;
    while (Date.now() < deadline) {
        if (await pingHealth(port, token, 1_500)) {
            return true;
        }
        await sleep(400);
    }
    return false;
}

function awaitPortHandshake(child: RpaChild): Promise<number> {
    return new Promise((resolve, reject) => {
        let buffer = "";
        const onData = (chunk: Buffer) => {
            const text = chunk.toString("utf8");
            buffer += text;
            process.stdout.write(`[robots] ${text}`);

            const match = buffer.match(PORT_LINE_RE);
            if (match) {
                cleanup();
                resolve(Number.parseInt(match[1]!, 10));
            }
        };
        const onErr = (chunk: Buffer) => process.stderr.write(`[robots err] ${chunk.toString("utf8")}`);
        const onExit = (code: number | null) => {
            cleanup();
            reject(new Error(`RPA engine exited before handshake (code ${code ?? "null"})`));
        };
        const timer = setTimeout(() => {
            cleanup();
            reject(new Error("RPA engine handshake timeout"));
        }, HANDSHAKE_TIMEOUT_MS);

        function cleanup() {
            clearTimeout(timer);
            child.stdout.off("data", onData);
            child.stderr.off("data", onErr);
            child.off("exit", onExit);
        }

        child.stdout.on("data", onData);
        child.stderr.on("data", onErr);
        child.once("exit", onExit);
    });
}

function attachLifecycle(child: RpaChild) {
    child.stdout.on("data", (c: Buffer) => process.stdout.write(`[robots] ${c.toString("utf8")}`));
    child.stderr.on("data", (c: Buffer) => process.stderr.write(`[robots err] ${c.toString("utf8")}`));
    child.once("exit", (code) => {
        console.warn(`[robots] exited with code ${code ?? "null"}`);
        state.child = null;
        state.port = null;

        if (app.isReady() && !app.isPackaged === false) {
            scheduleRestart();
        } else if (app.isReady()) {
            scheduleRestart();
        }
    });
}

function scheduleRestart() {
    const attempt = state.restartAttempts;
    const delay = RESTART_BACKOFF_MS[Math.min(attempt, RESTART_BACKOFF_MS.length - 1)] ?? 10_000;
    state.restartAttempts = attempt + 1;
    setTimeout(() => {
        startRpaProcess().catch((err) => console.error("[robots] restart failed:", err));
    }, delay);
}

export async function startRpaProcess(): Promise<void> {
    if (state.starting || state.child) return;
    state.starting = true;

    try {
        const { command, args, cwd } = resolvePython();
        const token = randomUUID();

        if (!existsSync(command) && command !== "python3") {
            console.warn(`[robots] binary not found at ${command}; skipping startup`);
            return;
        }

        const child = spawn(command, args, {
            cwd,
            env: buildEnv(token),
            stdio: ["ignore", "pipe", "pipe"],
        }) as RpaChild;

        const port = await awaitPortHandshake(child);
        const healthy = await waitForHealth(port, token);

        if (!healthy) {
            child.kill("SIGTERM");
            throw new Error(`RPA engine health-check failed on port ${port}`);
        }

        state.child = child;
        state.port = port;
        state.token = token;
        state.restartAttempts = 0;

        attachLifecycle(child);
        console.info(`[robots] ready on port ${port}`);
    } finally {
        state.starting = false;
    }
}

export function stopRpaProcess(): void {
    const child = state.child;
    state.child = null;
    state.port = null;
    state.token = null;
    if (!child) return;

    child.removeAllListeners("exit");
    try {
        child.kill("SIGTERM");
        const timer = setTimeout(() => {
            try {
                child.kill("SIGKILL");
            } catch {
                /* noop */
            }
        }, 3_000);
        child.once("exit", () => clearTimeout(timer));
    } catch (err) {
        console.warn("[robots] stop failed:", err);
    }
}

export function getRpaStatus() {
    return {
        running: !!state.child && !!state.port,
        port: state.port,
        pid: state.child?.pid ?? null,
    };
}

export function getRpaAuthToken(): string | null {
    return state.token;
}

export async function rpaApiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
    if (!state.port || !state.token) {
        throw new Error("RPA engine is not running");
    }

    const url = `http://127.0.0.1:${state.port}${path}`;
    const res = await fetch(url, {
        ...options,
        headers: {
            Authorization: `Bearer ${state.token}`,
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    const payload = await res.json().catch(() => null);

    if (!res.ok) {
        const message =
            payload && typeof payload === "object" && "message" in payload
                ? String((payload as { message: unknown }).message)
                : `RPA request failed with status ${res.status}`;
        throw new Error(message);
    }

    return payload as T;
}
