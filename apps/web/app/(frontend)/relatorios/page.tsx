"use client";

import { useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { useCampaigns } from "../../hooks/use-campaigns";
import { useApplicationMetrics } from "../../hooks/use-application-metrics";
import type { ApplicationStatus } from "../../types/job";

const statusLabel: Record<ApplicationStatus, string> = {
    applied: "Enviada",
    failed: "Falhou",
    pending: "Pendente",
    skipped: "Ignorada",
};

const statusClass: Record<ApplicationStatus, string> = {
    applied: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    failed: "bg-rose-500/10 text-rose-300 border-rose-500/20",
    pending: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    skipped: "bg-slate-500/10 text-slate-300 border-slate-500/20",
};

function formatDate(value: string | null) {
    if (!value) return "—";
    return new Date(value).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function dayLabel(iso: string) {
    return new Date(`${iso}T00:00:00Z`).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", timeZone: "UTC" });
}

export default function ReportsPage() {
    const { campaigns } = useCampaigns();
    const [campaignId, setCampaignId] = useState<string | "all">("all");
    const [page, setPage] = useState(1);
    const { metrics, pagination, isLoading, error } = useApplicationMetrics(campaignId, page);

    const { summary, byResume, history, failureReasons, creditsUsed, creditsRefunded, costPerApplication, dailyUsage, timeline } = metrics;
    const totalPages = pagination?.total_pages ?? 1;
    const decided = summary.applied + summary.failed;
    const successRate = decided > 0 ? Math.round((summary.applied / decided) * 100) : null;
    const maxDay = Math.max(1, ...timeline.map((t) => t.count));

    return (
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 text-white">
            <div className="flex flex-col gap-4 border-b border-[#1C2333] pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                        <span className="text-slate-300">Relatórios</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Relatórios</h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
                            Acompanhe candidaturas enviadas, desempenho por currículo e o histórico de vagas.
                        </p>
                    </div>
                </div>

                <div className="relative">
                    <select
                        value={campaignId}
                        onChange={(event) => {
                            setCampaignId(event.target.value as string | "all");
                            setPage(1);
                        }}
                        className="h-12 w-full appearance-none rounded-xl border border-[#2A3445] bg-[#101826] px-4 pr-10 text-sm text-slate-200 outline-none transition focus:border-[#35507E] sm:w-64"
                    >
                        <option value="all">Todas as campanhas</option>
                        {campaigns.map((campaign) => (
                            <option key={campaign.id} value={campaign.id}>
                                {campaign.name}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
                </div>
            </div>

            {error ? (
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-6 py-10 text-center">
                    <p className="text-lg font-semibold text-white">Não foi possível carregar os relatórios</p>
                    <p className="mt-2 text-sm text-slate-300">Verifique sua conexão e tente novamente.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        {[
                            { label: "Total de candidaturas", value: summary.total, accent: "text-white", sub: `${summary.skipped} ignoradas` },
                            {
                                label: "Enviadas com sucesso",
                                value: summary.applied,
                                accent: "text-emerald-300",
                                sub: successRate === null ? "sem dados" : `Taxa de sucesso: ${successRate}%`,
                            },
                            { label: "Falharam", value: summary.failed, accent: "text-rose-300", sub: `${summary.pending} pendentes` },
                            {
                                label: "Créditos gastos",
                                value: creditsUsed,
                                accent: "text-sky-300",
                                sub:
                                    creditsRefunded > 0
                                        ? `${creditsRefunded} reembolsado(s) por falha`
                                        : costPerApplication > 0
                                          ? `≈ ${costPerApplication} / candidatura`
                                          : "—",
                            },
                        ].map((card) => (
                            <div key={card.label} className="rounded-2xl border border-[#1C2333] bg-[#131B2A] p-5">
                                <p className="text-sm text-slate-400">{card.label}</p>
                                <p className={`mt-2 text-3xl font-bold ${card.accent}`}>{isLoading ? "—" : card.value}</p>
                                <p className="mt-1 text-xs text-slate-500">{isLoading ? "" : card.sub}</p>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-2xl border border-[#1C2333] bg-[#131B2A] p-5">
                        <h2 className="text-lg font-semibold text-white">Candidaturas por dia</h2>
                        <p className="mt-1 text-sm text-slate-400">Últimos 14 dias — buracos indicam robô parado ou sessão expirada.</p>
                        <div className="mt-5 flex h-32 items-end gap-1.5">
                            {timeline.map((day) => (
                                <div key={day.date} className="group flex flex-1 flex-col items-center justify-end gap-1.5" title={`${dayLabel(day.date)}: ${day.count}`}>
                                    <span className="text-[10px] text-slate-500">{day.count > 0 ? day.count : ""}</span>
                                    <div
                                        className="w-full rounded-t bg-[#2563EB] transition group-hover:bg-[#3b82f6]"
                                        style={{ height: `${Math.max(day.count > 0 ? 6 : 2, (day.count / maxDay) * 100)}%` }}
                                    />
                                    <span className="text-[10px] text-slate-500">{dayLabel(day.date).slice(0, 2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                        <div className="rounded-2xl border border-[#1C2333] bg-[#131B2A] p-5">
                            <h2 className="text-lg font-semibold text-white">Limite diário (hoje)</h2>
                            <p className="mt-1 text-sm text-slate-400">Uso das campanhas ativas — se bate no teto todo dia, considere aumentar.</p>
                            <div className="mt-4 space-y-3">
                                {dailyUsage.length === 0 ? (
                                    <p className="text-sm text-slate-500">Nenhuma campanha ativa no escopo.</p>
                                ) : (
                                    dailyUsage.map((c) => {
                                        const pct = c.limit > 0 ? Math.min(100, Math.round((c.used / c.limit) * 100)) : 0;
                                        return (
                                            <div key={c.campaignId}>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="truncate text-slate-200">{c.campaignName}</span>
                                                    <span className="ml-3 shrink-0 text-slate-400">{c.used}/{c.limit || "∞"}</span>
                                                </div>
                                                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#101826]">
                                                    <div className={`h-full rounded-full ${pct >= 100 ? "bg-amber-400" : "bg-emerald-400"}`} style={{ width: `${pct}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-[#1C2333] bg-[#131B2A] p-5">
                            <h2 className="text-lg font-semibold text-white">Motivos de falha</h2>
                            <p className="mt-1 text-sm text-slate-400">O que impediu candidaturas de serem enviadas.</p>
                            <div className="mt-4 space-y-2.5">
                                {failureReasons.length === 0 ? (
                                    <p className="text-sm text-slate-500">Nenhuma falha registrada. 🎉</p>
                                ) : (
                                    failureReasons.map((r) => (
                                        <div key={r.reason} className="flex items-center justify-between gap-3 rounded-xl border border-[#273247] bg-[#101826] px-4 py-2.5">
                                            <span className="truncate text-sm text-slate-300" title={r.reason}>{r.reason}</span>
                                            <span className="shrink-0 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-300">{r.count}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#1C2333] bg-[#131B2A] p-5">
                        <h2 className="text-lg font-semibold text-white">Desempenho por currículo</h2>
                        <p className="mt-1 text-sm text-slate-400">Quantas candidaturas foram enviadas com cada currículo.</p>
                        <div className="mt-4 space-y-3">
                            {byResume.length === 0 ? (
                                <p className="text-sm text-slate-500">Nenhuma candidatura registrada ainda.</p>
                            ) : (
                                byResume.map((row) => (
                                    <div key={row.resumeId || row.resumeTitle} className="flex items-center justify-between rounded-xl border border-[#273247] bg-[#101826] px-4 py-3">
                                        <span className="truncate text-sm font-medium text-slate-200">{row.resumeTitle}</span>
                                        <span className="ml-4 shrink-0 text-sm text-slate-400">
                                            <span className="font-semibold text-emerald-300">{row.applied}</span> enviadas
                                            <span className="mx-1 text-slate-600">·</span>
                                            {row.total} no total
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#1C2333] bg-[#131B2A]">
                        <div className="border-b border-[#1C2333] px-5 py-4">
                            <h2 className="text-lg font-semibold text-white">Histórico de vagas</h2>
                            <p className="mt-1 text-sm text-slate-400">Cada candidatura enviada, com link da vaga.</p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px] text-left text-sm">
                                <thead className="text-xs uppercase text-slate-500">
                                    <tr className="border-b border-[#1C2333]">
                                        <th className="px-5 py-3 font-medium">Vaga</th>
                                        <th className="px-5 py-3 font-medium">Empresa</th>
                                        <th className="px-5 py-3 font-medium">Currículo</th>
                                        <th className="px-5 py-3 font-medium">Status</th>
                                        <th className="px-5 py-3 font-medium">Data</th>
                                        <th className="px-5 py-3 font-medium">Link</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={6} className="px-5 py-10 text-center text-slate-500">Carregando…</td>
                                        </tr>
                                    ) : history.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-5 py-10 text-center text-slate-500">Nenhuma candidatura encontrada.</td>
                                        </tr>
                                    ) : (
                                        history.map((item) => (
                                            <tr key={item.id} className="border-b border-[#151D2B] last:border-0 hover:bg-[#101826]">
                                                <td className="px-5 py-3 text-slate-200">{item.jobTitle ?? "—"}</td>
                                                <td className="px-5 py-3 text-slate-400">{item.companyName ?? "—"}</td>
                                                <td className="px-5 py-3 text-slate-400">{item.resumeTitle ?? "—"}</td>
                                                <td className="px-5 py-3">
                                                    {item.status ? (
                                                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusClass[item.status]}`}>
                                                            {statusLabel[item.status]}
                                                        </span>
                                                    ) : "—"}
                                                </td>
                                                <td className="px-5 py-3 text-slate-400">{formatDate(item.appliedAt ?? item.createdAt)}</td>
                                                <td className="px-5 py-3">
                                                    {item.jobUrl ? (
                                                        <a
                                                            href={item.jobUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-[#60A5FA] transition hover:text-[#93C5FD]"
                                                        >
                                                            Abrir <ExternalLink size={13} />
                                                        </a>
                                                    ) : "—"}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 ? (
                            <div className="flex items-center justify-between border-t border-[#1C2333] px-5 py-4 text-sm text-slate-500">
                                <span>Página {pagination?.page ?? page} de {totalPages}</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setPage((current) => Math.max(1, current - 1))}
                                        disabled={page <= 1}
                                        className="inline-flex h-10 items-center rounded-xl border border-[#273247] px-4 text-slate-300 transition hover:border-[#31415c] hover:bg-[#101826] disabled:cursor-not-allowed disabled:text-slate-700"
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                                        disabled={page >= totalPages}
                                        className="inline-flex h-10 items-center rounded-xl border border-[#273247] px-4 text-slate-300 transition hover:border-[#31415c] hover:bg-[#101826] disabled:cursor-not-allowed disabled:text-slate-700"
                                    >
                                        Próxima
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </>
            )}
        </section>
    );
}
