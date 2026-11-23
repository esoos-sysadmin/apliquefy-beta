"use client";

import { AlertTriangle, BarChart3, BriefcaseBusiness, Loader2, Pause, Pencil, Play, Trash2 } from "lucide-react";
import { statusConfig } from "../../lib/constants/campaign-status";
import { getCampaignLocation, getApplicationsCount } from "../../lib/helpers/campaign";
import type { Campaign } from "../../types/campaign";

export function CampaignCard({
    campaign,
    onView,
    onOpenDetails,
    onEdit,
    onDelete,
    onToggle,
    toggling = false,
}: {
    campaign: Campaign;
    onView: (campaign: Campaign) => void;
    onOpenDetails: (campaign: Campaign) => void;
    onEdit: (campaign: Campaign) => void;
    onDelete: (campaign: Campaign) => void;
    // Só campanhas da nuvem (ats): LinkedIn/InfoJobs ativam pelo desktop, que tem a sessão local.
    onToggle?: (campaign: Campaign) => void;
    toggling?: boolean;
}) {
    const config = statusConfig[campaign.status];
    const applicationsCount = getApplicationsCount(campaign);

    return (
        <article className="rounded-xl border border-line bg-surface p-4 sm:rounded-2xl sm:px-5 sm:py-5 shadow-[0_0_0_1px_rgba(17,24,39,0.15)] transition-colors hover:border-line-strong sm:px-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <button
                    type="button"
                    onClick={() => onOpenDetails(campaign)}
                    aria-label={`Ver parâmetros da campanha ${campaign.name}`}
                    className="flex min-w-0 items-start gap-3 rounded-2xl text-left sm:gap-4 transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                >
                    <div className={`flex h-12 w-12 shrink-0 items-center sm:h-14 sm:w-14 justify-center rounded-2xl border ${config.iconBoxClassName}`}>
                        <BriefcaseBusiness size={22} strokeWidth={1.8} />
                    </div>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                            <h2 className="line-clamp-2 break-words text-base font-semibold text-fg sm:line-clamp-1 sm:text-lg">{campaign.name}</h2>
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
                            <span className={`font-semibold ${{ linkedin: "text-sky-400", infojobs: "text-orange-400", ats: "text-accent-text" }[campaign.platform]}`}>
                                {{ linkedin: "LinkedIn", infojobs: "InfoJobs", ats: "Nuvem" }[campaign.platform]}
                            </span>
                            <span className="text-slate-600">•</span>
                            <span>{getCampaignLocation(campaign)}</span>
                            <span className="text-slate-600">•</span>
                            <span>{applicationsCount} candidaturas</span>
                        </div>
                    </div>
                </button>

                <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:items-center lg:justify-end">
                    {campaign.platform === "ats" && onToggle && (
                        <button
                            type="button"
                            onClick={() => onToggle(campaign)}
                            disabled={toggling}
                            className="col-span-3 inline-flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-accent px-4 sm:col-auto sm:w-auto text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-60 lg:h-10"
                        >
                            {toggling ? <Loader2 size={16} className="animate-spin" /> : campaign.status === "active" ? <Pause size={16} /> : <Play size={16} />}
                            {campaign.status === "active" ? "Pausar" : "Ativar"}
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => onEdit(campaign)}
                        aria-label={`Editar campanha ${campaign.name}`}
                        className="inline-flex h-11 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-line-strong px-1 text-[13px] font-medium text-slate-300 sm:h-10 sm:w-10 sm:border-transparent sm:px-0 sm:text-sm sm:font-normal sm:text-slate-400 transition-colors hover:border-line-strong hover:bg-raised hover:text-fg"
                    >
                        <Pencil size={16} /><span className="sm:hidden">Editar</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => onView(campaign)}
                        aria-label={`Ver métricas da campanha ${campaign.name}`}
                        className="inline-flex h-11 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-line-strong px-1 text-[13px] font-medium text-slate-300 sm:h-10 sm:w-10 sm:border-transparent sm:px-0 sm:text-sm sm:font-normal sm:text-slate-400 transition-colors hover:border-line-strong hover:bg-raised hover:text-fg"
                    >
                        <BarChart3 size={17} /><span className="sm:hidden">Métricas</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(campaign)}
                        aria-label={`Excluir campanha ${campaign.name}`}
                        className="inline-flex h-11 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-line-strong px-1 text-[13px] font-medium text-slate-300 sm:h-10 sm:w-10 sm:border-transparent sm:px-0 sm:text-sm sm:font-normal sm:text-slate-400 transition-colors hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-200"
                    >
                        <Trash2 size={17} /><span className="sm:hidden">Excluir</span>
                    </button>
                </div>
            </div>
        </article>
    );
}
