"use client";

import { useState } from "react";
import { ExternalLink, FlaskConical, Search, Trophy, X } from "lucide-react";
import { useAbTest } from "../../hooks/use-ab-tests";
import type { AbTestApplication, AbTestVariantDetail, AbTestWinner } from "../../types/ab-test";

const winnerOptions: { value: Exclude<AbTestWinner, null>; label: string }[] = [
    { value: "A", label: "Variante A venceu" },
    { value: "tie", label: "Empate" },
    { value: "B", label: "Variante B venceu" },
];

function VariantSummary({
    label,
    variant,
    highlightResponse,
    highlightInterview,
}: {
    label: "A" | "B";
    variant: AbTestVariantDetail;
    highlightResponse: boolean;
    highlightInterview: boolean;
}) {
    const { metrics } = variant;
    return (
        <div className="rounded-2xl border border-[#24304A] bg-[#1A2436] p-4">
            <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#2563EB] text-xs font-bold text-white">{label}</span>
                <span className="truncate text-sm font-semibold text-white" title={variant.resumeTitle ?? undefined}>
                    {variant.resumeTitle ?? "Sem currículo"}
                </span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                    <p className="text-2xl font-bold text-white">{metrics.sent}</p>
                    <p className="text-[10px] uppercase tracking-wide text-slate-500">Enviadas</p>
                </div>
                <div>
                    <p className={`text-2xl font-bold ${highlightResponse ? "text-emerald-300" : "text-slate-200"}`}>{metrics.responses}</p>
                    <p className="text-[10px] uppercase tracking-wide text-slate-500">Respostas</p>
                    <p className="text-[11px] text-slate-400">{metrics.responseRate}%</p>
                </div>
                <div>
                    <p className={`text-2xl font-bold ${highlightInterview ? "text-emerald-300" : "text-slate-200"}`}>{metrics.interviews}</p>
                    <p className="text-[10px] uppercase tracking-wide text-slate-500">Entrevistas</p>
                    <p className="text-[11px] text-slate-400">{metrics.interviewRate}%</p>
                </div>
            </div>
        </div>
    );
}

export function AbTestDetailModal({ abTestId, onClose }: { abTestId: string; onClose: () => void }) {
    const { abTest, isLoading, error, setOutcome, setWinner } = useAbTest(abTestId);
    const [search, setSearch] = useState("");

    const applications: (AbTestApplication & { variant: "A" | "B" })[] = abTest
        ? [
              ...abTest.variantA.applications.map((a) => ({ ...a, variant: "A" as const })),
              ...abTest.variantB.applications.map((a) => ({ ...a, variant: "B" as const })),
          ]
        : [];

    const term = search.toLowerCase().trim();
    const visible = applications.filter(
        (a) => !term || (a.companyName ?? "").toLowerCase().includes(term) || (a.jobTitle ?? "").toLowerCase().includes(term),
    );

    async function toggleResponse(app: AbTestApplication) {
        // desmarcar resposta também remove entrevista (entrevista implica resposta)
        const next = !app.gotResponse;
        await setOutcome(app.id, { gotResponse: next, ...(next ? {} : { gotInterview: false }) });
    }

    async function toggleInterview(app: AbTestApplication) {
        const next = !app.gotInterview;
        // marcar entrevista implica ter recebido resposta
        await setOutcome(app.id, { gotInterview: next, ...(next ? { gotResponse: true } : {}) });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/75 px-4 py-8 backdrop-blur-sm">
            <div className="flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] border border-[#1C2333] bg-[#101826] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                <div className="flex items-start justify-between border-b border-[#192236] bg-[#151F30] px-5 py-5">
                    <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-300">
                            <FlaskConical size={18} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">{abTest?.name ?? "Teste A/B"}</h2>
                            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                {abTest?.platform ?? ""} · Comparação de variantes
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar painel do teste A/B"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-[#1B2740] hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
                    {isLoading ? (
                        <div className="space-y-3">
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="h-32 animate-pulse rounded-2xl bg-[#1A2436]" />
                                <div className="h-32 animate-pulse rounded-2xl bg-[#1A2436]" />
                            </div>
                            <div className="h-40 animate-pulse rounded-2xl bg-[#1A2436]" />
                        </div>
                    ) : error || !abTest ? (
                        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-6 text-center">
                            <p className="text-sm font-semibold text-white">Erro ao carregar o teste A/B</p>
                            <p className="mt-2 text-xs text-slate-300">Feche e abra novamente para tentar atualizar.</p>
                        </div>
                    ) : (
                        <>
                            {abTest.hypothesis ? (
                                <p className="rounded-xl border border-[#273247] bg-[#0D1522] px-4 py-3 text-sm text-slate-300">
                                    <span className="font-semibold text-slate-200">Hipótese:</span> {abTest.hypothesis}
                                </p>
                            ) : null}

                            <div className="grid gap-3 sm:grid-cols-2">
                                <VariantSummary
                                    label="A"
                                    variant={abTest.variantA}
                                    highlightResponse={abTest.variantA.metrics.responseRate > abTest.variantB.metrics.responseRate}
                                    highlightInterview={abTest.variantA.metrics.interviewRate > abTest.variantB.metrics.interviewRate}
                                />
                                <VariantSummary
                                    label="B"
                                    variant={abTest.variantB}
                                    highlightResponse={abTest.variantB.metrics.responseRate > abTest.variantA.metrics.responseRate}
                                    highlightInterview={abTest.variantB.metrics.interviewRate > abTest.variantA.metrics.interviewRate}
                                />
                            </div>

                            <div className="rounded-2xl border border-[#273247] bg-[#0D1522] p-4">
                                <p className="flex items-center gap-2 text-sm font-semibold text-white">
                                    <Trophy size={15} className="text-amber-300" /> Resultado do teste
                                </p>
                                <div className="mt-3 grid grid-cols-3 gap-2">
                                    {winnerOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => setWinner(abTest.winner === option.value ? null : option.value)}
                                            className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                                                abTest.winner === option.value
                                                    ? "border-amber-400 bg-amber-400/10 text-amber-200"
                                                    : "border-[#273247] bg-[#101826] text-slate-300 hover:border-[#35507E]"
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-semibold text-white">Candidaturas ({applications.length})</p>
                                </div>
                                <label className="mt-3 flex h-11 items-center gap-3 rounded-xl border border-[#2A3445] bg-[#101826] px-4">
                                    <Search size={16} className="text-slate-500" />
                                    <input
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        placeholder="Buscar por empresa ou vaga..."
                                        className="h-full w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                                    />
                                </label>

                                <div className="mt-3 space-y-2">
                                    {visible.length === 0 ? (
                                        <p className="rounded-xl border border-dashed border-[#273247] px-4 py-8 text-center text-sm text-slate-500">
                                            {applications.length === 0
                                                ? "Nenhuma candidatura ainda. Ative as campanhas das variantes no desktop."
                                                : "Nenhuma candidatura encontrada."}
                                        </p>
                                    ) : (
                                        visible.map((app) => (
                                            <div
                                                key={app.id}
                                                className="flex flex-col gap-3 rounded-xl border border-[#24304A] bg-[#131D2D] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                                            >
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="flex h-5 w-5 items-center justify-center rounded bg-[#2563EB] text-[10px] font-bold text-white">
                                                            {app.variant}
                                                        </span>
                                                        <span className="truncate text-sm font-medium text-slate-200">{app.jobTitle ?? "—"}</span>
                                                    </div>
                                                    <p className="mt-0.5 truncate text-xs text-slate-500">{app.companyName ?? "—"}</p>
                                                </div>

                                                <div className="flex shrink-0 items-center gap-4">
                                                    <label className="flex cursor-pointer items-center gap-1.5 text-xs text-slate-300">
                                                        <input
                                                            type="checkbox"
                                                            checked={app.gotResponse}
                                                            onChange={() => toggleResponse(app)}
                                                            className="h-4 w-4 cursor-pointer accent-emerald-500"
                                                        />
                                                        Resposta
                                                    </label>
                                                    <label className="flex cursor-pointer items-center gap-1.5 text-xs text-slate-300">
                                                        <input
                                                            type="checkbox"
                                                            checked={app.gotInterview}
                                                            onChange={() => toggleInterview(app)}
                                                            className="h-4 w-4 cursor-pointer accent-amber-500"
                                                        />
                                                        Entrevista
                                                    </label>
                                                    {app.jobUrl ? (
                                                        <a
                                                            href={app.jobUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            aria-label="Abrir vaga"
                                                            className="text-[#60A5FA] transition hover:text-[#93C5FD]"
                                                        >
                                                            <ExternalLink size={14} />
                                                        </a>
                                                    ) : null}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
