import { Eye, Loader2, Pause, Play } from "lucide-react";
import type { RunnerCampaign } from "../../../shared/runner-types";
import { StatusBadge } from "../atoms/StatusBadge";

type CampaignCardProps = {
    campaign: RunnerCampaign;
    sessionValid: boolean;
    isPending: boolean;
    onView: (campaign: RunnerCampaign) => void;
    onToggleStatus: (campaign: RunnerCampaign) => void;
};

export function CampaignCard({ campaign, sessionValid, isPending, onView, onToggleStatus }: CampaignCardProps) {
    const isActive = campaign.status === "active";
    // pausar continua livre; só ativar exige sessão válida e currículo vinculado
    const missingResume = !isActive && !campaign.hasResume;
    const playDisabled = !isActive && (!sessionValid || missingResume);
    const playTip = missingResume
        ? "O currículo desta campanha foi excluído. Edite a campanha no site e selecione outro currículo."
        : playDisabled
          ? "Para ativar a campanha você precisa fazer login primeiro"
          : undefined;
    const pendingLabel = isActive ? "Pausando…" : "Subindo campanha…";

    return (
        <article className={`campaign-card campaign-card--compact${isPending ? " campaign-card--pending" : ""}`}>
            <div className="campaign-card__header">
                <div>
                    <span className={`platform-tag platform-tag--${campaign.platform}`}>
                        {campaign.platform === "linkedin" ? "LinkedIn" : "InfoJobs"}
                    </span>
                    <h3 className="campaign-card__title">{campaign.name}</h3>
                    <p className="campaign-card__location">{campaign.location}</p>
                </div>
                <StatusBadge status={campaign.status} />
            </div>

            {isActive ? (
                <div className="campaign-card__stats">
                    <span className="campaign-card__stats-label">Candidaturas</span>
                    <strong className="campaign-card__stats-value">{campaign.applications}</strong>
                </div>
            ) : null}

            <div className="campaign-card__actions">
                {isPending ? (
                    <span className="campaign-card__pending">
                        <Loader2 size={13} className="spin" />
                        {pendingLabel}
                    </span>
                ) : null}
                <button
                    type="button"
                    className="icon-button icon-button--view no-drag"
                    aria-label={`Ver ${campaign.name}`}
                    onClick={() => onView(campaign)}
                >
                    <Eye size={16} />
                </button>
                <span className="tip-wrap" data-tip={playTip}>
                    <button
                        type="button"
                        className={`icon-button icon-button--play no-drag${playDisabled ? " icon-button--disabled" : ""}`}
                        aria-label={isActive ? `Pausar ${campaign.name}` : `Retomar ${campaign.name}`}
                        aria-disabled={playDisabled || isPending}
                        disabled={isPending}
                        onClick={() => onToggleStatus(campaign)}
                    >
                        {isPending ? (
                            <Loader2 size={16} className="spin" />
                        ) : isActive ? (
                            <Pause size={16} />
                        ) : (
                            <Play size={16} />
                        )}
                    </button>
                </span>
            </div>
        </article>
    );
}
