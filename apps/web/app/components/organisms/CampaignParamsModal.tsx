"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { statusConfig } from "../../lib/constants/campaign-status";
import { formatDateTime } from "../../lib/date";
import { getCampaignParams } from "../../lib/helpers/campaign-params";
import type { Campaign } from "../../types/campaign";

// Tints de chip por linha de filtro — cores levemente diferentes, rotacionadas por índice.
const chipTints = [
    "border-sky-500/25 bg-sky-500/10 text-sky-200",
    "border-violet-500/25 bg-violet-500/10 text-violet-200",
    "border-emerald-500/25 bg-emerald-500/10 text-emerald-200",
    "border-amber-500/25 bg-amber-500/10 text-amber-200",
    "border-rose-500/25 bg-rose-500/10 text-rose-200",
    "border-cyan-500/25 bg-cyan-500/10 text-cyan-200",
    "border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-200",
    "border-teal-500/25 bg-teal-500/10 text-teal-200",
];

export function CampaignParamsModal({
    campaign,
    onClose,
}: {
    campaign: Campaign;
    onClose: () => void;
}) {
    const params = getCampaignParams(campaign);
    const status = statusConfig[campaign.status];
    const isLinkedin = campaign.platform === "linkedin";

    const platformBadge = isLinkedin
        ? "border-sky-500/25 bg-sky-500/10 text-sky-300"
        : campaign.platform === "ats"
          ? "border-accent/25 bg-accent-soft text-accent-text"
          : "border-orange-500/25 bg-orange-500/10 text-orange-300";

    const general: Array<[string, string]> = [
        ["Currículo", campaign.resume?.title ?? "Não vinculado"],
        ["Limite diário", campaign.dailyLimit ? `${campaign.dailyLimit} candidaturas` : "Sem limite"],
        ["Candidaturas", String(campaign._count?.jobApplications ?? 0)],
        ["Criada em", formatDateTime(campaign.createdAt)],
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ap-ink/80 p-3 backdrop-blur-sm sm:px-4 sm:py-8">
            <div className="flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
                <div className="flex items-start justify-between gap-2 border-b border-line bg-gradient-to-br from-raised to-surface px-4 py-4 sm:gap-4 sm:px-6 sm:py-5">
                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border sm:h-12 sm:w-12 ${platformBadge}`}>
                            <SlidersHorizontal size={20} />
                        </div>

                        <div className="min-w-0">
                            <h2 className="line-clamp-2 break-words text-base font-semibold text-fg sm:text-xl">{campaign.name}</h2>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${platformBadge}`}>
                                    {isLinkedin ? "LinkedIn" : campaign.platform === "ats" ? "Nuvem" : "InfoJobs"}
                                </span>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.badgeClassName}`}>
                                    <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${status.dotClassName}`} />
                                    {status.label}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar painel da campanha"
                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-raised hover:text-fg"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="space-y-6 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
                    <section className="space-y-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Geral</p>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {general.map(([label, value]) => (
                                <div key={label} className="rounded-xl border border-line bg-surface px-4 py-3">
                                    <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500">{label}</p>
                                    <p className="mt-1 break-words text-sm font-semibold text-fg" title={value}>{value}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Filtros de busca</p>
                        {params.length > 0 ? (
                            <div className="space-y-2.5">
                                {params.map(({ label, values }, index) => (
                                    <div
                                        key={label}
                                        className="flex flex-col gap-2 rounded-xl border border-line bg-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <p className="text-sm text-slate-400">{label}</p>
                                        <div className="flex flex-wrap gap-1.5 sm:justify-end">
                                            {values.map((value) => (
                                                <span
                                                    key={value}
                                                    className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold ${chipTints[index % chipTints.length]}`}
                                                >
                                                    {value}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="rounded-xl border border-dashed border-line-strong bg-surface px-4 py-8 text-center text-sm text-slate-400">
                                Nenhum filtro configurado nesta campanha.
                            </p>
                        )}
                    </section>
                </div>

                <div className="border-t border-line bg-sunken px-4 py-4 sm:px-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-accent-soft px-4 text-sm font-semibold text-accent-text transition hover:bg-accent/25 sm:w-auto sm:px-8"
                    >
                        Fechar painel
                    </button>
                </div>
            </div>
        </div>
    );
}
