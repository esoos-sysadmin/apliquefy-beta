import { BrowserWindow, shell } from "electron";
import path from "node:path";
import { pushInitialEngineStatus } from "../ipc/engine";

const isDev = process.env.NODE_ENV === "development";

export function createMainWindow(onClosed: () => void) {
    const window = new BrowserWindow({
        width: 1000,
        height: 600,
        minWidth: 1000,
        minHeight: 600,
        maxWidth: 1000,
        maxHeight: 600,
        frame: false,
        transparent: false,
        resizable: false,
        maximizable: false,
        fullscreenable: false,
        show: false,
        backgroundColor: "#0d1117",
        titleBarStyle: process.platform === "darwin" ? "hiddenInset" : undefined,
        webPreferences: {
            preload: path.join(__dirname, "../preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,
        },
    });

    window.setMenuBarVisibility(false);
    window.removeMenu();

    // O Apollo usa o microfone (getUserMedia → Whisper). Sem esses handlers o Chromium
    // do Electron nega 'media' silenciosamente. Só liberamos mídia; o resto continua negado.
    window.webContents.session.setPermissionRequestHandler((_wc, permission, callback) => {
        callback(permission === "media");
    });
    window.webContents.session.setPermissionCheckHandler((_wc, permission) => permission === "media");
    window.once("ready-to-show", () => {
        window.show();
        void pushInitialEngineStatus(window);
    });

    window.on("closed", onClosed);

    window.webContents.setWindowOpenHandler(({ url }) => {
        void shell.openExternal(url);
        return { action: "deny" };
    });

    if (isDev) {
        void window.loadURL("http://localhost:5173");
    } else {
        // __dirname = dist-electron/electron/main → 3 níveis até a raiz do app
        void window.loadFile(path.join(__dirname, "../../../dist-react/index.html"));
    }

    return window;
}
