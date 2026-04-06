import type { RunnerCampaign } from "../../../shared/runner-types";
import { getVisibleCampaigns } from "../../helpers/get-visible-campaigns";
import { CampaignCard } from "../molecules/CampaignCard";

type CampaignListProps = {
    campaigns: RunnerCampaign[];
    isLoading: boolean;
    engineVersion?: string;
    onView: (campaign: RunnerCampaign) => void;
    onToggleStatus: (campaign: RunnerCampaign) => void;
    onRefresh: () => void;
};

export function CampaignList({
    campaigns,
    isLoading,
    engineVersion,
    onView,
    onToggleStatus,
    onRefresh,
}: CampaignListProps) {
    const visibleCampaigns = getVisibleCampaigns(campaigns);

    return (
        <section className="campaign-list">
            <div className="section-header">
                <h2 className="section-header__title">Active Tasks</h2>
                <div className="section-header__actions">
                    <button
                        type="button"
                        onClick={onRefresh}
                        disabled={isLoading}
                        className="refresh-btn"
                        aria-label="Refresh campaigns"
                    >
                        ↻
                    </button>
                    {engineVersion && <span className="section-header__meta">{engineVersion}</span>}
                </div>
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
                            onView={onView}
                            onToggleStatus={onToggleStatus}
                        />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <p className="empty-state__title">No active tasks right now</p>
                    <p className="empty-state__description">
                        New local campaigns will appear here as soon as the runner receives them.
                    </p>
                </div>
            )}
        </section>
    );
}
