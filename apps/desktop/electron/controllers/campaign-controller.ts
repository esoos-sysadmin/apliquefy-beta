import { getRunnerState, updateRunnerState } from "../store";
import { fetchCampaignById, fetchCampaigns, updateCampaignStatus } from "../services/campaign-service";
import { notifyCampaignActivated, notifyCampaignPaused, notifyRunFailed } from "../services/notification-service";
import { startCampaignRun } from "../services/campaign-run-service";
import { getSessionController } from "./session-controller";

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
            const state = getRunnerState();
            const targetCampaign =
                state.campaigns.find((campaign) => campaign.id === campaignId) ??
                (await fetchCampaignById(campaignId));

            if (targetCampaign) {
                // Revalida a sessão AGORA. O status persistido pode estar defasado
                // (cookie expirado, logout fora do app), o que deixava ativar campanha
                // "deslogado". check() relê o cookie salvo e repersiste o status real.
                const session = await getSessionController().check(targetCampaign.platform);
                if (!session || session.status !== "active") {
                    const error = new Error("Sessão de login inválida ou expirada.") as Error & {
                        code?: number;
                    };
                    error.code = 401;
                    throw error;
                }
            }

            const campaigns = persistCampaigns(await updateCampaignStatus(`/api/campaigns/${campaignId}/activate`));
            const activatedCampaign = campaigns.find((campaign) => campaign.id === campaignId);

            if (activatedCampaign) {
                notifyCampaignActivated(activatedCampaign.name);

                // Dispara o run do RPA (abre o navegador). Falha aqui não desfaz a
                // ativação: a campanha fica ativa e o erro é logado para diagnóstico.
                try {
                    await startCampaignRun(activatedCampaign);
                } catch (error) {
                    console.error(`[rpa] falha ao iniciar run da campanha ${campaignId}:`, error);
                    // sem isto a campanha aparece "ativa" e nada roda (ex.: currículo excluído)
                    notifyRunFailed(
                        activatedCampaign.name,
                        error instanceof Error ? error.message : "Erro ao iniciar a automação."
                    );
                }
            }

            return campaigns;
        },
    };
}
