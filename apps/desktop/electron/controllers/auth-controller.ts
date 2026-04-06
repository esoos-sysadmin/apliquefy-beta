import type { BrowserWindow } from "electron";
import { resolveCurrentAuthState, runDesktopSignInFlow, signOutDesktopAuth } from "../services/auth-service";

type AuthControllerOptions = {
    getMainWindow: () => BrowserWindow | null;
};

export function createAuthController(options: AuthControllerOptions) {
    return {
        getState() {
            return resolveCurrentAuthState();
        },
        signIn() {
            return runDesktopSignInFlow(options.getMainWindow());
        },
        signOut() {
            return signOutDesktopAuth();
        },
    };
}
