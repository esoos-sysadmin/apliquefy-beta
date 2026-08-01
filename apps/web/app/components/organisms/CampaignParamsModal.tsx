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
        : "border-orange-500/25 bg-orange-500/10 text-orange-300";

    const general: Array<[string, string]> = [
        ["Currículo", campaign.resume?.title ?? "Não vinculado"],
        ["Limite diário", campaign.dailyLimit ? `${campaign.dailyLimit} candidaturas` : "Sem limite"],
        ["Candidaturas", String(campaign._count?.jobApplications ?? 0)],
        ["Criada em", formatDateTime(campaign.createdAt)],
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/80 px-4 py-8 backdrop-blur-sm">
            <div className="flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#22304A] bg-[#0F1626] shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
                <div className="flex items-start justify-between gap-4 border-b border-[#1A2436] bg-gradient-to-br from-[#182238] to-[#111A2B] px-6 py-5">
                    <div className="flex items-center gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${platformBadge}`}>
                            <SlidersHorizontal size={20} />
                        </div>

                        <div className="min-w-0">
                            <h2 className="truncate text-xl font-semibold text-white">{campaign.name}</h2>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${platformBadge}`}>
                                    {isLinkedin ? "LinkedIn" : "InfoJobs"}
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
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-[#1B2740] hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="space-y-6 overflow-y-auto px-6 py-6">
                    <section className="space-y-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Geral</p>
                        <div className="grid grid-cols-2 gap-3">
                            {general.map(([label, value]) => (
                                <div key={label} className="rounded-xl border border-[#202B40] bg-[#151F30] px-4 py-3">
                                    <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500">{label}</p>
                                    <p className="mt-1 truncate text-sm font-semibold text-white" title={value}>{value}</p>
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
                                        className="flex flex-col gap-2 rounded-xl border border-[#202B40] bg-[#151F30] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
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
                            <p className="rounded-xl border border-dashed border-[#2A3445] bg-[#151F30] px-4 py-8 text-center text-sm text-slate-400">
                                Nenhum filtro configurado nesta campanha.
                            </p>
                        )}
                    </section>
                </div>

                <div className="border-t border-[#1A2436] bg-[#0C1220] px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#243B63] px-4 text-sm font-semibold text-white transition hover:bg-[#2B4675] sm:w-auto sm:px-8"
                    >
                        Fechar painel
                    </button>
                </div>
            </div>
        </div>
    );
}
