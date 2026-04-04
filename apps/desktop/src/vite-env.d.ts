/// <reference types="vite/client" />

import type { ElectronAPI } from "../shared/runner-types";

declare global {
    interface Window {
        electronAPI?: ElectronAPI;
    }
}
