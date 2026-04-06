import type { ElectronAPI, RunnerSettings } from "../../shared/runner-types";
import { settingsStore } from "../stores/settings-store";

export function useSettingsActions(electron: ElectronAPI) {
    const handleToggleSetting = (key: keyof RunnerSettings, value: boolean) => {
        settingsStore.setDraftSetting(key, value);

        if (key === "alwaysOnTop") {
            void electron.settings
                .save({ alwaysOnTop: value })
                .then(() => {
                    settingsStore.syncImmediateSetting("alwaysOnTop", value);
                })
                .catch((error) => {
                    console.error("Failed to toggle always on top:", error);
                });
        }
    };

    const handleSaveSettings = async () => {
        settingsStore.startSaving();

        try {
            const { draftSettings: currentSettings } = settingsStore.getState();
            const savedSettings = await electron.settings.save(currentSettings);
            settingsStore.finishSaving(savedSettings);
        } catch (error) {
            console.error("Failed to save runner settings:", error);
            settingsStore.stopSaving();
        }
    };

    return {
        handleToggleSetting,
        handleSaveSettings,
    };
}
