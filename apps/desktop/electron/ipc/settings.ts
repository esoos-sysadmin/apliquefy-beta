import { app, BrowserWindow, ipcMain } from "electron";
import type { RunnerSettings } from "../../shared/runner-types";
import { getRunnerState, updateRunnerState } from "../store";

type SettingsIpcOptions = {
    getMainWindow: () => BrowserWindow | null;
};

let isSettingsIpcRegistered = false;

export function applyRunnerSettings(settings: RunnerSettings, window: BrowserWindow | null) {
    try {
        app.setLoginItemSettings({ openAtLogin: settings.startWithWindows });
    } catch (error) {
        console.error("Failed to apply login item settings:", error);
    }

    if (window && !window.isDestroyed()) {
        window.setAlwaysOnTop(settings.alwaysOnTop);
    }
}

export function registerSettingsIpc(options: SettingsIpcOptions) {
    if (isSettingsIpcRegistered) {
        return;
    }

    isSettingsIpcRegistered = true;

    ipcMain.handle("settings:get", async () => {
        return getRunnerState().settings;
    });

    ipcMain.handle("settings:save", async (_event, patch: Partial<RunnerSettings>) => {
        const nextState = updateRunnerState((currentState) => ({
            ...currentState,
            settings: {
                ...currentState.settings,
                ...patch,
            },
        }));

        applyRunnerSettings(nextState.settings, options.getMainWindow());

        return nextState.settings;
    });
}
