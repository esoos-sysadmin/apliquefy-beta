import { app, BrowserWindow, ipcMain } from "electron";

let isWindowIpcRegistered = false;

export function registerWindowIpc() {
    if (isWindowIpcRegistered) {
        return;
    }

    isWindowIpcRegistered = true;

    ipcMain.handle("window:close", async () => {
        app.quit();
    });

    ipcMain.handle("window:minimize", async (event) => {
        BrowserWindow.fromWebContents(event.sender)?.minimize();
    });
}
