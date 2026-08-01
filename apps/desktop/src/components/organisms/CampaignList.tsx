import { RefreshCw } from "lucide-react";
import type { RunnerCampaign, RunnerPlatform } from "../../../shared/runner-types";
import { getVisibleCampaigns } from "../../helpers/get-visible-campaigns";
import { CampaignCard } from "../molecules/CampaignCard";

type CampaignListProps = {
    campaigns: RunnerCampaign[];
    isLoading: boolean;
    pendingId: string | null;
    isSessionValid: (platform: RunnerPlatform) => boolean;
    onView: (campaign: RunnerCampaign) => void;
    onToggleStatus: (campaign: RunnerCampaign) => void;
    onRefresh: () => void;
};

export function CampaignList({
    campaigns,
    isLoading,
    pendingId,
    isSessionValid,
    onView,
    onToggleStatus,
    onRefresh,
}: CampaignListProps) {
    const visibleCampaigns = getVisibleCampaigns(campaigns);

    return (
        <section className="campaign-list">
            <div className="section-header">
                <h2 className="section-header__title">Tarefas ativas</h2>
                <button
                    type="button"
                    onClick={onRefresh}
                    disabled={isLoading}
                    className="refresh-btn no-drag"
                    aria-label="Atualizar campanhas"
                >
                    <RefreshCw size={13} className={isLoading ? "spin" : undefined} />
                    Atualizar
                </button>
            </div>

            {isLoading ? (
                <div className="campaign-list__skeletons">
                    <div className="campaign-card campaign-card--skeleton" />
                    <div className="campaign-card campaign-card--skeleton" />
                </div>
            ) : visibleCampaigns.length > 0 ? (
                <div className="campaign-list__items">
                    {visibleCampaigns.map((campaign) => (
                        <CampaignCard
                            key={campaign.id}
                            campaign={campaign}
                            sessionValid={isSessionValid(campaign.platform)}
                            isPending={pendingId === campaign.id}
                            onView={onView}
                            onToggleStatus={onToggleStatus}
                        />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <p className="empty-state__title">Nenhuma tarefa ativa no momento</p>
                    <p className="empty-state__description">
                        Novas campanhas locais aparecem aqui assim que o runner recebê-las.
                    </p>
                </div>
            )}
        </section>
    );
}
