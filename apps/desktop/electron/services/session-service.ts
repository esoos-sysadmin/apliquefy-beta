import { app } from "electron";
import fs from "node:fs";
import path from "node:path";
import { chromium, type BrowserContext, type Cookie } from "playwright";
import type {
    RunnerPlatform,
    RunnerSessionState,
    SessionResult,
} from "../../shared/runner-types";

const LOGIN_NAV_TIMEOUT_MS = 15_000;
const LOGIN_COMPLETION_TIMEOUT_MS = 5 * 60_000;
const LOGIN_POLL_INTERVAL_MS = 1_500;

type PlatformConfig = {
    // Página onde o usuário inicia o login.
    loginUrl: string;
    // Rótulos de botões de consentimento de cookies/termos a fechar no 1º acesso.
    consentButtons: string[];
    // Decide, a partir dos cookies, se o usuário está autenticado.
    isLoggedIn: (cookies: Cookie[]) => boolean;
};

function isInfojobsDomain(domain: string) {
    const host = domain.replace(/^\./, "");
    return host === "infojobs.com.br" || host.endsWith(".infojobs.com.br");
}

const PLATFORM_CONFIG: Record<RunnerPlatform, PlatformConfig> = {
    linkedin: {
        loginUrl: "https://www.linkedin.com/login",
        consentButtons: [],
        // li_at é o cookie de autenticação do LinkedIn.
        isLoggedIn: (cookies) => cookies.some((c) => c.name === "li_at" && !!c.value),
    },
    infojobs: {
        // A home dispara o fluxo de login (login.infojobs.com.br) e exibe o popup
        // de consentimento no primeiro acesso.
        loginUrl: "https://www.infojobs.com.br/",
        consentButtons: [
            "Agree and close",
            "Aceitar e fechar",
            "Aceitar todos os cookies",
            "Concordar",
            "Aceitar",
        ],
        // Cookie de sessão (httpOnly) que o app define em www.infojobs.com.br após
        // o OIDC. O IdP (login.infojobs.com.br) é ignorado para não dar falso
        // positivo antes do login concluir.
        isLoggedIn: (cookies) =>
            cookies.some(
                (c) =>
                    c.httpOnly &&
                    isInfojobsDomain(c.domain) &&
                    c.domain.replace(/^\./, "") !== "login.infojobs.com.br" &&
                    /aspxauth|aspnet|applicationcookie|idsrv|auth|session|login/i.test(c.name)
            ),
    },
};

export function getSessionsRoot() {
    return path.join(app.getPath("userData"), "sessions");
}

export function getPlatformSessionDir(platform: RunnerPlatform) {
    return path.join(getSessionsRoot(), platform);
}

export function getStorageStatePath(platform: RunnerPlatform) {
    return path.join(getPlatformSessionDir(platform), "storage-state.json");
}

export function hasStoredSession(platform: RunnerPlatform) {
    return fs.existsSync(getStorageStatePath(platform));
}

function isValidPlatform(platform: unknown): platform is RunnerPlatform {
    return platform === "linkedin" || platform === "infojobs";
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// Tenta fechar o popup de consentimento de cookies/termos. Best-effort: cada
// clique espera o botão por um curto período e, se não aparecer, tenta o próximo
// rótulo. Plataformas sem consentimento (lista vazia) não sofrem atraso.
async function dismissConsentPopup(
    page: import("playwright").Page,
    labels: string[],
    platform: RunnerPlatform
) {
    for (const name of labels) {
        try {
            await page.getByRole("button", { name }).first().click({ timeout: 2_000 });
            console.log(`[capture:${platform}] consentimento fechado via "${name}".`);
            return;
        } catch {
            // botão não encontrado com esse rótulo; tenta o próximo
        }
    }
}

// Aguarda o usuário concluir o login observando os cookies vivos do contexto,
// sem depender de casar URL (a home tem a mesma URL logado/deslogado) nem de
// requisição crua (bloqueada por anti-bot). Loga os cookies quando o conjunto
// muda, para facilitar diagnóstico.
async function waitForLogin(
    context: BrowserContext,
    config: PlatformConfig,
    platform: RunnerPlatform
): Promise<boolean> {
    const deadline = Date.now() + LOGIN_COMPLETION_TIMEOUT_MS;
    let lastSignature = "";

    while (Date.now() < deadline) {
        let cookies: Cookie[] = [];
        try {
            cookies = await context.cookies();
        } catch {
            // contexto ocupado durante navegação; tenta de novo
        }

        const signature = cookies.map((c) => c.name).sort().join(",");
        if (signature !== lastSignature) {
            const relevant = cookies
                .filter((c) => c.httpOnly)
                .map((c) => `${c.domain}|${c.name}`);
            console.log(`[capture:${platform}] cookies httpOnly: ${relevant.join("  ") || "(nenhum)"}`);
            lastSignature = signature;
        }

        if (config.isLoggedIn(cookies)) {
            return true;
        }

        await sleep(LOGIN_POLL_INTERVAL_MS);
    }

    console.error(`[capture:${platform}] login não detectado dentro do tempo limite.`);
    return false;
}

export async function captureSession(platform: RunnerPlatform): Promise<SessionResult> {
    if (!isValidPlatform(platform)) {
        return { success: false, code: 400, message: "Plataforma inválida." };
    }

    const config = PLATFORM_CONFIG[platform];
    const sessionDir = getPlatformSessionDir(platform);

    try {
        fs.mkdirSync(sessionDir, { recursive: true });
    } catch (error) {
        console.error("Failed to create session dir:", error);
        return { success: false, code: 500, message: "Não foi possível salvar a sessão." };
    }

    let context: BrowserContext | null = null;

    try {
        context = await chromium.launchPersistentContext(sessionDir, {
            channel: "chrome",
            headless: false,
            viewport: null,
            args: ["--disable-blink-features=AutomationControlled"],
            ignoreDefaultArgs: ["--enable-automation"],
        });
    } catch (error) {
        console.error("Playwright launch failed:", error);
        return {
            success: false,
            code: 500,
            message: "Não foi possível iniciar o navegador. Verifique se o Chrome está instalado.",
        };
    }

    const page = context.pages()[0] ?? (await context.newPage());

    try {
        // "commit" não estoura exceção se a página fizer redirect durante a
        // navegação (comum no fluxo OIDC do InfoJobs).
        const response = await page.goto(config.loginUrl, {
            waitUntil: "commit",
            timeout: LOGIN_NAV_TIMEOUT_MS,
        });
        console.log(
            `[capture:${platform}] goto status=${response?.status() ?? "?"} url=${page.url()}`
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : "";
        console.error(`[capture:${platform}] goto FALHOU: ${message.split("\n")[0]}`);
        await context.close();
        if (/Timeout/i.test(message)) {
            return { success: false, code: 408, message: "Tempo de espera para carregar excedido." };
        }
        return { success: false, code: 404, message: "Não foi possível acessar a página de login." };
    }

    // Fecha o popup de consentimento (aparece no 1º acesso e bloqueia o clique).
    await dismissConsentPopup(page, config.consentButtons, platform);

    const loggedIn = await waitForLogin(context, config, platform);
    if (!loggedIn) {
        await context.close();
        return {
            success: false,
            code: 408,
            message: "Tempo de espera para login excedido. Tente novamente.",
        };
    }
    console.log(`[capture:${platform}] login detectado.`);

    try {
        await context.storageState({ path: getStorageStatePath(platform) });
    } catch (error) {
        console.error("Failed to persist storage state:", error);
        await context.close();
        return { success: false, code: 500, message: "Falha ao salvar a sessão." };
    }

    await context.close();

    const session: RunnerSessionState = {
        platform,
        status: "active",
        capturedAt: new Date().toISOString(),
        lastValidatedAt: new Date().toISOString(),
        storagePath: getStorageStatePath(platform),
    };

    return { success: true, code: 200, message: "Sessão capturada.", session };
}

type StoredCookie = {
    name: string;
    value: string;
    domain: string;
    path: string;
    httpOnly?: boolean;
    secure?: boolean;
    expires?: number;
};

export async function validateSession(platform: RunnerPlatform): Promise<SessionResult> {
    if (!isValidPlatform(platform)) {
        return { success: false, code: 400, message: "Plataforma inválida." };
    }

    const storagePath = getStorageStatePath(platform);
    if (!fs.existsSync(storagePath)) {
        return { success: false, code: 401, message: "Sessão inexistente." };
    }

    const config = PLATFORM_CONFIG[platform];

    // Valida lendo os cookies salvos e checando o cookie de autenticação (não
    // expirado). Não navega: o LinkedIn/InfoJobs detectam browser headless e
    // requisição crua, derrubando sessões válidas (falso-negativo). O cookie de
    // auth presente e dentro da validade é o sinal confiável.
    try {
        const raw = JSON.parse(fs.readFileSync(storagePath, "utf8")) as {
            cookies?: StoredCookie[];
        };
        const nowSec = Date.now() / 1000;
        const cookies: Cookie[] = (raw.cookies ?? [])
            .filter((c) => c.expires === undefined || c.expires === -1 || c.expires > nowSec)
            .map((c) => ({
                name: c.name,
                value: c.value,
                domain: c.domain,
                path: c.path,
                httpOnly: !!c.httpOnly,
                secure: !!c.secure,
            }));

        if (config.isLoggedIn(cookies)) {
            const session: RunnerSessionState = {
                platform,
                status: "active",
                capturedAt: null,
                lastValidatedAt: new Date().toISOString(),
                storagePath,
            };
            return { success: true, code: 200, message: "Sessão válida.", session };
        }

        return { success: false, code: 401, message: "Sessão expirada." };
    } catch (error) {
        console.error("Session validation failed:", error);
        return { success: false, code: 500, message: "Erro ao validar sessão." };
    }
}

export function removeSessionFiles(platform: RunnerPlatform) {
    if (!isValidPlatform(platform)) {
        return;
    }
    const dir = getPlatformSessionDir(platform);
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
    }
}
