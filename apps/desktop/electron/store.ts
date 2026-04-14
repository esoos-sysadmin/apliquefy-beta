import { app } from "electron";
import fs from "node:fs";
import path from "node:path";
import type {
    RunnerAccountState,
    RunnerAuthState,
    RunnerCreditBalance,
    RunnerPersistedState,
    RunnerPlatform,
    RunnerSettings,
} from "../shared/runner-types";

// --- Defaults ---

const defaultAccount: RunnerAccountState = {
    connected: false,
    platform: null,
    name: "",
    connectionLabel: "",
    avatarInitials: "",
};

const defaultSettings: RunnerSettings = {
    startWithWindows: false,
    desktopNotifications: false,
    alwaysOnTop: false,
};

const defaultAuth: RunnerAuthState = {
    isAuthenticated: false,
    userId: null,
    email: null,
    displayName: null,
    token: null,
    expiresAt: null,
};

const defaultCreditBalance: RunnerCreditBalance = {
    balance: 0,
    canSend: false,
    plan: "free",
};

// --- Persistence ---

const STATE_FILE = "apliquefy-runner-state.json";

function getStateFilePath() {
    return path.join(app.getPath("userData"), STATE_FILE);
}

function readStateFromDisk(): RunnerPersistedState {
    const filePath = getStateFilePath();

    try {
        if (fs.existsSync(filePath)) {
            const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as Partial<RunnerPersistedState>;
            return {
                campaigns: [],
                account: raw.account ? { ...defaultAccount, ...raw.account } : defaultAccount,
                settings: raw.settings ? { ...defaultSettings, ...raw.settings } : defaultSettings,
                auth: raw.auth ? { ...defaultAuth, ...raw.auth } : defaultAuth,
                creditBalance: raw.creditBalance ? { ...defaultCreditBalance, ...raw.creditBalance } : defaultCreditBalance,
            };
        }
    } catch (error) {
        console.error("Failed to read runner state:", error);
    }

    return { campaigns: [], account: defaultAccount, settings: defaultSettings, auth: defaultAuth, creditBalance: defaultCreditBalance };
}

function writeStateToDisk(state: RunnerPersistedState) {
    const filePath = getStateFilePath();
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(state, null, 2), "utf8");
}

// --- Store ---

function clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
}

let cachedState: RunnerPersistedState | null = null;

export function getRunnerState(): RunnerPersistedState {
    if (!cachedState) {
        cachedState = readStateFromDisk();
    }
    return clone(cachedState);
}

export function setRunnerState(nextState: RunnerPersistedState): RunnerPersistedState {
    cachedState = nextState;
    writeStateToDisk(cachedState);
    return clone(cachedState);
}

export function updateRunnerState(
    updater: (state: RunnerPersistedState) => RunnerPersistedState
): RunnerPersistedState {
    return setRunnerState(updater(getRunnerState()));
}

export function createEmptyAuthState(): RunnerAuthState {
    return clone(defaultAuth);
}

// --- Platform utils ---

export function getPlatformLoginUrl(platform: RunnerPlatform) {
    if (platform === "linkedin") {
        return "https://www.linkedin.com/login";
    }
    return "https://www.infojobs.com.br/login";
}

export function getDesktopWebUrl() {
    return process.env.APLIQUEFY_WEB_URL ?? "http://localhost:3000";
}
