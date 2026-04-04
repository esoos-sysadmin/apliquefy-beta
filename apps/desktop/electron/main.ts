import { app, BrowserWindow, shell } from "electron";
import path from "node:path";
import { pushInitialEngineStatus, registerEngineIpc } from "./ipc/engine";
import { registerCampaignIpc } from "./ipc/campaigns";
import { registerAccountsIpc } from "./ipc/accounts";
import { applyRunnerSettings, registerSettingsIpc } from "./ipc/settings";
import { registerWindowIpc } from "./ipc/window";
import { registerAuthIpc } from "./ipc/auth";
import { getRunnerState } from "./store";

const isDev = process.env.NODE_ENV === "development";

let mainWindow: BrowserWindow | null = null;

function createMainWindow() {
    const window = new BrowserWindow({
        width: 380,
        height: 620,
        minWidth: 380,
        minHeight: 620,
        maxWidth: 380,
        maxHeight: 620,
        frame: false,
        transparent: true,
        resizable: false,
        maximizable: false,
        fullscreenable: false,
        show: false,
        backgroundColor: "#00000000",
        titleBarStyle: process.platform === "darwin" ? "hiddenInset" : undefined,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,
        },
    });

    window.setMenuBarVisibility(false);
    window.removeMenu();
    window.once("ready-to-show", () => {
        window.show();
        void pushInitialEngineStatus(window);
    });

    window.on("closed", () => {
        if (mainWindow === window) {
            mainWindow = null;
        }
    });

    window.webContents.setWindowOpenHandler(({ url }) => {
        void shell.openExternal(url);
        return { action: "deny" };
    });

    if (isDev) {
        void window.loadURL("http://localhost:5173");
    } else {
        void window.loadFile(path.join(__dirname, "../dist-react/index.html"));
    }

    return window;
}

function registerIpcHandlers() {
    registerWindowIpc();
    registerCampaignIpc();
    registerAccountsIpc();
    registerEngineIpc();
    registerAuthIpc({
        getMainWindow: () => mainWindow,
    });
    registerSettingsIpc({
        getMainWindow: () => mainWindow,
    });
}

app.whenReady().then(() => {
    registerIpcHandlers();
    mainWindow = createMainWindow();
    applyRunnerSettings(getRunnerState().settings, mainWindow);

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            mainWindow = createMainWindow();
            applyRunnerSettings(getRunnerState().settings, mainWindow);
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
