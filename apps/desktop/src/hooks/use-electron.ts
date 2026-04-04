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
    engineVersion: "LOCAL ENGINE V1.0.4",
    scriptVersion: "v12",
};

const fallbackElectronAPI: ElectronAPI = {
    window: {
        close: async () => undefined,
    },
    campaigns: {
        list: async () => fallbackCampaigns,
        pause: async () => fallbackCampaigns,
        resume: async () => fallbackCampaigns,
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
};

export function useElectron() {
    if (typeof window !== "undefined" && window.electronAPI) {
        return window.electronAPI;
    }

    return fallbackElectronAPI;
}
