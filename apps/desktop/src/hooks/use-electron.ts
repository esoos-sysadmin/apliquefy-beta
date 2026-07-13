import type {
    ElectronAPI,
    RunnerAccountState,
    RunnerAuthState,
    RunnerCampaign,
    RunnerEngineStatus,
    RunnerSettings,
} from "../../shared/runner-types";

const fallbackCampaigns: RunnerCampaign[] = [];

const fallbackAccount: RunnerAccountState = {
    connected: false,
    platform: null,
    name: "Alex Morgan",
    connectionLabel: "Connected via Local Node",
    avatarInitials: "AM",
};

const fallbackSettings: RunnerSettings = {
    startWithWindows: true,
    desktopNotifications: false,
    alwaysOnTop: false,
};

const fallbackAuth: RunnerAuthState = {
    isAuthenticated: false,
    userId: null,
    email: null,
    displayName: null,
    token: null,
    expiresAt: null,
};

const fallbackEngineStatus: RunnerEngineStatus = {
    running: true,
    uptimeMs: 0,
    uptimeLabel: "0m",
    memoryMb: 0,
    memoryLabel: "0MB",
    engineVersion: "APLIQUEFY V1.0.0",
    scriptVersion: "v12",
};

const fallbackElectronAPI: ElectronAPI = {
    window: {
        close: async () => undefined,
    },
    assistant: {
        transcribe: async () => "",
        chat: async () => ({ reply: "Electron indisponível.", actions: [] }),
    },
    campaigns: {
        list: async () => fallbackCampaigns,
        getById: async () => null,
        pause: async () => fallbackCampaigns,
        activate: async () => fallbackCampaigns,
    },
    accounts: {
        get: async () => fallbackAccount,
        connect: async () => fallbackAccount,
        disconnect: async () => fallbackAccount,
    },
    settings: {
        get: async () => fallbackSettings,
        save: async () => fallbackSettings,
    },
    auth: {
        getState: async () => fallbackAuth,
        signIn: async () => fallbackAuth,
        signOut: async () => fallbackAuth,
    },
    engine: {
        getStatus: async () => fallbackEngineStatus,
        subscribe: () => () => undefined,
    },
    credits: {
        getBalance: async () => ({ balance: 0, canSend: false, plan: "free" }),
    },
    sessions: {
        capture: async () => ({ success: false, code: 500, message: "Electron unavailable." }),
        check: async () => null,
        list: async () => ({}),
        remove: async () => ({}),
        subscribe: () => () => undefined,
    },
    rpa: {
        status: async () => ({ running: false, port: null, pid: null }),
        ensureStarted: async () => ({ running: false, port: null, pid: null }),
        stop: async () => ({ running: false, port: null, pid: null }),
        startRun: async () => ({ runId: "", status: "started" }),
        stopRun: async () => ({ success: false }),
        subscribe: () => () => undefined,
    },
};

export function useElectron() {
    if (typeof window !== "undefined" && window.electronAPI) {
        return window.electronAPI;
    }

    return fallbackElectronAPI;
}
