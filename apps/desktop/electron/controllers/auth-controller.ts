import type { BrowserWindow } from "electron";
import { identifyUser } from "../observability";
import { resolveCurrentAuthState, runDesktopSignInFlow, signOutDesktopAuth } from "../services/auth-service";

type AuthControllerOptions = {
    getMainWindow: () => BrowserWindow | null;
};

export function createAuthController(options: AuthControllerOptions) {
    return {
        getState() {
            return resolveCurrentAuthState();
        },
        async signIn() {
            const state = await runDesktopSignInFlow(options.getMainWindow());
            // Sem isto, quem instala e loga na mesma sessão fica com todos os
            // erros dessa sessão sem dono no Sentry.
            identifyUser(state.userId);
            return state;
        },
        async signOut() {
            const state = await signOutDesktopAuth();
            identifyUser(null);
            return state;
        },
    };
}
