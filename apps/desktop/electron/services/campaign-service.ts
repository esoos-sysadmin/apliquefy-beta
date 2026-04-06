import type { RunnerCampaign, RunnerCampaignApiModel } from "../../shared/runner-types";
import { mapCampaign } from "../helpers/campaign-mappers";
import { apiRequest } from "./backend-api-service";

export async function fetchCampaigns() {
    const response = await apiRequest<{ data?: RunnerCampaignApiModel[]; success?: boolean }>("/api/campaigns");
    return (response.data ?? []).map(mapCampaign);
}

export async function fetchCampaignById(campaignId: string) {
    const response = await apiRequest<{ data?: RunnerCampaignApiModel; success?: boolean }>(`/api/campaigns/${campaignId}`);
    return response.data ? mapCampaign(response.data) : null;
}

export async function updateCampaignStatus(path: string) {
    await apiRequest(path, { method: "PATCH" });
    return fetchCampaigns();
}

export function persistCampaigns(campaigns: RunnerCampaign[]) {
    return campaigns;
}
