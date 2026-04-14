import { contextBridge, ipcRenderer } from "electron";
import type { ElectronAPI, RunnerEngineStatus } from "../shared/runner-types";

const electronAPI: ElectronAPI = {
    window: {
        close: () => ipcRenderer.invoke("window:close"),
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
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);
