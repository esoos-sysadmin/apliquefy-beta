import { ipcMain } from "electron";
import { maybeShowRunnerNotification } from "../notifications";
import { getRunnerState, updateRunnerState } from "../store";

let isCampaignIpcRegistered = false;

function updateCampaignStatus(campaignId: string, nextStatus: "active" | "paused") {
    const nextState = updateRunnerState((currentState) => ({
        ...currentState,
        campaigns: currentState.campaigns.map((campaign) =>
            campaign.id === campaignId
                ? {
                      ...campaign,
                      status: nextStatus,
                      lastUpdated: "Just now",
                  }
                : campaign
        ),
    }));

    return nextState.campaigns;
}

export function registerCampaignIpc() {
    if (isCampaignIpcRegistered) {
        return;
    }

    isCampaignIpcRegistered = true;

    ipcMain.handle("campaigns:list", async () => {
        return getRunnerState().campaigns;
    });

    ipcMain.handle("campaigns:pause", async (_event, campaignId: string) => {
        const campaigns = updateCampaignStatus(campaignId, "paused");
        const pausedCampaign = campaigns.find((campaign) => campaign.id === campaignId);

        if (pausedCampaign) {
            maybeShowRunnerNotification("Campaign paused", `${pausedCampaign.name} was paused in the runner.`);
        }

        return campaigns;
    });

    ipcMain.handle("campaigns:resume", async (_event, campaignId: string) => {
        const campaigns = updateCampaignStatus(campaignId, "active");
        const resumedCampaign = campaigns.find((campaign) => campaign.id === campaignId);

        if (resumedCampaign) {
            maybeShowRunnerNotification("Campaign resumed", `${resumedCampaign.name} is active again.`);
        }

        return campaigns;
    });
}
