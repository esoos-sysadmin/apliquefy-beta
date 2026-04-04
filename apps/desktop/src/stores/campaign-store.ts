import type { RunnerCampaign } from "../../shared/runner-types";
import { createStore } from "./create-store";

type CampaignStoreState = {
    campaigns: RunnerCampaign[];
    isLoading: boolean;
    activeCampaign: RunnerCampaign | null;
};

const baseStore = createStore<CampaignStoreState>({
    campaigns: [],
    isLoading: true,
    activeCampaign: null,
});

function syncActiveCampaign(campaigns: RunnerCampaign[], activeCampaign: RunnerCampaign | null) {
    if (!activeCampaign) {
        return null;
    }

    return campaigns.find((campaign) => campaign.id === activeCampaign.id) ?? null;
}

export const campaignStore = {
    getState: baseStore.getState,
    setLoading(isLoading: boolean) {
        baseStore.setState((currentState) => ({
            ...currentState,
            isLoading,
        }));
    },
    hydrateCampaigns(campaigns: RunnerCampaign[]) {
        baseStore.setState((currentState) => ({
            campaigns,
            isLoading: false,
            activeCampaign: syncActiveCampaign(campaigns, currentState.activeCampaign),
        }));
    },
    replaceCampaigns(campaigns: RunnerCampaign[]) {
        baseStore.setState((currentState) => ({
            ...currentState,
            campaigns,
            activeCampaign: syncActiveCampaign(campaigns, currentState.activeCampaign),
        }));
    },
    openCampaignDetails(campaign: RunnerCampaign) {
        baseStore.setState((currentState) => ({
            ...currentState,
            activeCampaign: campaign,
        }));
    },
    closeCampaignDetails() {
        baseStore.setState((currentState) => ({
            ...currentState,
            activeCampaign: null,
        }));
    },
};

export function useCampaignStore<Selected>(selector: (state: CampaignStoreState) => Selected) {
    return baseStore.useStore(selector);
}
