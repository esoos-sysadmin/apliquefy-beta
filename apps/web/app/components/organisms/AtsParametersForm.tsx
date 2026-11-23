"use client";

import { Cloud } from "lucide-react";
import { TagInput } from "../atoms/TagInput";
import { atsOptions, atsSeniorityOptions, atsWorkModelOptions } from "../../lib/constants/campaign-options";
import type { Seniority, WorkModel } from "../../types/campaign";

type AtsValue = (typeof atsOptions)[number]["value"];

const workModelOptions: { label: string; value: WorkModel }[] = [...atsWorkModelOptions];
const seniorityOptions: { label: string; value: Seniority }[] = [...atsSeniorityOptions];

export interface AtsFormValues {
    searchTerms: string[];
    location: string[];
    workModels: WorkModel[];
    seniorities: Seniority[];
    excludeTerms: string[];
    atsAllowlist: AtsValue[];
    fitMinScore: string;
    consent: boolean;
}

const inputClass =
    "h-12 w-full rounded-xl border border-line-strong bg-sunken px-4 text-sm text-fg outline-none transition placeholder:text-slate-500 focus:border-accent";

// Campanha "Sites de empresas" (§6.4): roda no worker da nuvem, sem o desktop.
export function AtsParametersForm({
    values,
    onChange,
}: {
    values: AtsFormValues;
    onChange: <K extends keyof AtsFormValues>(field: K, value: AtsFormValues[K]) => void;
}) {
    function toggle<T extends string>(list: T[], value: T) {
        return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
    }

    function chips<T extends string>(options: { label: string; value: T }[], selected: T[], onToggle: (value: T) => void) {
        return (
            <div className="flex flex-wrap gap-2">
                {options.map((option) => {
                    const on = selected.includes(option.value);
                    return (
                        <button
                            key={option.value}
                            type="button"
                            aria-pressed={on}
                            onClick={() => onToggle(option.value)}
                            className={`min-h-[44px] rounded-full border px-4 py-2 text-sm transition ${
                                on ? "border-accent bg-accent-soft text-accent-text" : "border-line-strong text-muted hover:border-accent"
                            }`}
                        >
                            {option.label}
                        </button>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <Cloud size={18} className="text-accent-text" />
                    <h2 className="text-lg font-semibold text-fg sm:text-xl">Parâmetros dos sites de empresas</h2>
                </div>
                <p className="text-sm text-muted">
                    Procuramos vagas nos sites de carreira das empresas (Greenhouse, Lever, Ashby e outros) e enviamos
                    por um navegador na nuvem. Não precisa deixar o computador ligado nem abrir o app desktop.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-300">Termos de busca</span>
                    <TagInput
                        tags={values.searchTerms}
                        onChange={(tags) => onChange("searchTerms", tags)}
                        placeholder="ex.: Engenheiro de Dados"
                    />
                </label>
                <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-300">Local (opcional)</span>
                    <TagInput tags={values.location} onChange={(tags) => onChange("location", tags)} placeholder="ex.: Recife" />
                </label>
            </div>

            <fieldset className="space-y-2">
                <legend className="text-sm font-medium text-slate-300">
                    Modelo de trabalho <span className="text-slate-400">— nenhum marcado = todos</span>
                </legend>
                {chips(workModelOptions, values.workModels, (v) => onChange("workModels", toggle(values.workModels, v)))}
            </fieldset>

            <fieldset className="space-y-2">
                <legend className="text-sm font-medium text-slate-300">
                    Senioridade <span className="text-slate-400">— nenhuma marcada = todas</span>
                </legend>
                {chips(seniorityOptions, values.seniorities, (v) => onChange("seniorities", toggle(values.seniorities, v)))}
            </fieldset>

            <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-300">
                    Excluir vagas com <span className="text-slate-400">(opcional — palavras no título)</span>
                </span>
                <TagInput tags={values.excludeTerms} onChange={(tags) => onChange("excludeTerms", tags)} placeholder="ex.: vendas, PJ" />
            </label>

            <fieldset className="space-y-2">
                <legend className="text-sm font-medium text-slate-300">Sites permitidos (nenhum marcado = todos)</legend>
                {chips([...atsOptions], values.atsAllowlist, (v) => onChange("atsAllowlist", toggle(values.atsAllowlist, v)))}
            </fieldset>

            <label className="block max-w-[320px] space-y-2">
                <span className="text-sm font-medium text-slate-300">
                    Nota mínima de aderência (0 a 100)
                    <span className="ml-1 text-slate-400">— 0 desliga; acima disso, a vaga é avaliada antes de enviar</span>
                </span>
                <input
                    value={values.fitMinScore}
                    onChange={(event) => onChange("fitMinScore", event.target.value.replace(/\D/g, "").slice(0, 3))}
                    inputMode="numeric"
                    className={inputClass}
                />
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line-strong bg-sunken p-4 text-sm text-fg">
                <input
                    type="checkbox"
                    checked={values.consent}
                    onChange={(event) => onChange("consent", event.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[rgb(var(--c-accent))]"
                />
                <span>
                    Concordo que meu currículo e minhas respostas sejam enviados por um navegador na nuvem operado pela
                    Apliquefy e pela Browserbase. A sessão do navegador é encerrada ao fim de cada candidatura.
                </span>
            </label>
        </div>
    );
}
