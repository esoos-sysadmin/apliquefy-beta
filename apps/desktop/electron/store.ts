import { app } from "electron";
import fs from "node:fs";
import path from "node:path";
import type {
    RunnerAccountState,
    RunnerAuthState,
    RunnerCampaign,
    RunnerPersistedState,
    RunnerPlatform,
    RunnerSettings,
} from "../shared/runner-types";

const runnerStateFileName = "apliquefy-runner-state.json";

const defaultCampaigns: RunnerCampaign[] = [
    {
        id: "runner-campaign-1",
        name: "Dev React Search",
        platform: "linkedin",
        status: "active",
        location: "Remote • United States",
        applications: 124,
        dailyLimit: 30,
        resumeTitle: "Senior Frontend Resume",
        lastUpdated: "2 min ago",
        notes: "Focused on React and frontend-heavy roles.",
    },
    {
        id: "runner-campaign-2",
        name: "Fullstack Node.js",
        platform: "infojobs",
        status: "active",
        location: "Hybrid • Berlin, DE",
        applications: 89,
        dailyLimit: 20,
        resumeTitle: "Fullstack Europe Resume",
        lastUpdated: "6 min ago",
        notes: "Balanced search for hybrid fullstack positions.",
    },
    {
        id: "runner-campaign-3",
        name: "UX Designer Sr.",
        platform: "linkedin",
        status: "paused",
        location: "Remote • Brazil",
        applications: 41,
        dailyLimit: 15,
        resumeTitle: "Product Design Resume",
        lastUpdated: "18 min ago",
        notes: "Paused after reaching the daily cap yesterday.",
    },
];

const defaultAccount: RunnerAccountState = {
    connected: false,
    platform: null,
    name: "Alex Morgan",
    connectionLabel: "Connected via Local Node",
    avatarInitials: "AM",
};

const defaultSettings: RunnerSettings = {
    startWithWindows: true,
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

let cachedState: RunnerPersistedState | null = null;

function cloneState<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
}

export function createDefaultRunnerState(): RunnerPersistedState {
    return {
        campaigns: cloneState(defaultCampaigns),
        account: cloneState(defaultAccount),
        settings: cloneState(defaultSettings),
        auth: cloneState(defaultAuth),
    };
}

function getStateFilePath() {
    return path.join(app.getPath("userData"), runnerStateFileName);
}

function normalizeState(raw: Partial<RunnerPersistedState> | null | undefined): RunnerPersistedState {
    const defaults = createDefaultRunnerState();

    return {
        campaigns:
            raw && Array.isArray(raw.campaigns) && raw.campaigns.length > 0
                ? raw.campaigns
                : defaults.campaigns,
        account: raw?.account ? { ...defaults.account, ...raw.account } : defaults.account,
        settings: raw?.settings ? { ...defaults.settings, ...raw.settings } : defaults.settings,
        auth: raw?.auth ? { ...defaults.auth, ...raw.auth } : defaults.auth,
    };
}

function persistState(nextState: RunnerPersistedState) {
    const filePath = getStateFilePath();
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(nextState, null, 2), "utf8");
}

export function getRunnerState(): RunnerPersistedState {
    if (cachedState) {
        return cloneState(cachedState);
    }

    const filePath = getStateFilePath();

    try {
        if (fs.existsSync(filePath)) {
            const parsed = JSON.parse(fs.readFileSync(filePath, "utf8")) as Partial<RunnerPersistedState>;
            cachedState = normalizeState(parsed);
            return cloneState(cachedState);
        }
    } catch (error) {
        console.error("Failed to read runner state:", error);
    }

    cachedState = createDefaultRunnerState();
    persistState(cachedState);
    return cloneState(cachedState);
}

export function setRunnerState(nextState: RunnerPersistedState): RunnerPersistedState {
    cachedState = normalizeState(nextState);
    persistState(cachedState);
    return cloneState(cachedState);
}

export function updateRunnerState(
    updater: (state: RunnerPersistedState) => RunnerPersistedState
): RunnerPersistedState {
    const currentState = getRunnerState();
    return setRunnerState(updater(currentState));
}

export function getPlatformLoginUrl(platform: RunnerPlatform) {
    if (platform === "linkedin") {
        return "https://www.linkedin.com/login";
    }

    return "https://www.infojobs.com.br/login";
}

export function createEmptyAuthState(): RunnerAuthState {
    return cloneState(defaultAuth);
}

export function getDesktopWebUrl() {
    return process.env.APLIQUEFY_WEB_URL ?? "http://localhost:3000";
}
