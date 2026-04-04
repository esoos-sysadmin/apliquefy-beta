import { contextBridge, ipcRenderer } from "electron";
import type { ElectronAPI, RunnerEngineStatus } from "../shared/runner-types";

const electronAPI: ElectronAPI = {
    window: {
        close: () => ipcRenderer.invoke("window:close"),
    },
    campaigns: {
        list: () => ipcRenderer.invoke("campaigns:list"),
        pause: (id: string) => ipcRenderer.invoke("campaigns:pause", id),
        resume: (id: string) => ipcRenderer.invoke("campaigns:resume", id),
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
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);
