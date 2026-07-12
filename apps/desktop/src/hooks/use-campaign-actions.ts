import type { ElectronAPI, RunnerCampaign, RunnerPlatform } from "../../shared/runner-types";
import { campaignStore } from "../stores/campaign-store";
import { creditStore } from "../stores/credit-store";


// @ts-ignore: O TypeScript reclama do module Node16, mas o Vite compila isso perfeitamente
const WEB_URL = import.meta.env.VITE_APLIQUEFY_WEB_URL || "http://localhost:3000";

type CampaignActionsOptions = {
    isSessionValid: (platform: RunnerPlatform) => boolean;
    onSessionMissing: (platform: RunnerPlatform) => void;
};

export function useCampaignActions(electron: ElectronAPI, options: CampaignActionsOptions) {
    const handleToggleCampaign = async (campaign: RunnerCampaign) => {
        if (campaign.status !== "active") {
            if (!options.isSessionValid(campaign.platform)) {
                options.onSessionMissing(campaign.platform);
                return;
            }

            // Revalida o saldo no momento do clique: o valor do store pode estar
            // defasado (ex.: o hydrate inicial pegou os 404 do boot, antes do
            // primeiro poll de 60s atualizar o saldo).
            let canSend = creditStore.getState().creditBalance.canSend;
            try {
                const fresh = await electron.credits.getBalance();
                creditStore.setBalance(fresh);
                canSend = fresh.canSend;
            } catch {
                // mantém o último valor conhecido se a checagem falhar
            }
            if (!canSend) {
                window.open(`${WEB_URL}/assinatura`, "_blank");
                return;
            }
        }

        try {
            const nextCampaigns =
                campaign.status === "active"
                    ? await electron.campaigns.pause(campaign.id)
                    : await electron.campaigns.activate(campaign.id);

            campaignStore.replaceCampaigns(nextCampaigns);
        } catch (error) {
            const message = error instanceof Error ? error.message : "";
            if (/sess[aã]o/i.test(message)) {
                options.onSessionMissing(campaign.platform);
                return;
            }
            console.error("Failed to toggle campaign:", error);
        }
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
