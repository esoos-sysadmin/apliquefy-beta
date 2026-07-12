import { app, BrowserWindow } from "electron";
import path from "node:path";
import { applyRunnerSettings } from "./ipc/settings";
import { createMainWindow } from "./main/create-main-window";
import { registerIpcHandlers } from "./main/register-ipc-handlers";
import { startRpaProcess, stopRpaProcess } from "./services/rpa-process-service";
import { startSessionHeartbeat, stopSessionHeartbeat } from "./services/session-heartbeat";
import { getRunnerState } from "./store";

// Carrega apps/desktop/.env (ex.: OPENAI_API_KEY) em process.env antes de iniciar
// o engine RPA, que herda essas vars via buildEnv. Node 20.12+/22 tem suporte
// nativo a loadEnvFile; se o arquivo não existir (app empacotado), ignora.
const loadEnvFile = (process as { loadEnvFile?: (filePath?: string) => void }).loadEnvFile;
if (typeof loadEnvFile === "function") {
    try {
        loadEnvFile(path.resolve(__dirname, "../../.env"));
    } catch {
        // .env ausente — segue com o ambiente atual
    }
}

let mainWindow: BrowserWindow | null = null;

app.disableHardwareAcceleration()

app.whenReady().then(() => {
    registerIpcHandlers({
        getMainWindow: () => mainWindow,
    });
    mainWindow = createMainWindow(() => {
        if (mainWindow) {
            mainWindow = null;
        }
    });

    // mainWindow.webContents.openDevTools()

    applyRunnerSettings(getRunnerState().settings, mainWindow);

    startSessionHeartbeat();

    void startRpaProcess().catch((err) => {
        console.error("[robots] failed to start:", err);
    });

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
        stopSessionHeartbeat();
        app.quit();
    }
});

app.on("before-quit", () => {
    stopSessionHeartbeat();
    stopRpaProcess();
});
