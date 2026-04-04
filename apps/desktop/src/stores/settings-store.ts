import type {
    RunnerAccountState,
    RunnerAuthState,
    RunnerEngineStatus,
    RunnerSettings,
    RunnerTab,
} from "../../shared/runner-types";
import { createStore } from "./create-store";

type SettingsStoreState = {
    activeTab: RunnerTab;
    account: RunnerAccountState;
    auth: RunnerAuthState;
    savedSettings: RunnerSettings;
    draftSettings: RunnerSettings;
    engineStatus: RunnerEngineStatus | null;
    isHydrated: boolean;
    isSaving: boolean;
    isAuthenticating: boolean;
};

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

const baseStore = createStore<SettingsStoreState>({
    activeTab: "campaigns",
    account: defaultAccount,
    auth: defaultAuth,
    savedSettings: defaultSettings,
    draftSettings: defaultSettings,
    engineStatus: null,
    isHydrated: false,
    isSaving: false,
    isAuthenticating: false,
});

export const settingsStore = {
    getState: baseStore.getState,
    hydrate(payload: {
        account: RunnerAccountState;
        auth: RunnerAuthState;
        settings: RunnerSettings;
        engineStatus: RunnerEngineStatus;
    }) {
        baseStore.setState((currentState) => ({
            ...currentState,
            account: payload.account,
            auth: payload.auth,
            savedSettings: payload.settings,
            draftSettings: payload.settings,
            engineStatus: payload.engineStatus,
            isHydrated: true,
        }));
    },
    setActiveTab(activeTab: RunnerTab) {
        baseStore.setState((currentState) => ({
            ...currentState,
            activeTab,
        }));
    },
    setAccount(account: RunnerAccountState) {
        baseStore.setState((currentState) => ({
            ...currentState,
            account,
        }));
    },
    setAuth(auth: RunnerAuthState) {
        baseStore.setState((currentState) => ({
            ...currentState,
            auth,
        }));
    },
    setDraftSetting<Key extends keyof RunnerSettings>(key: Key, value: RunnerSettings[Key]) {
        baseStore.setState((currentState) => ({
            ...currentState,
            draftSettings: {
                ...currentState.draftSettings,
                [key]: value,
            },
        }));
    },
    syncImmediateSetting<Key extends keyof RunnerSettings>(key: Key, value: RunnerSettings[Key]) {
        baseStore.setState((currentState) => ({
            ...currentState,
            savedSettings: {
                ...currentState.savedSettings,
                [key]: value,
            },
            draftSettings: {
                ...currentState.draftSettings,
                [key]: value,
            },
        }));
    },
    setEngineStatus(engineStatus: RunnerEngineStatus) {
        baseStore.setState((currentState) => ({
            ...currentState,
            engineStatus,
        }));
    },
    startSaving() {
        baseStore.setState((currentState) => ({
            ...currentState,
            isSaving: true,
        }));
    },
    finishSaving(settings: RunnerSettings) {
        baseStore.setState((currentState) => ({
            ...currentState,
            savedSettings: settings,
            draftSettings: settings,
            isSaving: false,
        }));
    },
    stopSaving() {
        baseStore.setState((currentState) => ({
            ...currentState,
            isSaving: false,
        }));
    },
    startAuthenticating() {
        baseStore.setState((currentState) => ({
            ...currentState,
            isAuthenticating: true,
        }));
    },
    stopAuthenticating() {
        baseStore.setState((currentState) => ({
            ...currentState,
            isAuthenticating: false,
        }));
    },
};

export function useSettingsStore<Selected>(selector: (state: SettingsStoreState) => Selected) {
    return baseStore.useStore(selector);
}
