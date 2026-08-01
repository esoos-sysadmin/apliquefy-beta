import { ipcMain } from "electron";
import type { RunnerPlatform } from "../../shared/runner-types";
import { maybeShowRunnerNotification } from "../notifications";
import { getRunnerState, updateRunnerState } from "../store";

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
        const session = getRunnerState().sessions[platform];
        const isSessionActive = session?.status === "active";

        const nextState = updateRunnerState((currentState) => ({
            ...currentState,
            account: {
                ...currentState.account,
                connected: isSessionActive,
                platform: isSessionActive ? platform : currentState.account.platform,
            },
        }));

        if (isSessionActive) {
            maybeShowRunnerNotification(
                "Account connected",
                `Sessão ativa para ${platform === "linkedin" ? "LinkedIn" : "InfoJobs"}.`
            );
        }

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
