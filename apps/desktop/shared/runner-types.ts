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

export type SessionStatus = "active" | "invalid" | "pending" | "expired";

export type RunnerSessionState = {
    platform: RunnerPlatform;
    status: SessionStatus;
    capturedAt: string | null;
    lastValidatedAt: string | null;
    storagePath: string | null;
};

export type RunnerSessionMap = Partial<Record<RunnerPlatform, RunnerSessionState>>;

export type SessionResultCode = 200 | 400 | 401 | 404 | 408 | 500;

export type SessionResult = {
    success: boolean;
    code: SessionResultCode;
    message: string;
    session?: RunnerSessionState;
};

export type RpaStatus = {
    running: boolean;
    port: number | null;
    pid: number | null;
};

export type RpaRunRequest = {
    campaignId: string;
    storageStatePath: string;
    resumePdfPath: string;
};

export type RpaRunResponse = {
    runId: string;
    status: "started";
};

export type RpaEvent =
    | { runId: string; type: "job_found"; jobUrl: string; jobTitle: string | null; companyName: string | null }
    | { runId: string; type: "applying"; jobApplicationId: string }
    | { runId: string; type: "applied"; jobApplicationId: string }
    | { runId: string; type: "skipped"; jobApplicationId: string; reason: string }
    | { runId: string; type: "paused"; reason: string }
    | { runId: string; type: "finished"; total: number };

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
    sessions: RunnerSessionMap;
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
    sessions: {
        capture: (platform: RunnerPlatform) => Promise<SessionResult>;
        check: (platform: RunnerPlatform) => Promise<RunnerSessionState | null>;
        list: () => Promise<RunnerSessionMap>;
        remove: (platform: RunnerPlatform) => Promise<RunnerSessionMap>;
        subscribe: (listener: (sessions: RunnerSessionMap) => void) => () => void;
    };
    rpa: {
        status: () => Promise<RpaStatus>;
        ensureStarted: () => Promise<RpaStatus>;
        stop: () => Promise<RpaStatus>;
        startRun: (request: RpaRunRequest) => Promise<RpaRunResponse>;
        stopRun: (runId: string) => Promise<{ success: boolean }>;
        subscribe: (listener: (event: RpaEvent) => void) => () => void;
    };
};
