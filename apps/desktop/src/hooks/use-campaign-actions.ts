import type { ElectronAPI, RunnerCampaign } from "../../shared/runner-types";
import { campaignStore } from "../stores/campaign-store";

export function useCampaignActions(electron: ElectronAPI) {
    const handleToggleCampaign = async (campaign: RunnerCampaign) => {
        const nextCampaigns =
            campaign.status === "active"
                ? await electron.campaigns.pause(campaign.id)
                : await electron.campaigns.activate(campaign.id);

        campaignStore.replaceCampaigns(nextCampaigns);
    };

    const handleViewCampaign = async (campaign: RunnerCampaign) => {
        try {
            const campaignDetails = await electron.campaigns.getById(campaign.id);
            campaignStore.openCampaignDetails(campaignDetails ?? campaign);
        } catch (error) {
            console.error("Failed to fetch campaign details:", error);
            campaignStore.openCampaignDetails(campaign);
        }
    };

    const handleRefreshCampaigns = async () => {
        campaignStore.setLoading(true);
        try {
            const campaigns = await electron.campaigns.list();
            campaignStore.hydrateCampaigns(campaigns);
        } catch (error) {
            console.error("Failed to refresh campaigns:", error);
            campaignStore.setLoading(false);
        }
    };

    return {
        handleToggleCampaign,
        handleViewCampaign,
        handleRefreshCampaigns,
    };
}
