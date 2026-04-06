"use client";

import { BriefcaseBusiness, Eye, Pencil, Trash2 } from "lucide-react";
import { statusConfig } from "../../lib/constants/campaign-status";
import { getCampaignLocation, getApplicationsCount } from "../../lib/helpers/campaign";
import type { Campaign } from "../../types/campaign";

export function CampaignCard({
    campaign,
    onView,
    onEdit,
    onDelete,
}: {
    campaign: Campaign;
    onView: (campaign: Campaign) => void;
    onEdit: (campaign: Campaign) => void;
    onDelete: (campaign: Campaign) => void;
}) {
    const config = statusConfig[campaign.status];
    const applicationsCount = getApplicationsCount(campaign);

    return (
        <article className="rounded-2xl border border-[#1C2333] bg-[#131B2A] px-4 py-5 shadow-[0_0_0_1px_rgba(17,24,39,0.15)] transition-colors hover:border-[#283349] sm:px-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${config.iconBoxClassName}`}>
                        <BriefcaseBusiness size={22} strokeWidth={1.8} />
                    </div>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                            <h2 className="truncate text-lg font-semibold text-white">{campaign.name}</h2>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${config.badgeClassName}`}>
                                <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${config.dotClassName}`} />
                                {config.label}
                            </span>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-400">
                            <span className={`font-semibold ${campaign.platform === "linkedin" ? "text-sky-400" : "text-orange-400"}`}>
                                {campaign.platform === "linkedin" ? "LinkedIn" : "InfoJobs"}
                            </span>
                            <span className="text-slate-600">•</span>
                            <span>{getCampaignLocation(campaign)}</span>
                            <span className="text-slate-600">•</span>
                            <span>{applicationsCount} candidaturas</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                    <button
                        type="button"
                        onClick={() => onEdit(campaign)}
                        aria-label={`Editar campanha ${campaign.name}`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-slate-400 transition-colors hover:border-[#263149] hover:bg-[#182233] hover:text-white"
                    >
                        <Pencil size={16} />
                    </button>

                    <button
                        type="button"
                        onClick={() => onView(campaign)}
                        aria-label={`Visualizar campanha ${campaign.name}`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-slate-400 transition-colors hover:border-[#263149] hover:bg-[#182233] hover:text-white"
                    >
                        <Eye size={17} />
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(campaign)}
                        aria-label={`Excluir campanha ${campaign.name}`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-slate-400 transition-colors hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-200"
                    >
                        <Trash2 size={17} />
                    </button>
                </div>
            </div>
        </article>
    );
}
