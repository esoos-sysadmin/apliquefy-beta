import { BrowserWindow, ipcMain, session as electronSession } from "electron";
import { createAuthController } from "../controllers/auth-controller";

type AuthIpcOptions = {
    getMainWindow: () => BrowserWindow | null;
};

let isAuthIpcRegistered = false;

export function registerAuthIpc(options: AuthIpcOptions) {
    if (isAuthIpcRegistered) {
        return;
    }

    isAuthIpcRegistered = true;
    const controller = createAuthController(options);

    ipcMain.handle("auth:get-state", async () => {
        return controller.getState();
    });

    ipcMain.handle("auth:sign-in", async () => {
        return controller.signIn();
    });

    ipcMain.handle("auth:sign-out", async () => {
        return controller.signOut();
    });
}
