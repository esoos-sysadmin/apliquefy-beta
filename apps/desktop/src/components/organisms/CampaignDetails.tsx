import { BriefcaseBusiness, FileText, Gauge, MapPin, X } from "lucide-react";
import type { RunnerCampaign } from "../../../shared/runner-types";
import { StatusBadge } from "../atoms/StatusBadge";

type CampaignDetailsProps = {
    campaign: RunnerCampaign | null;
    onClose: () => void;
};

export function CampaignDetails({ campaign, onClose }: CampaignDetailsProps) {
    if (!campaign) {
        return null;
    }

    return (
        <div className="overlay-backdrop">
            <div className="overlay-card no-drag">
                <div className="overlay-card__header">
                    <div>
                        <h3 className="overlay-card__title">{campaign.name}</h3>
                        <StatusBadge status={campaign.status} />
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar detalhes da campanha"
                        className="titlebar__close"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="overlay-card__body">
                    <div className="overlay-card__row">
                        <MapPin size={15} />
                        <span>{campaign.location}</span>
                    </div>
                    <div className="overlay-card__row">
                        <Gauge size={15} />
                        <span>{campaign.applications} candidaturas no total</span>
                    </div>
                    <div className="overlay-card__row">
                        <FileText size={15} />
                        <span>{campaign.resumeTitle}</span>
                    </div>
                    <div className="overlay-card__row">
                        <BriefcaseBusiness size={15} />
                        <span>Limite diário: {campaign.dailyLimit}</span>
                    </div>
                    <p className="overlay-card__notes">{campaign.notes}</p>
                    <p className="overlay-card__meta">Última atualização: {campaign.lastUpdated}</p>
                </div>
            </div>
        </div>
    );
}
