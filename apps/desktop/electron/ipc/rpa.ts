import { ipcMain } from "electron";
import { getRpaStatus, rpaApiRequest, startRpaProcess, stopRpaProcess, getRpaAuthToken } from "../services/rpa-process-service";
import { subscribeRunEvents, unsubscribeRunEvents } from "../services/rpa-events-service";
import type { RpaRunRequest, RpaRunResponse, RpaStatus } from "../../shared/runner-types";

let registered = false;

export function registerRpaIpc() {
    if (registered) return;
    registered = true;

    ipcMain.handle("rpa:status", async (): Promise<RpaStatus> => {
        return getRpaStatus();
    });

    ipcMain.handle("rpa:ensure-started", async (): Promise<RpaStatus> => {
        await startRpaProcess();
        return getRpaStatus();
    });

    ipcMain.handle("rpa:stop", async (): Promise<RpaStatus> => {
        stopRpaProcess();
        return getRpaStatus();
    });

    ipcMain.handle("rpa:start-run", async (_event, request: RpaRunRequest): Promise<RpaRunResponse> => {
        const response = await rpaApiRequest<RpaRunResponse>("/runs", {
            method: "POST",
            body: JSON.stringify(request),
        });
        const token = getRpaAuthToken();
        if (token) {
            try {
                subscribeRunEvents(response.runId, token);
            } catch (err) {
                console.error("[rpa] failed to subscribe events:", err);
            }
        }
        return response;
    });

    ipcMain.handle("rpa:stop-run", async (_event, runId: string): Promise<{ success: boolean }> => {
        unsubscribeRunEvents(runId);
        return rpaApiRequest<{ success: boolean }>(`/runs/${runId}`, { method: "DELETE" });
    });
}
