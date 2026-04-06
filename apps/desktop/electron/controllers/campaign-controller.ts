import { getRunnerState, updateRunnerState } from "../store";
import { fetchCampaignById, fetchCampaigns, updateCampaignStatus } from "../services/campaign-service";
import { notifyCampaignActivated, notifyCampaignPaused } from "../services/notification-service";

function persistCampaigns(campaigns: Awaited<ReturnType<typeof fetchCampaigns>>) {
    const nextState = updateRunnerState((currentState) => ({
        ...currentState,
        campaigns,
    }));

    return nextState.campaigns;
}

export function createCampaignController() {
    return {
        async listCampaigns() {
            try {
                const campaigns = await fetchCampaigns();
                return persistCampaigns(campaigns);
            } catch (error) {
                console.error("Failed to list campaigns from backend:", error);
                return getRunnerState().campaigns;
            }
        },
        async getCampaignById(campaignId: string) {
            try {
                return await fetchCampaignById(campaignId);
            } catch (error) {
                console.error("Failed to fetch campaign details from backend:", error);
                return getRunnerState().campaigns.find((campaign) => campaign.id === campaignId) ?? null;
            }
        },
        async pauseCampaign(campaignId: string) {
            const campaigns = persistCampaigns(await updateCampaignStatus(`/api/campaigns/${campaignId}/pause`));
            const pausedCampaign = campaigns.find((campaign) => campaign.id === campaignId);

            if (pausedCampaign) {
                notifyCampaignPaused(pausedCampaign.name);
            }

            return campaigns;
        },
        async activateCampaign(campaignId: string) {
            const campaigns = persistCampaigns(await updateCampaignStatus(`/api/campaigns/${campaignId}/activate`));
            const activatedCampaign = campaigns.find((campaign) => campaign.id === campaignId);

            if (activatedCampaign) {
                notifyCampaignActivated(activatedCampaign.name);
            }

            return campaigns;
        },
    };
}
