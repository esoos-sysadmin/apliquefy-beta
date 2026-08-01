import { useCallback, useRef, useState } from "react";
import type { ElectronAPI, RunnerCampaign, RunnerPlatform } from "../../shared/runner-types";
import { campaignStore } from "../stores/campaign-store";
import { creditStore } from "../stores/credit-store";


// @ts-ignore: O TypeScript reclama do module Node16, mas o Vite compila isso perfeitamente
const WEB_URL = import.meta.env.VITE_APLIQUEFY_WEB_URL || "http://localhost:3000";

type CampaignActionsOptions = {
    onSessionMissing: (platform: RunnerPlatform) => void;
};

export function useCampaignActions(electron: ElectronAPI, options: CampaignActionsOptions) {
    // pendingId é para o feedback visual (spinner "subindo campanha"); o ref é o
    // guarda síncrono contra duplo-clique (o setState não atualiza a tempo entre
    // dois cliques rápidos no mesmo tick).
    const [pendingId, setPendingId] = useState<string | null>(null);
    const pendingRef = useRef(false);

    const handleToggleCampaign = async (campaign: RunnerCampaign) => {
        if (pendingRef.current) {
            return;
        }
        pendingRef.current = true;
        setPendingId(campaign.id);

        try {
            if (campaign.status !== "active") {
                // O botão já fica desabilitado com tooltip, mas ele só tem aria-disabled
                // (o clique passa): sem este guard o run subiria e falharia no PDF.
                if (!campaign.hasResume) {
                    return;
                }

                // Revalida a sessão de verdade no clique (o status do store pode estar
                // defasado). check() relê o cookie salvo e devolve o status real.
                const session = await electron.sessions.check(campaign.platform);
                if (session?.status !== "active") {
                    options.onSessionMissing(campaign.platform);
                    return;
                }

                // Revalida o saldo no momento do clique: o valor do store pode estar
                // defasado (ex.: o hydrate inicial pegou os 404 do boot, antes do
                // primeiro poll atualizar o saldo).
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
        } finally {
            pendingRef.current = false;
            setPendingId(null);
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

    // useCallback porque o autorefresh do runner usa isto como dep de useEffect:
    // uma identidade nova a cada render recriaria o interval sem parar.
    const handleRefreshCampaigns = useCallback(async () => {
        campaignStore.setLoading(true);
        try {
            const campaigns = await electron.campaigns.list();
            campaignStore.hydrateCampaigns(campaigns);
        } catch (error) {
            console.error("Failed to refresh campaigns:", error);
            campaignStore.setLoading(false);
        }
    }, [electron]);

    return {
        handleToggleCampaign,
        handleViewCampaign,
        handleRefreshCampaigns,
        pendingId,
    };
}
