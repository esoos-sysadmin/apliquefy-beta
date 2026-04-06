import { ipcMain } from "electron";
import { createCampaignController } from "../controllers/campaign-controller";

let isCampaignIpcRegistered = false;

export function registerCampaignIpc() {
    if (isCampaignIpcRegistered) {
        return;
    }

    isCampaignIpcRegistered = true;
    const controller = createCampaignController();

    ipcMain.handle("campaigns:list", async () => {
        return controller.listCampaigns();
    });

    ipcMain.handle("campaigns:get-by-id", async (_event, campaignId: string) => {
        return controller.getCampaignById(campaignId);
    });

    ipcMain.handle("campaigns:pause", async (_event, campaignId: string) => {
        return controller.pauseCampaign(campaignId);
    });

    ipcMain.handle("campaigns:activate", async (_event, campaignId: string) => {
        return controller.activateCampaign(campaignId);
    });
}
