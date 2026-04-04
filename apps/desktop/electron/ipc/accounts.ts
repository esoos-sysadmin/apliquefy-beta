import { ipcMain, shell } from "electron";
import type { RunnerPlatform } from "../../shared/runner-types";
import { maybeShowRunnerNotification } from "../notifications";
import { getPlatformLoginUrl, getRunnerState, updateRunnerState } from "../store";

let isAccountsIpcRegistered = false;

export function registerAccountsIpc() {
    if (isAccountsIpcRegistered) {
        return;
    }

    isAccountsIpcRegistered = true;

    ipcMain.handle("accounts:get", async () => {
        return getRunnerState().account;
    });

    ipcMain.handle("accounts:connect", async (_event, platform: RunnerPlatform) => {
        void shell.openExternal(getPlatformLoginUrl(platform));

        const nextState = updateRunnerState((currentState) => ({
            ...currentState,
            account: {
                ...currentState.account,
                connected: true,
                platform,
            },
        }));

        maybeShowRunnerNotification(
            "Account connected",
            `Mock connection enabled for ${platform === "linkedin" ? "LinkedIn" : "InfoJobs"}.`
        );

        return nextState.account;
    });

    ipcMain.handle("accounts:disconnect", async () => {
        const nextState = updateRunnerState((currentState) => ({
            ...currentState,
            account: {
                ...currentState.account,
                connected: false,
                platform: null,
            },
        }));

        maybeShowRunnerNotification("Account disconnected", "The local automation account was disconnected.");

        return nextState.account;
    });
}
