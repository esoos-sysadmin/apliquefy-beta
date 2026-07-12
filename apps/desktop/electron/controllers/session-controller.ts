import { BrowserWindow } from "electron";
import type {
    RunnerPlatform,
    RunnerSessionMap,
    RunnerSessionState,
    SessionResult,
} from "../../shared/runner-types";
import {
    captureSession,
    hasStoredSession,
    removeSessionFiles,
    validateSession,
} from "../services/session-service";
import { getRunnerState, updateRunnerState } from "../store";

const SESSIONS_CHANGED_CHANNEL = "sessions:changed";

function broadcastSessions(sessions: RunnerSessionMap) {
    BrowserWindow.getAllWindows().forEach((window) => {
        if (!window.isDestroyed()) {
            window.webContents.send(SESSIONS_CHANGED_CHANNEL, sessions);
        }
    });
}

function persistSession(platform: RunnerPlatform, session: RunnerSessionState | null) {
    const next = updateRunnerState((state) => {
        const sessions = { ...state.sessions };
        if (session) {
            sessions[platform] = session;
        } else {
            delete sessions[platform];
        }
        return { ...state, sessions };
    });

    broadcastSessions(next.sessions);
    return next.sessions;
}

export function createSessionController() {
    return {
        async list(): Promise<RunnerSessionMap> {
            return getRunnerState().sessions;
        },

        async check(platform: RunnerPlatform): Promise<RunnerSessionState | null> {
            const current = getRunnerState().sessions[platform];

            if (!hasStoredSession(platform)) {
                if (current) {
                    persistSession(platform, null);
                }
                return null;
            }

            const result = await validateSession(platform);
            if (result.success && result.session) {
                const merged: RunnerSessionState = {
                    ...result.session,
                    capturedAt: current?.capturedAt ?? result.session.capturedAt,
                };
                persistSession(platform, merged);
                return merged;
            }

            const invalid: RunnerSessionState = {
                platform,
                status: result.code === 401 ? "expired" : "invalid",
                capturedAt: current?.capturedAt ?? null,
                lastValidatedAt: new Date().toISOString(),
                storagePath: current?.storagePath ?? null,
            };
            persistSession(platform, invalid);
            return invalid;
        },

        async capture(platform: RunnerPlatform): Promise<SessionResult> {
            const result = await captureSession(platform);

            if (result.success && result.session) {
                persistSession(platform, result.session);
            } else {
                const pending: RunnerSessionState = {
                    platform,
                    status: result.code === 401 ? "expired" : "invalid",
                    capturedAt: null,
                    lastValidatedAt: new Date().toISOString(),
                    storagePath: null,
                };
                persistSession(platform, pending);
            }

            return result;
        },

        async remove(platform: RunnerPlatform): Promise<RunnerSessionMap> {
            removeSessionFiles(platform);
            return persistSession(platform, null);
        },

        invalidate(platform: RunnerPlatform, reason: "expired" | "invalid" = "invalid") {
            const current = getRunnerState().sessions[platform];
            const invalid: RunnerSessionState = {
                platform,
                status: reason,
                capturedAt: current?.capturedAt ?? null,
                lastValidatedAt: new Date().toISOString(),
                storagePath: current?.storagePath ?? null,
            };
            persistSession(platform, invalid);
        },
    };
}

export type SessionController = ReturnType<typeof createSessionController>;

let singleton: SessionController | null = null;

export function getSessionController(): SessionController {
    if (!singleton) {
        singleton = createSessionController();
    }
    return singleton;
}

export const SESSIONS_BROADCAST_CHANNEL = SESSIONS_CHANGED_CHANNEL;
