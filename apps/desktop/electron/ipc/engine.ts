import { BrowserWindow, ipcMain } from "electron";
import type { RunnerEngineStatus } from "../../shared/runner-types";

const engineStartedAt = Date.now();
const engineVersion = "LOCAL ENGINE V1.0.4";
const scriptVersion = "v12";

let isEngineIpcRegistered = false;
let engineBroadcastTimer: NodeJS.Timeout | null = null;

function formatUptime(uptimeMs: number) {
    const totalMinutes = Math.max(1, Math.floor(uptimeMs / 60000));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) {
        return `${minutes}m`;
    }

    return `${hours}h ${minutes}m`;
}

async function buildEngineStatus(): Promise<RunnerEngineStatus> {
    const rawMemoryInfo = await process.getProcessMemoryInfo();
    const normalizedMemoryInfo = rawMemoryInfo as unknown as Record<string, number | undefined>;
    const memoryKb =
        normalizedMemoryInfo.workingSetSize ??
        normalizedMemoryInfo.private ??
        normalizedMemoryInfo.residentSet ??
        0;
    const memoryMb = Math.max(1, Math.round(memoryKb / 1024));
    const uptimeMs = Date.now() - engineStartedAt;

    return {
        running: true,
        uptimeMs,
        uptimeLabel: formatUptime(uptimeMs),
        memoryMb,
        memoryLabel: `${memoryMb}MB`,
        engineVersion,
        scriptVersion,
    };
}

async function broadcastEngineStatus() {
    const status = await buildEngineStatus();

    for (const window of BrowserWindow.getAllWindows()) {
        if (!window.isDestroyed()) {
            window.webContents.send("engine:status", status);
        }
    }
}

export async function pushInitialEngineStatus(window: BrowserWindow) {
    window.webContents.send("engine:status", await buildEngineStatus());
}

export function registerEngineIpc() {
    if (isEngineIpcRegistered) {
        return;
    }

    isEngineIpcRegistered = true;

    ipcMain.handle("engine:get-status", async () => {
        return buildEngineStatus();
    });

    if (!engineBroadcastTimer) {
        engineBroadcastTimer = setInterval(() => {
            void broadcastEngineStatus();
        }, 5000);
    }
}
