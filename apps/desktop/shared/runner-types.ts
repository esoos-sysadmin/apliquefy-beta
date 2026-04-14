export type RunnerTab = "campaigns" | "settings" | "integration";
export type RunnerPlatform = "linkedin" | "infojobs";
export type RunnerCampaignStatus = "active" | "paused" | "inactive";

export type RunnerCampaign = {
    id: string;
    name: string;
    platform: RunnerPlatform;
    status: RunnerCampaignStatus;
    location: string;
    applications: number;
    dailyLimit: number;
    resumeTitle: string;
    lastUpdated: string;
    notes: string;
};

export type RunnerCampaignApiModel = {
    id: string;
    name: string;
    platform: RunnerPlatform;
    status: RunnerCampaignStatus;
    dailyLimit: number | null;
    createdAt: string;
    resume?: {
        id: string;
        title: string;
    } | null;
    linkedinConfig?: {
        locationTerm?: string | null;
        searchTerms?: string | null;
    } | null;
    infojobsConfig?: {
        locationState?: string | null;
        searchTerms?: string | null;
    } | null;
    _count?: {
        jobApplications: number;
        reports?: number;
        jobs?: number;
    };
};

export type RunnerAccountState = {
    connected: boolean;
    platform: RunnerPlatform | null;
    name: string;
    connectionLabel: string;
    avatarInitials: string;
};

export type RunnerSettings = {
    startWithWindows: boolean;
    desktopNotifications: boolean;
    alwaysOnTop: boolean;
};

export type RunnerAuthState = {
    isAuthenticated: boolean;
    userId: string | null;
    email: string | null;
    displayName: string | null;
    token: string | null;
    expiresAt: number | null;
};

export type RunnerCreditBalance = {
    balance: number;
    canSend: boolean;
    plan: string;
};

export type RunnerEngineStatus = {
    running: boolean;
    uptimeMs: number;
    uptimeLabel: string;
    memoryMb: number;
    memoryLabel: string;
    engineVersion: string;
    scriptVersion: string;
};

export type RunnerPersistedState = {
    campaigns: RunnerCampaign[];
    account: RunnerAccountState;
    settings: RunnerSettings;
    auth: RunnerAuthState;
    creditBalance: RunnerCreditBalance;
};

export type ElectronAPI = {
    window: {
        close: () => Promise<void>;
    };
    campaigns: {
        list: () => Promise<RunnerCampaign[]>;
        getById: (id: string) => Promise<RunnerCampaign | null>;
        pause: (id: string) => Promise<RunnerCampaign[]>;
        activate: (id: string) => Promise<RunnerCampaign[]>;
    };
    accounts: {
        get: () => Promise<RunnerAccountState>;
        connect: (platform: RunnerPlatform) => Promise<RunnerAccountState>;
        disconnect: () => Promise<RunnerAccountState>;
    };
    settings: {
        get: () => Promise<RunnerSettings>;
        save: (patch: Partial<RunnerSettings>) => Promise<RunnerSettings>;
    };
    auth: {
        getState: () => Promise<RunnerAuthState>;
        signIn: () => Promise<RunnerAuthState>;
        signOut: () => Promise<RunnerAuthState>;
    };
    engine: {
        getStatus: () => Promise<RunnerEngineStatus>;
        subscribe: (listener: (status: RunnerEngineStatus) => void) => () => void;
    };
    credits: {
        getBalance: () => Promise<RunnerCreditBalance>;
    };
};
