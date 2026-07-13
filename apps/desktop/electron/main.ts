import { app, BrowserWindow } from "electron";
import path from "node:path";
import { applyRunnerSettings } from "./ipc/settings";
import { createMainWindow } from "./main/create-main-window";
import { registerIpcHandlers } from "./main/register-ipc-handlers";
import { resetActiveCampaignsToPaused } from "./services/campaign-service";
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

// Desliga aceleração de GPU: evita glitches de render do Chromium/Electron em
// alguns setups Linux (ex.: Pop!_OS/Mesa). Se causar lentidão em máquina com GPU
// ok, remover.
app.disableHardwareAcceleration()

app.whenReady().then(async () => {
    registerIpcHandlers({
        getMainWindow: () => mainWindow,
    });

    // Reseta campanhas órfãs para PAUSED antes de abrir a janela, para que o feed
    // não volte "bugado" mostrando ativa uma campanha que não está rodando.
    // ponytail: cap de 5s para um backend lento não travar o boot; o pior caso é
    // a janela abrir e o feed atualizar sozinho (bootstrap refaz o list()).
    await Promise.race([
        resetActiveCampaignsToPaused().catch((err) => {
            console.error("[boot] failed to reset campaigns to paused:", err);
        }),
        new Promise<void>((resolve) => setTimeout(resolve, 5000)),
    ]);

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
