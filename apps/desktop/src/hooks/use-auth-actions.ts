import type { ElectronAPI } from "../../shared/runner-types";
import { settingsStore } from "../stores/settings-store";

export function useAuthActions(electron: ElectronAPI) {
    const handleSignIn = async () => {
        settingsStore.startAuthenticating();

        try {
            const nextAuth = await electron.auth.signIn();
            settingsStore.setAuth(nextAuth);
        } catch (error) {
            console.error("Failed to sign in through Clerk:", error);
        } finally {
            settingsStore.stopAuthenticating();
        }
    };

    const handleDisconnectAccount = async () => {
        const nextAuth = await electron.auth.signOut();
        settingsStore.setAuth(nextAuth);
        settingsStore.setActiveTab("settings");
    };

    return {
        handleSignIn,
        handleDisconnectAccount,
    };
}
