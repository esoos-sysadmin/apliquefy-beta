import { app, BrowserWindow } from "electron";
import { applyRunnerSettings } from "./ipc/settings";
import { createMainWindow } from "./main/create-main-window";
import { registerIpcHandlers } from "./main/register-ipc-handlers";
import { getRunnerState } from "./store";

let mainWindow: BrowserWindow | null = null;

app.whenReady().then(() => {
    registerIpcHandlers({
        getMainWindow: () => mainWindow,
    });
    mainWindow = createMainWindow(() => {
        if (mainWindow) {
            mainWindow = null;
        }
    });
    applyRunnerSettings(getRunnerState().settings, mainWindow);

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            mainWindow = createMainWindow(() => {
                if (mainWindow) {
                    mainWindow = null;
                }
            });
            applyRunnerSettings(getRunnerState().settings, mainWindow);
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
