import { BrowserWindow } from "electron";
import { getRpaStatus } from "./rpa-process-service";
import type { RpaEvent } from "../../shared/runner-types";

const sockets = new Map<string, WebSocket>();

function broadcast(event: RpaEvent) {
    for (const window of BrowserWindow.getAllWindows()) {
        if (!window.isDestroyed()) {
            window.webContents.send("rpa:event", event);
        }
    }
}

/**
 * Subscribes to a run's WebSocket event stream and forwards events
 * into the renderer via `webContents.send("rpa:event", ...)`.
 *
 * Uses the global WebSocket available in Node 22+ / Electron's Chromium runtime.
 * Auth header is not supported by the WHATWG client, so the token is sent
 * as a query string parameter the engine accepts as fallback.
 */
export function subscribeRunEvents(runId: string, token: string): void {
    const status = getRpaStatus();
    if (!status.running || !status.port) {
        throw new Error("RPA engine is not running");
    }

    if (sockets.has(runId)) return;

    const url = `ws://127.0.0.1:${status.port}/runs/${runId}/events?token=${encodeURIComponent(token)}`;
    const ws = new WebSocket(url);

    ws.addEventListener("message", (event) => {
        try {
            const data = typeof event.data === "string" ? event.data : "";
            if (!data) return;
            const payload = JSON.parse(data) as RpaEvent;
            broadcast(payload);
            if ("type" in payload && payload.type === "finished") {
                ws.close();
            }
        } catch (err) {
            console.error("[rpa-events] parse failed:", err);
        }
    });

    ws.addEventListener("close", () => {
        sockets.delete(runId);
    });

    ws.addEventListener("error", (err) => {
        console.error(`[rpa-events] socket error for run ${runId}:`, err);
    });

    sockets.set(runId, ws);
}

export function unsubscribeRunEvents(runId: string): void {
    const ws = sockets.get(runId);
    if (!ws) return;
    ws.close();
    sockets.delete(runId);
}
