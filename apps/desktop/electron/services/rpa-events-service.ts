import { BrowserWindow } from "electron";
import { getRpaStatus } from "./rpa-process-service";
import { getSessionController } from "../controllers/session-controller";
import { fetchCampaigns, updateCampaignStatus } from "./campaign-service";
import { maybeShowRunnerNotification } from "../notifications";
import { updateRunnerState } from "../store";
import type { RpaEvent, RunnerPlatform } from "../../shared/runner-types";

const sockets = new Map<string, WebSocket>();

type RunContext = { campaignId: string; platform: RunnerPlatform };
const runContexts = new Map<string, RunContext>();

// campaign-run-service registra o contexto do run para que, ao receber um evento
// de sessão inválida, saibamos qual plataforma/campanha corrigir.
export function registerRunContext(runId: string, context: RunContext) {
    runContexts.set(runId, context);
}

function broadcast(event: RpaEvent) {
    for (const window of BrowserWindow.getAllWindows()) {
        if (!window.isDestroyed()) {
            window.webContents.send("rpa:event", event);
        }
    }
}

// O run provou (navegando /feed) que a sessão está morta. A validação por cookie
// não pega isso (li_at presente mas inválido no servidor), então REMOVE a sessão —
// senão o cookie morto voltaria a dar falso "ativo" — e pausa a campanha. O
// usuário reconecta.
async function handleSessionInvalid(runId: string) {
    const context = runContexts.get(runId);
    if (!context) {
        return;
    }

    await getSessionController().remove(context.platform);

    try {
        await updateCampaignStatus(`/api/campaigns/${context.campaignId}/pause`);
        const refreshed = await fetchCampaigns();
        updateRunnerState((state) => ({ ...state, campaigns: refreshed }));
    } catch (error) {
        console.error("[rpa-events] failed to pause campaign after session loss:", error);
    }

    maybeShowRunnerNotification(
        "Sessão expirada",
        `Sua sessão do ${context.platform === "linkedin" ? "LinkedIn" : "InfoJobs"} expirou. Reconecte para continuar.`
    );
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
            if (payload.type === "paused" && payload.reason === "session_invalid") {
                void handleSessionInvalid(runId);
            }
            broadcast(payload);
            if (payload.type === "finished") {
                ws.close();
            }
        } catch (err) {
            console.error("[rpa-events] parse failed:", err);
        }
    });

    ws.addEventListener("close", () => {
        sockets.delete(runId);
        runContexts.delete(runId);
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
