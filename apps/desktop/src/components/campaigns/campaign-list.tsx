import type { RunnerCampaign } from "../../../shared/runner-types";
import { CampaignCard } from "./campaign-card";

type CampaignListProps = {
    campaigns: RunnerCampaign[];
    isLoading: boolean;
    engineVersion: string;
    onView: (campaign: RunnerCampaign) => void;
    onToggleStatus: (campaign: RunnerCampaign) => void;
};

export function CampaignList({
    campaigns,
    isLoading,
    engineVersion,
    onView,
    onToggleStatus,
}: CampaignListProps) {
    const visibleCampaigns = campaigns.filter((campaign) => campaign.status !== "inactive");

    return (
        <section className="campaign-list">
            <div className="section-header">
                <h2 className="section-header__title">Active Tasks</h2>
                <span className="section-header__meta">{engineVersion}</span>
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
