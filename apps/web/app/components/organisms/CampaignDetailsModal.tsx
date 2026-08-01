"use client";

import { useState } from "react";
import { BarChart3, X } from "lucide-react";
import { useApplicationMetrics } from "../../hooks/use-application-metrics";
import { formatDateTime, formatDistanceToNow } from "../../lib/date";
import type { Campaign } from "../../types/campaign";

const STATUS_LABEL: Record<string, string> = {
    applied: "Sucesso",
    failed: "Falha",
    pending: "Pendente",
    skipped: "Ignorada",
};

export function CampaignDetailsModal({
    campaign,
    onClose,
}: {
    campaign: Campaign;
    onClose: () => void;
}) {
    const [showHistory, setShowHistory] = useState(false);
    const { metrics, isLoading, error } = useApplicationMetrics(campaign.id, 1);

    const { summary } = metrics;
    const synced = summary.total > 0;
    const lastActivity = metrics.history[0]?.appliedAt ?? metrics.history[0]?.createdAt ?? "";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/75 px-4 py-8 backdrop-blur-sm">
            <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-[28px] border border-[#1C2333] bg-[#101826] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                <div className="flex shrink-0 items-start justify-between border-b border-[#192236] bg-[#151F30] px-5 py-5">
                    <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-300">
                            <BarChart3 size={18} />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-white">{campaign.name}</h2>
                            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                Métricas detalhadas de desempenho
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar painel da campanha"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-[#1B2740] hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
                    {isLoading ? (
                        <div className="space-y-3">
                            <div className="h-28 animate-pulse rounded-2xl bg-[#1A2436]" />
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="h-24 animate-pulse rounded-2xl bg-[#1A2436]" />
                                <div className="h-24 animate-pulse rounded-2xl bg-[#1A2436]" />
                            </div>
                            <div className="h-24 animate-pulse rounded-2xl bg-[#1A2436]" />
                        </div>
                    ) : error ? (
                        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-6 text-center">
                            <p className="text-sm font-semibold text-white">Erro ao carregar métricas</p>
                            <p className="mt-2 text-xs text-slate-300">Feche e abra novamente para tentar atualizar.</p>
                        </div>
                    ) : (
                        <>
                            <div className="rounded-2xl border border-[#24304A] bg-[#1A2436] px-4 py-4">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                                    Total de vagas aplicadas
                                </p>
                                <p className="mt-2 text-4xl font-bold leading-none text-white">{summary.total}</p>
                                <p className="mt-2 text-sm text-slate-500">Alcance total</p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl border border-[#202B40] bg-[#1A2436] px-4 py-4">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Sucesso</p>
                                    <p className="mt-3 text-3xl font-semibold text-white">{summary.applied}</p>
                                </div>

                                <div className="rounded-2xl border border-[#202B40] bg-[#1A2436] px-4 py-4">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Falhas</p>
                                    <p className="mt-3 text-3xl font-semibold text-white">{summary.failed}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                                    Consumo de créditos
                                </p>
                                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-2xl border border-[#24437C] bg-[#15233A] px-4 py-4 text-center">
                                        <p className="text-2xl font-semibold text-blue-300">{metrics.creditsUsed}</p>
                                        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Usados</p>
                                    </div>
                                    <div className="rounded-2xl border border-[#202B40] bg-[#1A2436] px-4 py-4 text-center">
                                        <p className="text-2xl font-semibold text-slate-200">{metrics.creditsRefunded}</p>
                                        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Reembolsados</p>
                                    </div>
                                </div>
                            </div>

                            {showHistory ? (
                                <div className="rounded-2xl border border-[#202B40] bg-[#131D2D] p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-sm font-semibold text-white">Histórico de candidaturas</p>
                                        <button
                                            type="button"
                                            onClick={() => setShowHistory(false)}
                                            className="text-xs font-semibold text-slate-400 transition hover:text-white"
                                        >
                                            Ocultar
                                        </button>
                                    </div>

                                    <div className="mt-4 space-y-2">
                                        {metrics.history.length > 0 ? (
                                            metrics.history.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-between rounded-xl border border-[#24304A] bg-[#182233] px-3 py-3"
                                                >
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-medium text-white">
                                                            {item.jobTitle ?? "Vaga sem título"}
                                                        </p>
                                                        <p className="truncate text-xs text-slate-400">
                                                            {item.companyName ?? "Empresa não informada"}
                                                            {" · "}
                                                            {formatDateTime(item.appliedAt ?? item.createdAt ?? "")}
                                                        </p>
                                                    </div>
                                                    <span className="ml-3 shrink-0 text-xs font-semibold text-blue-300">
                                                        {STATUS_LABEL[item.status ?? ""] ?? item.status ?? "—"}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-slate-400">Nenhum histórico disponível ainda.</p>
                                        )}
                                    </div>
                                </div>
                            ) : null}
                        </>
                    )}

                    <div className="grid gap-3 sm:grid-cols-2">
                        <button
                            type="button"
                            onClick={() => setShowHistory((current) => !current)}
                            className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#2563EB] px-4 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
                        >
                            Ver histórico
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#243B63] px-4 text-sm font-semibold text-white transition hover:bg-[#2B4675]"
                        >
                            Fechar painel
                        </button>
                    </div>
                </div>

                <div className="flex shrink-0 items-center justify-between border-t border-[#192236] bg-[#0D1522] px-5 py-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${synced ? "bg-blue-400" : "bg-slate-500"}`} />
                        {synced ? "ENGINE SINCRONIZADO" : "NÃO SINCRONIZADO"}
                    </span>
                    <span>Última atualização: {formatDistanceToNow(lastActivity)}</span>
                </div>
            </div>
        </div>
    );
}
