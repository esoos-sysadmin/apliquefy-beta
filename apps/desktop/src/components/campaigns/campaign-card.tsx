import { Eye, Pause, Play } from "lucide-react";
import type { RunnerCampaign } from "../../../shared/runner-types";
import { StatusBadge } from "./status-badge";

type CampaignCardProps = {
    campaign: RunnerCampaign;
    onView: (campaign: RunnerCampaign) => void;
    onToggleStatus: (campaign: RunnerCampaign) => void;
};

export function CampaignCard({ campaign, onView, onToggleStatus }: CampaignCardProps) {
    const isPaused = campaign.status === "paused";

    return (
        <article className={`campaign-card ${isPaused ? "campaign-card--compact" : ""}`}>
            <div className="campaign-card__header">
                <div>
                    <h3 className="campaign-card__title">{campaign.name}</h3>
                    <p className="campaign-card__location">{campaign.location}</p>
                </div>
                <StatusBadge status={campaign.status} />
            </div>

            {!isPaused ? (
                <div className="campaign-card__stats">
                    <span className="campaign-card__stats-label">Applications</span>
                    <strong className="campaign-card__stats-value">{campaign.applications}</strong>
                </div>
            ) : null}

            <div className="campaign-card__actions">
                <button
                    type="button"
                    className="icon-button no-drag"
                    aria-label={`View ${campaign.name}`}
                    onClick={() => onView(campaign)}
                >
                    <Eye size={16} />
                </button>
                <button
                    type="button"
                    className="icon-button no-drag"
                    aria-label={isPaused ? `Resume ${campaign.name}` : `Pause ${campaign.name}`}
                    onClick={() => onToggleStatus(campaign)}
                >
                    {isPaused ? <Play size={16} /> : <Pause size={16} />}
                </button>
            </div>
        </article>
    );
}
