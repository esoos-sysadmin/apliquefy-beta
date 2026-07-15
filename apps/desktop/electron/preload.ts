import { contextBridge, ipcRenderer } from "electron";
import type { ElectronAPI, RpaEvent, RunnerEngineStatus, RunnerSessionMap } from "../shared/runner-types";

const electronAPI: ElectronAPI = {
    window: {
        close: () => ipcRenderer.invoke("window:close"),
    },
    assistant: {
        transcribe: (audioBase64: string) => ipcRenderer.invoke("assistant:transcribe", audioBase64),
        chat: (messages, persona) => ipcRenderer.invoke("assistant:chat", messages, persona),
        speak: (text, persona) => ipcRenderer.invoke("assistant:speak", text, persona),
    },
    campaigns: {
        list: () => ipcRenderer.invoke("campaigns:list"),
        getById: (id: string) => ipcRenderer.invoke("campaigns:get-by-id", id),
        pause: (id: string) => ipcRenderer.invoke("campaigns:pause", id),
        activate: (id: string) => ipcRenderer.invoke("campaigns:activate", id),
    },
    accounts: {
        get: () => ipcRenderer.invoke("accounts:get"),
        connect: (platform) => ipcRenderer.invoke("accounts:connect", platform),
        disconnect: () => ipcRenderer.invoke("accounts:disconnect"),
    },
    settings: {
        get: () => ipcRenderer.invoke("settings:get"),
        save: (patch) => ipcRenderer.invoke("settings:save", patch),
    },
    auth: {
        getState: () => ipcRenderer.invoke("auth:get-state"),
        signIn: () => ipcRenderer.invoke("auth:sign-in"),
        signOut: () => ipcRenderer.invoke("auth:sign-out"),
    },
    engine: {
        getStatus: () => ipcRenderer.invoke("engine:get-status"),
        subscribe: (listener: (status: RunnerEngineStatus) => void) => {
            const handleEngineStatus = (_event: Electron.IpcRendererEvent, status: RunnerEngineStatus) => {
                listener(status);
            };

            ipcRenderer.on("engine:status", handleEngineStatus);

            return () => {
                ipcRenderer.removeListener("engine:status", handleEngineStatus);
            };
        },
    },
    credits: {
        getBalance: () => ipcRenderer.invoke("credits:get-balance"),
    },
    sessions: {
        capture: (platform) => ipcRenderer.invoke("sessions:capture", platform),
        check: (platform) => ipcRenderer.invoke("sessions:check", platform),
        list: () => ipcRenderer.invoke("sessions:list"),
        remove: (platform) => ipcRenderer.invoke("sessions:remove", platform),
        subscribe: (listener: (sessions: RunnerSessionMap) => void) => {
            const handler = (_event: Electron.IpcRendererEvent, sessions: RunnerSessionMap) => {
                listener(sessions);
            };
            ipcRenderer.on("sessions:changed", handler);
            return () => {
                ipcRenderer.removeListener("sessions:changed", handler);
            };
        },
    },
    rpa: {
        status: () => ipcRenderer.invoke("rpa:status"),
        ensureStarted: () => ipcRenderer.invoke("rpa:ensure-started"),
        stop: () => ipcRenderer.invoke("rpa:stop"),
        startRun: (request) => ipcRenderer.invoke("rpa:start-run", request),
        stopRun: (runId) => ipcRenderer.invoke("rpa:stop-run", runId),
        subscribe: (listener: (event: RpaEvent) => void) => {
            const handler = (_event: Electron.IpcRendererEvent, payload: RpaEvent) => {
                listener(payload);
            };
            ipcRenderer.on("rpa:event", handler);
            return () => {
                ipcRenderer.removeListener("rpa:event", handler);
            };
        },
    },
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);
