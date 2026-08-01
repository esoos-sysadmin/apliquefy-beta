import type { RunnerCampaign, RunnerCampaignApiModel } from "../../shared/runner-types";
import { mapCampaign } from "../helpers/campaign-mappers";
import { apiRequest } from "./backend-api-service";
import { updateRunnerState } from "../store";

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

/**
 * Uma campanha só é "ativa" enquanto o app está de pé rodando o run. Chamado no
 * quit (caminho normal) e no boot (rede de segurança para crash/kill -9, quando o
 * quit não rodou). Reseta todas para PAUSED; o usuário reativa manualmente com o
 * play. No-op rápido se não houver login.
 */
export async function resetActiveCampaignsToPaused() {
    let campaigns: RunnerCampaign[];
    try {
        campaigns = await fetchCampaigns();
    } catch {
        return; // sem token/backend indisponível — nada a resetar
    }

    const active = campaigns.filter((campaign) => campaign.status === "active");
    if (active.length === 0) {
        updateRunnerState((state) => ({ ...state, campaigns }));
        return;
    }

    for (const campaign of active) {
        try {
            await updateCampaignStatus(`/api/campaigns/${campaign.id}/pause`);
        } catch (error) {
            console.error(`Failed to reset campaign ${campaign.id} to paused on boot:`, error);
        }
    }

    try {
        const refreshed = await fetchCampaigns();
        updateRunnerState((state) => ({ ...state, campaigns: refreshed }));
    } catch {
        // mantém o último estado conhecido
    }
}
