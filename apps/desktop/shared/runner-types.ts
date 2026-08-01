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
    // false = currículo foi excluído na web; a campanha não pode rodar assim
    hasResume: boolean;
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
    // Consentimento do error tracking (SDD §7.7). Vale para os três processos:
    // main, renderer e o engine Python. Só tem efeito no próximo boot, porque o
    // `enabled` é lido no init dos SDKs e o engine recebe o DSN por env ao subir.
    errorReports: boolean;
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
    // Prévia ao vivo: JPEG base64 (sem prefixo data:) capturado pelo engine.
    | { runId: string; type: "frame"; data: string }
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

export type AssistantMessage = {
    role: "user" | "assistant";
    content: string;
};

// Voz, nome e personalidade são a mesma escolha: "apollo" é o padrão (formal e seco),
// "nemesis" é a ácida, "hestia" é a calorosa. Trocar aqui troca o reference_id da
// fish.audio, o nome no orbe e o system prompt de uma vez só.
export type PersonaId = "apollo" | "nemesis" | "hestia";

export const DEFAULT_PERSONA: PersonaId = "apollo";

// Uma ação que o Apollo executou de fato no app (para o feedback visual da UI).
export type AssistantAction = {
    tool: string;
    label: string;
    ok: boolean;
};

export type AssistantChatResult = {
    reply: string;
    actions: AssistantAction[];
};

export type ElectronAPI = {
    window: {
        close: () => Promise<void>;
        minimize: () => Promise<void>;
    };
    assistant: {
        // Recebe o áudio como base64 (webm/opus) e devolve o texto transcrito (Whisper).
        transcribe: (audioBase64: string) => Promise<string>;
        // Roda o loop do agente (GPT-4o-mini + tools) sobre o histórico e devolve a resposta + ações.
        chat: (messages: AssistantMessage[], persona: PersonaId) => Promise<AssistantChatResult>;
        // Sintetiza a fala na fish.audio e devolve o mp3 em base64 pro renderer tocar.
        speak: (text: string, persona: PersonaId) => Promise<string>;
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
