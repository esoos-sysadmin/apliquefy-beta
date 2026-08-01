"use client";

import { AlertTriangle, BarChart3, BriefcaseBusiness, Pencil, Trash2 } from "lucide-react";
import { statusConfig } from "../../lib/constants/campaign-status";
import { getCampaignLocation, getApplicationsCount } from "../../lib/helpers/campaign";
import type { Campaign } from "../../types/campaign";

export function CampaignCard({
    campaign,
    onView,
    onOpenDetails,
    onEdit,
    onDelete,
}: {
    campaign: Campaign;
    onView: (campaign: Campaign) => void;
    onOpenDetails: (campaign: Campaign) => void;
    onEdit: (campaign: Campaign) => void;
    onDelete: (campaign: Campaign) => void;
}) {
    const config = statusConfig[campaign.status];
    const applicationsCount = getApplicationsCount(campaign);

    return (
        <article className="rounded-2xl border border-[#1C2333] bg-[#131B2A] px-4 py-5 shadow-[0_0_0_1px_rgba(17,24,39,0.15)] transition-colors hover:border-[#283349] sm:px-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <button
                    type="button"
                    onClick={() => onOpenDetails(campaign)}
                    aria-label={`Ver parâmetros da campanha ${campaign.name}`}
                    className="flex min-w-0 items-start gap-4 rounded-2xl text-left transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#35507E]"
                >
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
                            {!campaign.resumeId && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-300">
                                    <AlertTriangle size={12} />
                                    Sem currículo
                                </span>
                            )}
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
                </button>

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
                        aria-label={`Ver métricas da campanha ${campaign.name}`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-slate-400 transition-colors hover:border-[#263149] hover:bg-[#182233] hover:text-white"
                    >
                        <BarChart3 size={17} />
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
