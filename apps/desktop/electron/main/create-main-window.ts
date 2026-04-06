import { BrowserWindow, shell } from "electron";
import path from "node:path";
import { pushInitialEngineStatus } from "../ipc/engine";

const isDev = process.env.NODE_ENV === "development";

export function createMainWindow(onClosed: () => void) {
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
            preload: path.join(__dirname, "../preload.js"),
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

    window.on("closed", onClosed);

    window.webContents.setWindowOpenHandler(({ url }) => {
        void shell.openExternal(url);
        return { action: "deny" };
    });

    if (isDev) {
        void window.loadURL("http://localhost:5173");
    } else {
        void window.loadFile(path.join(__dirname, "../../dist-react/index.html"));
    }

    return window;
}
