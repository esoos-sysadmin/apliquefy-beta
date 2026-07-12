import { Eye, Pause, Play } from "lucide-react";
import type { RunnerCampaign } from "../../../shared/runner-types";
import { StatusBadge } from "../atoms/StatusBadge";

type CampaignCardProps = {
    campaign: RunnerCampaign;
    sessionValid: boolean;
    onView: (campaign: RunnerCampaign) => void;
    onToggleStatus: (campaign: RunnerCampaign) => void;
};

export function CampaignCard({ campaign, sessionValid, onView, onToggleStatus }: CampaignCardProps) {
    const isActive = campaign.status === "active";
    const playDisabled = !isActive && !sessionValid;

    return (
        <article className="campaign-card campaign-card--compact">
            <div className="campaign-card__header">
                <div>
                    <h3 className="campaign-card__title">{campaign.name}</h3>
                    <p className="campaign-card__location">{campaign.location}</p>
                </div>
                <StatusBadge status={campaign.status} />
            </div>

            {isActive ? (
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
                    className={`icon-button no-drag${playDisabled ? " icon-button--disabled" : ""}`}
                    aria-label={isActive ? `Pause ${campaign.name}` : `Resume ${campaign.name}`}
                    aria-disabled={playDisabled}
                    title={playDisabled ? "Faça login para iniciar" : undefined}
                    onClick={() => onToggleStatus(campaign)}
                >
                    {isActive ? <Pause size={16} /> : <Play size={16} />}
                </button>
            </div>
        </article>
    );
}
