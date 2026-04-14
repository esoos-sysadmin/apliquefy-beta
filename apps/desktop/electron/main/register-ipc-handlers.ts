import type { BrowserWindow } from "electron";
import { registerAccountsIpc } from "../ipc/accounts";
import { registerAuthIpc } from "../ipc/auth";
import { registerCampaignIpc } from "../ipc/campaigns";
import { registerCreditIpc } from "../ipc/credits";
import { registerEngineIpc } from "../ipc/engine";
import { registerSettingsIpc } from "../ipc/settings";
import { registerWindowIpc } from "../ipc/window";

type RegisterIpcHandlersOptions = {
    getMainWindow: () => BrowserWindow | null;
};

export function registerIpcHandlers(options: RegisterIpcHandlersOptions) {
    registerWindowIpc();
    registerCampaignIpc();
    registerAccountsIpc();
    registerCreditIpc();
    registerEngineIpc();
    registerAuthIpc({
        getMainWindow: options.getMainWindow,
    });
    registerSettingsIpc({
        getMainWindow: options.getMainWindow,
    });
}
