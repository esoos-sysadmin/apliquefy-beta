"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronDown, Copy, Coins, Save, Sparkles } from "lucide-react";
import { useResumes } from "../../../hooks/use-resumes";
import { useCredits } from "../../../hooks/use-credits";
import { applySuggestions } from "../../../lib/helpers/resume";
import { RESUME_ANALYSIS_COST } from "../../../lib/constants/credits";
import { toast } from "../../../lib/toast";
import type { Resume, ResumeAnalysis } from "../../../types/resume";

function ResumeSelect({
    resumes,
    value,
    onChange,
    disabled,
}: {
    resumes: Resume[];
    value: string;
    onChange: (id: string) => void;
    disabled?: boolean;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const selected = resumes.find((r) => r.id === value) ?? null;

    useEffect(() => {
        if (!open) return;
        function onDoc(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }
        document.addEventListener("mousedown", onDoc);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDoc);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    return (
        <div ref={ref} className="relative flex-1">
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={open}
                className="flex h-12 w-full items-center justify-between gap-3 rounded-xl border border-[#2A3445] bg-[#101826] px-4 text-left text-sm text-slate-200 transition hover:border-[#35507E] focus:border-[#35507E] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
                <span className={`truncate ${selected ? "text-slate-100" : "text-slate-500"}`}>
                    {selected?.title ?? "Selecione um currículo"}
                </span>
                <ChevronDown size={16} className={`shrink-0 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <ul
                    role="listbox"
                    className="absolute z-30 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-[#2A3445] bg-[#131B2A] p-1 shadow-2xl shadow-black/50"
                >
                    {resumes.map((r) => {
                        const active = r.id === value;
                        return (
                            <li key={r.id}>
                                <button
                                    type="button"
                                    role="option"
                                    aria-selected={active}
                                    onClick={() => {
                                        onChange(r.id);
                                        setOpen(false);
                                    }}
                                    className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                                        active ? "bg-sky-500/15 text-sky-200" : "text-slate-300 hover:bg-[#1b2536]"
                                    }`}
                                >
                                    <span className="truncate">{r.title}</span>
                                    {active && <Check size={15} className="shrink-0 text-sky-300" />}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

function AnalyzeResumeInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { resumes, isLoading, analyzeResume, updateResume, createResume } = useResumes();
    const { balance, updateBalance } = useCredits();

    const credits = balance?.balance ?? null;
    const insufficient = credits !== null && credits < RESUME_ANALYSIS_COST;

    const [selectedId, setSelectedId] = useState("");
    const [analyzing, setAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
    const [chosen, setChosen] = useState<Set<string>>(new Set());
    const [saving, setSaving] = useState<"update" | "copy" | null>(null);

    // preseleciona pelo ?resume=<id> ou pelo primeiro currículo disponível
    useEffect(() => {
        if (selectedId || resumes.length === 0) return;
        const fromQuery = searchParams.get("resume");
        setSelectedId(fromQuery && resumes.some((r) => r.id === fromQuery) ? fromQuery : (resumes[0]?.id ?? ""));
    }, [resumes, searchParams, selectedId]);

    const selectedResume = useMemo(() => resumes.find((r) => r.id === selectedId) ?? null, [resumes, selectedId]);

    function resetAnalysis() {
        setAnalysis(null);
        setChosen(new Set());
    }

    async function handleAnalyze() {
        if (!selectedId) return;
        resetAnalysis();
        setAnalyzing(true);
        try {
            const result = await analyzeResume(selectedId);
            setAnalysis(result);
            setChosen(new Set(result.suggestions.map((s) => s.id))); // todos marcados por padrão
            if (typeof result.newBalance === "number") updateBalance(result.newBalance);
            toast.success(`Análise concluída · -${result.creditsDebited ?? RESUME_ANALYSIS_COST} créditos`);
        } catch {
            // erro já exibido via toast pelo hook (inclui "créditos insuficientes")
        } finally {
            setAnalyzing(false);
        }
    }

    function toggle(id: string) {
        setChosen((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    const allSelected = Boolean(analysis && chosen.size === analysis.suggestions.length && analysis.suggestions.length > 0);

    function toggleAll() {
        if (!analysis) return;
        setChosen(allSelected ? new Set() : new Set(analysis.suggestions.map((s) => s.id)));
    }

    async function handleSave(mode: "update" | "copy") {
        if (!selectedResume || !analysis) return;
        const picked = analysis.suggestions.filter((s) => chosen.has(s.id));
        const payload = applySuggestions(selectedResume, picked);
        setSaving(mode);
        try {
            if (mode === "update") {
                await updateResume(selectedResume.id, payload);
                router.push(`/curriculos/${selectedResume.id}`);
            } else {
                await createResume({ ...payload, title: `${payload.title} (revisado)` });
                router.push("/curriculos");
            }
        } catch {
            // erro já exibido via toast pelo hook
        } finally {
            setSaving(null);
        }
    }

    return (
        <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 text-white">
            <div className="flex flex-col gap-3 border-b border-[#1C2333] pb-6">
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                    <Link href="/relatorios" className="transition-colors hover:text-slate-300">Relatórios</Link>
                    <span>/</span>
                    <Link href="/curriculos" className="transition-colors hover:text-slate-300">Currículos</Link>
                    <span>/</span>
                    <span className="text-slate-300">Analisar com IA</span>
                </div>
                <div>
                    <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        <Sparkles className="text-sky-400" size={30} />
                        Analisar currículo com IA
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
                        Escolha um currículo, receba sugestões de melhoria e aplique só as que quiser — atualizando o
                        currículo ou salvando uma cópia revisada.
                    </p>
                </div>
            </div>

            {/* Seleção do currículo */}
            <div className="rounded-2xl border border-[#1C2333] bg-[#131B2A] p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <label className="text-sm font-medium text-slate-300">Currículo</label>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
                        <Coins size={13} />
                        {RESUME_ANALYSIS_COST} créditos por análise
                        <span className="text-amber-400/60">·</span>
                        <span className="font-medium text-amber-200/80">saldo: {credits ?? "—"}</span>
                    </span>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                    {isLoading ? (
                        <div className="flex h-12 flex-1 items-center rounded-xl border border-[#2A3445] bg-[#101826] px-4 text-sm text-slate-500">
                            Carregando currículos...
                        </div>
                    ) : resumes.length === 0 ? (
                        <div className="flex h-12 flex-1 items-center rounded-xl border border-[#2A3445] bg-[#101826] px-4 text-sm text-slate-500">
                            Nenhum currículo —{" "}
                            <Link href="/curriculos/novo" className="ml-1 text-sky-300 hover:text-sky-200">
                                crie um primeiro
                            </Link>
                        </div>
                    ) : (
                        <ResumeSelect
                            resumes={resumes}
                            value={selectedId}
                            onChange={(id) => {
                                setSelectedId(id);
                                resetAnalysis();
                            }}
                        />
                    )}
                    <button
                        type="button"
                        onClick={handleAnalyze}
                        disabled={!selectedId || analyzing || insufficient}
                        title={insufficient ? "Créditos insuficientes" : undefined}
                        className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-6 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.28)] transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Sparkles size={16} />
                        {analyzing ? "Analisando..." : `Analisar · ${RESUME_ANALYSIS_COST} créditos`}
                    </button>
                </div>
                {insufficient && (
                    <p className="mt-3 text-xs text-amber-300">
                        Você tem {credits} créditos e a análise custa {RESUME_ANALYSIS_COST}.{" "}
                        <Link href="/assinatura" className="font-semibold underline hover:text-amber-200">
                            Adicionar créditos
                        </Link>
                    </p>
                )}
            </div>

            {analyzing && (
                <div className="rounded-2xl border border-[#1C2333] bg-[#131B2A] px-6 py-10 text-center text-sm text-slate-400">
                    A IA está lendo o currículo e montando as sugestões...
                </div>
            )}

            {analysis && (
                <>
                    <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">Avaliação geral</p>
                        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-200">{analysis.overallFeedback}</p>
                    </div>

                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white">
                            Sugestões <span className="text-slate-500">({chosen.size}/{analysis.suggestions.length})</span>
                        </h2>
                        {analysis.suggestions.length > 0 && (
                            <button type="button" onClick={toggleAll} className="text-sm font-medium text-sky-300 transition hover:text-sky-200">
                                {allSelected ? "Desmarcar todos" : "Selecionar todos"}
                            </button>
                        )}
                    </div>

                    {analysis.suggestions.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-[#2A3445] bg-[#131B2A] px-6 py-10 text-center text-sm text-slate-400">
                            A IA não encontrou ajustes relevantes — seu currículo já está bem estruturado.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {analysis.suggestions.map((s) => {
                                const suggested = Array.isArray(s.suggestedValue) ? s.suggestedValue.join(", ") : s.suggestedValue;
                                const active = chosen.has(s.id);
                                return (
                                    <label
                                        key={s.id}
                                        className={`flex cursor-pointer gap-4 rounded-2xl border p-4 transition-colors ${
                                            active ? "border-sky-500/40 bg-sky-500/[0.06]" : "border-[#1C2333] bg-[#131B2A] hover:border-[#283349]"
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={active}
                                            onChange={() => toggle(s.id)}
                                            className="mt-1 h-4 w-4 shrink-0 accent-sky-500"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <div className="mb-1 flex flex-wrap items-center gap-2">
                                                <span className="rounded-full border border-slate-600/40 bg-slate-700/30 px-2.5 py-0.5 text-[11px] font-medium text-slate-300">
                                                    {s.section}
                                                </span>
                                                <span className="text-sm font-semibold text-white">{s.title}</span>
                                            </div>
                                            <p className="text-sm text-slate-400">{s.rationale}</p>
                                            {s.currentValue && (
                                                <p className="mt-2 text-xs text-slate-500 line-through">{s.currentValue}</p>
                                            )}
                                            <p className="mt-1 text-sm text-emerald-300">{suggested}</p>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    )}

                    <div className="sticky bottom-4 flex flex-col gap-3 rounded-2xl border border-[#1C2333] bg-[#131B2A]/95 p-4 backdrop-blur sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={() => handleSave("copy")}
                            disabled={chosen.size === 0 || saving !== null}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#2A3445] px-5 text-sm font-semibold text-slate-200 transition hover:border-[#35507E] hover:bg-[#182233] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Copy size={15} />
                            {saving === "copy" ? "Salvando..." : "Salvar como cópia"}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSave("update")}
                            disabled={chosen.size === 0 || saving !== null}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.28)] transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Save size={15} />
                            {saving === "update" ? "Salvando..." : "Atualizar este currículo"}
                        </button>
                    </div>
                </>
            )}
        </section>
    );
}

export default function AnalyzeResumePage() {
    return (
        <Suspense fallback={null}>
            <AnalyzeResumeInner />
        </Suspense>
    );
}
