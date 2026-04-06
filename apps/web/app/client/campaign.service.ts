import { ApiClient } from "../lib/api-client";
import type {
    Campaign,
    CreateInfojobsCampaignInput,
    CreateLinkedinCampaignInput,
    UpdateCampaignInput,
} from "../types/campaign";
import type { ApiSuccessResponse } from "../types/api";

function unwrapCampaignPayload(payload: unknown) {
    if (payload && typeof payload === "object" && "data" in payload) {
        return payload.data;
    }

    return payload;
}

export async function getCampaigns(api: ApiClient) {
    const response = await api.get<ApiSuccessResponse<Campaign[]>>("/campaigns");
    return (unwrapCampaignPayload(response) as Campaign[] | undefined) ?? [];
}

export async function createLinkedinCampaign(api: ApiClient, body: CreateLinkedinCampaignInput) {
    const response = await api.post<ApiSuccessResponse<Campaign>>("/campaigns/linkedin", body);
    return unwrapCampaignPayload(response) as Campaign;
}

export async function createInfojobsCampaign(api: ApiClient, body: CreateInfojobsCampaignInput) {
    const response = await api.post<ApiSuccessResponse<Campaign>>("/campaigns/infojobs", body);
    return unwrapCampaignPayload(response) as Campaign;
}

export async function updateCampaign(api: ApiClient, id: string, body: UpdateCampaignInput) {
    const response = await api.patch<ApiSuccessResponse<Campaign>>(`/campaigns/${id}`, body);
    return unwrapCampaignPayload(response) as Campaign;
}

export async function pauseCampaign(api: ApiClient, id: string) {
    const response = await api.patch<ApiSuccessResponse<Campaign>>(`/campaigns/${id}/pause`);
    return unwrapCampaignPayload(response) as Campaign;
}

export async function activateCampaign(api: ApiClient, id: string) {
    const response = await api.patch<ApiSuccessResponse<Campaign>>(`/campaigns/${id}/activate`);
    return unwrapCampaignPayload(response) as Campaign;
}

export async function deleteCampaign(api: ApiClient, id: string) {
    return api.delete<ApiSuccessResponse<null>>(`/campaigns/${id}`);
}
