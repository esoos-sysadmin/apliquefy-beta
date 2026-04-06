"use client";

import { useState } from "react";
import { BarChart3, X } from "lucide-react";
import { useCampaignMetrics } from "../../hooks/use-campaign-metrics";
import { formatDateTime, formatDistanceToNow } from "../../lib/date";
import type { Campaign } from "../../types/campaign";
import type { Report } from "../../types/report";

export function CampaignDetailsModal({
    campaign,
    onClose,
}: {
    campaign: Campaign;
    onClose: () => void;
}) {
    const [showHistory, setShowHistory] = useState(false);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [isLoadingReport, setIsLoadingReport] = useState(false);
    const { reports, metrics, isLoading, error, getReportById } = useCampaignMetrics(campaign.id);

    async function handleViewReport(reportId: string) {
        setIsLoadingReport(true);

        try {
            const report = await getReportById(reportId);
            setSelectedReport(report);
        } finally {
            setIsLoadingReport(false);
        }
    }

    const synced = metrics.reportCount > 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/75 px-4 py-8 backdrop-blur-sm">
            <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-[#1C2333] bg-[#101826] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                <div className="flex items-start justify-between border-b border-[#192236] bg-[#151F30] px-5 py-5">
                    <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-300">
                            <BarChart3 size={18} />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-white">{campaign.name}</h2>
                            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                Detailed performance metrics
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

                <div className="space-y-4 px-5 py-5">
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
                                <p className="mt-2 text-4xl font-bold leading-none text-white">{metrics.totalApplications}</p>
                                <p className="mt-2 text-sm text-slate-500">Global reach</p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl border border-[#202B40] bg-[#1A2436] px-4 py-4">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Sucesso</p>
                                    <p className="mt-3 text-3xl font-semibold text-white">{metrics.successCount}</p>
                                </div>

                                <div className="rounded-2xl border border-[#202B40] bg-[#1A2436] px-4 py-4">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Falhas</p>
                                    <p className="mt-3 text-3xl font-semibold text-white">{metrics.failCount}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                                    Credit consumption
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
                                        <p className="text-sm font-semibold text-white">History</p>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowHistory(false);
                                                setSelectedReport(null);
                                            }}
                                            className="text-xs font-semibold text-slate-400 transition hover:text-white"
                                        >
                                            Hide
                                        </button>
                                    </div>

                                    <div className="mt-4 space-y-2">
                                        {reports.length > 0 ? (
                                            reports.map((report) => (
                                                <button
                                                    key={report.id}
                                                    type="button"
                                                    onClick={() => handleViewReport(report.id)}
                                                    className="flex w-full items-center justify-between rounded-xl border border-[#24304A] bg-[#182233] px-3 py-3 text-left transition hover:border-[#35507E]"
                                                >
                                                    <div>
                                                        <p className="text-sm font-medium text-white">{formatDateTime(report.createdAt)}</p>
                                                        <p className="text-xs text-slate-400">
                                                            {report.totalJobsApplications} aplicações, {report.successApplications} sucessos
                                                        </p>
                                                    </div>
                                                    <span className="text-xs font-semibold text-blue-300">View</span>
                                                </button>
                                            ))
                                        ) : (
                                            <p className="text-sm text-slate-400">Nenhum histórico disponível ainda.</p>
                                        )}
                                    </div>

                                    {selectedReport ? (
                                        <div className="mt-4 rounded-xl border border-[#24304A] bg-[#101826] p-4">
                                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                                                Selected cycle
                                            </p>
                                            <p className="mt-2 text-sm text-slate-300">
                                                {formatDateTime(selectedReport.createdAt)}
                                            </p>
                                            <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-300">
                                                <div>Total: {selectedReport.totalJobsApplications}</div>
                                                <div>Sucesso: {selectedReport.successApplications}</div>
                                                <div>Falhas: {selectedReport.failApplications}</div>
                                                <div>Usados: {selectedReport.creditsUsed}</div>
                                                <div>Reembolso: {selectedReport.creditsRefund}</div>
                                            </div>
                                        </div>
                                    ) : null}

                                    {isLoadingReport ? (
                                        <p className="mt-3 text-xs text-slate-500">Carregando ciclo selecionado...</p>
                                    ) : null}
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
                            View History
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#243B63] px-4 text-sm font-semibold text-white transition hover:bg-[#2B4675]"
                        >
                            Close Panel
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-[#192236] bg-[#0D1522] px-5 py-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${synced ? "bg-blue-400" : "bg-slate-500"}`} />
                        {synced ? "ENGINE SYNCED" : "NOT SYNCED"}
                    </span>
                    <span>Last update: {formatDistanceToNow(metrics.lastSyncedAt)}</span>
                </div>
            </div>
        </div>
    );
}
