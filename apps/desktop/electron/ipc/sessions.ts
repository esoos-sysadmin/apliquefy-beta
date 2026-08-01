import { ipcMain } from "electron";
import type { RunnerPlatform } from "../../shared/runner-types";
import { getSessionController } from "../controllers/session-controller";

let isSessionsIpcRegistered = false;

export function registerSessionsIpc() {
    if (isSessionsIpcRegistered) {
        return;
    }
    isSessionsIpcRegistered = true;

    const controller = getSessionController();

    ipcMain.handle("sessions:list", async () => controller.list());
    ipcMain.handle("sessions:check", async (_event, platform: RunnerPlatform) =>
        controller.check(platform)
    );
    ipcMain.handle("sessions:capture", async (_event, platform: RunnerPlatform) =>
        controller.capture(platform)
    );
    ipcMain.handle("sessions:remove", async (_event, platform: RunnerPlatform) =>
        controller.remove(platform)
    );
}
