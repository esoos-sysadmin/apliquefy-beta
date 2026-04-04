"use client";

import Link from "next/link";
import { useState } from "react";
import {
    BriefcaseBusiness,
    ChevronDown,
    Info,
    MapPin,
    Rocket,
    Search,
} from "lucide-react";

type CampaignPlatform = "linkedin" | "infojobs";

const sortOptions = ["Most Relevant", "Most Recent"] as const;
const datePostedOptions = ["Past week", "Past 24 hours", "Past month"] as const;
const experienceOptions = ["Entry level", "Associate", "Mid-Senior", "Director"] as const;
const jobTypeOptions = ["Full-time", "Contract", "Part-time", "Freelance"] as const;
const remoteOptions = ["Remote", "Hybrid", "On-site"] as const;
const infojobsStateOptions = ["São Paulo", "Rio de Janeiro", "Minas Gerais", "Paraná"] as const;
const infojobsRadiusOptions = ["5 km", "10 km", "25 km", "50 km"] as const;
const infojobsSalaryOptions = ["A combinar", "Até R$ 3.000", "Até R$ 5.000", "Acima de R$ 8.000"] as const;
const infojobsDateOptions = ["Última semana", "Últimas 24 horas", "Último mês"] as const;
const infojobsWorkModelOptions = ["Híbrido", "Presencial", "Home Office"] as const;
const infojobsAreaOptions = [
    "Informática / TI / Telecomunicações",
    "Administração",
    "Marketing",
    "Comercial / Vendas",
] as const;
const infojobsContractOptions = ["Efetivo - CLT", "PJ", "Temporário", "Estágio"] as const;
const infojobsShiftOptions = ["Período Integral", "Meio Período", "Noturno", "Flexível"] as const;
const infojobsSeniorityOptions = ["Pleno", "Júnior", "Sênior", "Especialista"] as const;
const infojobsPcdOptions = ["Sem filtro", "Aceita PcD", "Vagas exclusivas PcD"] as const;

export default function NewCampaignPage() {
    const [platform, setPlatform] = useState<CampaignPlatform>("linkedin");
    const [campaignName, setCampaignName] = useState("");
    const [dailyLimit, setDailyLimit] = useState("20");
    const [searchTerms, setSearchTerms] = useState("");
    const [location, setLocation] = useState("");
    const [sortBy, setSortBy] = useState<(typeof sortOptions)[number]>(sortOptions[0]);
    const [datePosted, setDatePosted] = useState<(typeof datePostedOptions)[number]>(datePostedOptions[0]);
    const [experienceLevel, setExperienceLevel] = useState("");
    const [jobType, setJobType] = useState("");
    const [remoteFilter, setRemoteFilter] = useState("");
    const [infojobsSearchTerms, setInfojobsSearchTerms] = useState("");
    const [infojobsState, setInfojobsState] = useState<(typeof infojobsStateOptions)[number]>(infojobsStateOptions[0]);
    const [infojobsRadius, setInfojobsRadius] = useState<(typeof infojobsRadiusOptions)[number]>(infojobsRadiusOptions[3]);
    const [infojobsSalary, setInfojobsSalary] = useState<(typeof infojobsSalaryOptions)[number]>(infojobsSalaryOptions[0]);
    const [infojobsDatePosted, setInfojobsDatePosted] = useState<(typeof infojobsDateOptions)[number]>(infojobsDateOptions[0]);
    const [infojobsWorkModel, setInfojobsWorkModel] = useState<(typeof infojobsWorkModelOptions)[number]>(infojobsWorkModelOptions[0]);
    const [infojobsArea, setInfojobsArea] = useState<(typeof infojobsAreaOptions)[number]>(infojobsAreaOptions[0]);
    const [infojobsContract, setInfojobsContract] = useState<(typeof infojobsContractOptions)[number]>(infojobsContractOptions[0]);
    const [infojobsShift, setInfojobsShift] = useState<(typeof infojobsShiftOptions)[number]>(infojobsShiftOptions[0]);
    const [infojobsSeniority, setInfojobsSeniority] = useState<(typeof infojobsSeniorityOptions)[number]>(infojobsSeniorityOptions[0]);
    const [infojobsPcd, setInfojobsPcd] = useState<(typeof infojobsPcdOptions)[number]>(infojobsPcdOptions[0]);

    return (
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 text-white">
            <div className="border-b border-[#1C2333] pb-6">
                <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                        <Link href="/dashboard" className="transition-colors hover:text-slate-300">
                            Dashboard
                        </Link>
                        <span>/</span>
                        <Link href="/campanhas" className="transition-colors hover:text-slate-300">
                            Campanhas
                        </Link>
                        <span>/</span>
                        <span className="text-slate-300">Nova campanha</span>
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Create New Automation Campaign
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
                            Configure os parâmetros para o agente desktop iniciar a busca e preparar os envios automáticos.
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-[#1C2333] bg-[#131B2A] p-5 sm:p-6">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-200">Campaign Name</label>
                        <input
                            value={campaignName}
                            onChange={(event) => setCampaignName(event.target.value)}
                            placeholder="e.g. Senior React Search - Q3"
                            className="h-12 w-full rounded-xl border border-[#263149] bg-[#101826] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#3B82F6]"
                        />
                    </div>

                    <div className="max-w-[320px] space-y-2">
                        <label className="block text-sm font-medium text-slate-200">
                            Daily Limit for try Applications
                            <span className="ml-1 text-slate-400">
                                (This field costs credits, for example: 20 limit for try applications = 20 credits)
                            </span>
                        </label>
                        <input
                            value={dailyLimit}
                            onChange={(event) => setDailyLimit(event.target.value.replace(/\D/g, "").slice(0, 3))}
                            inputMode="numeric"
                            className="h-12 w-full rounded-xl border border-[#263149] bg-[#101826] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#3B82F6]"
                        />
                    </div>

                    <div className="space-y-3">
                        <p className="text-sm font-medium text-slate-200">Target Platform</p>

                        <div className="grid gap-3 lg:grid-cols-2">
                            <button
                                type="button"
                                onClick={() => setPlatform("linkedin")}
                                className={`flex items-center justify-between rounded-2xl border px-4 py-4 text-left transition ${
                                    platform === "linkedin"
                                        ? "border-[#2563EB] bg-[#112544] shadow-[0_0_0_1px_rgba(37,99,235,0.35)]"
                                        : "border-[#263149] bg-[#151E2D] hover:border-[#31415C]"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300">
                                        <BriefcaseBusiness size={20} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">LinkedIn</p>
                                        <p className="text-sm text-slate-400">Best for professional networking</p>
                                    </div>
                                </div>
                                <span
                                    className={`inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                                        platform === "linkedin"
                                            ? "border-[#2563EB] bg-[#2563EB] text-white"
                                            : "border-[#39465D] text-transparent"
                                    }`}
                                >
                                    ●
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setPlatform("infojobs")}
                                className={`flex items-center justify-between rounded-2xl border px-4 py-4 text-left transition ${
                                    platform === "infojobs"
                                        ? "border-[#2563EB] bg-[#112544] shadow-[0_0_0_1px_rgba(37,99,235,0.35)]"
                                        : "border-[#263149] bg-[#151E2D] hover:border-[#31415C]"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-300">
                                        <BriefcaseBusiness size={20} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">InfoJobs</p>
                                        <p className="text-sm text-slate-400">High volume job listings</p>
                                    </div>
                                </div>
                                <span
                                    className={`inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                                        platform === "infojobs"
                                            ? "border-[#2563EB] bg-[#2563EB] text-white"
                                            : "border-[#39465D] text-transparent"
                                    }`}
                                >
                                    ●
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-[#1C2333] pt-6">
                        {platform === "linkedin" ? (
                            <div className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <BriefcaseBusiness size={18} className="text-cyan-300" />
                                    <h2 className="text-xl font-semibold text-white">LinkedIn Parameters</h2>
                                </div>

                                <div className="grid gap-4 lg:grid-cols-2">
                                    <label className="block space-y-2">
                                        <span className="text-sm font-medium text-slate-300">Search Terms</span>
                                        <div className="flex h-12 items-center gap-3 rounded-xl border border-[#263149] bg-[#101826] px-4">
                                            <Search size={16} className="text-slate-500" />
                                            <input
                                                value={searchTerms}
                                                onChange={(event) => setSearchTerms(event.target.value)}
                                                placeholder="e.g. Frontend Developer"
                                                className="h-full w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                                            />
                                        </div>
                                    </label>

                                    <label className="block space-y-2">
                                        <span className="text-sm font-medium text-slate-300">Location</span>
                                        <div className="flex h-12 items-center gap-3 rounded-xl border border-[#263149] bg-[#101826] px-4">
                                            <MapPin size={16} className="text-slate-500" />
                                            <input
                                                value={location}
                                                onChange={(event) => setLocation(event.target.value)}
                                                placeholder="e.g. Brazil, Remote"
                                                className="h-full w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                                            />
                                        </div>
                                    </label>

                                    <label className="block space-y-2">
                                        <span className="text-sm font-medium text-slate-300">Sort By</span>
                                        <SelectField
                                            value={sortBy}
                                            onChange={setSortBy}
                                            options={sortOptions}
                                        />
                                    </label>

                                    <label className="block space-y-2">
                                        <span className="text-sm font-medium text-slate-300">Date Posted</span>
                                        <SelectField
                                            value={datePosted}
                                            onChange={setDatePosted}
                                            options={datePostedOptions}
                                        />
                                    </label>

                                    <label className="block space-y-2">
                                        <span className="text-sm font-medium text-slate-300">
                                            Experience Level <span className="text-xs text-slate-500">(Multi-select)</span>
                                        </span>
                                        <SelectField
                                            value={experienceLevel}
                                            onChange={setExperienceLevel}
                                            options={experienceOptions}
                                            placeholder="Select levels..."
                                        />
                                    </label>

                                    <label className="block space-y-2">
                                        <span className="text-sm font-medium text-slate-300">
                                            Job Type <span className="text-xs text-slate-500">(Multi-select)</span>
                                        </span>
                                        <SelectField
                                            value={jobType}
                                            onChange={setJobType}
                                            options={jobTypeOptions}
                                            placeholder="Select types..."
                                        />
                                    </label>

                                    <label className="block space-y-2 lg:col-span-2 xl:max-w-[calc(50%-0.5rem)]">
                                        <span className="text-sm font-medium text-slate-300">
                                            Remote Filter <span className="text-xs text-slate-500">(Multi-select)</span>
                                        </span>
                                        <SelectField
                                            value={remoteFilter}
                                            onChange={setRemoteFilter}
                                            options={remoteOptions}
                                            placeholder="Select filters..."
                                        />
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <BriefcaseBusiness size={18} className="text-orange-300" />
                                    <h2 className="text-xl font-semibold text-white">InfoJobs Parameters</h2>
                                </div>

                                <div className="grid gap-4 lg:grid-cols-3">
                                    <label className="block space-y-2">
                                        <span className="text-sm font-medium text-slate-300">Search Terms</span>
                                        <div className="flex h-12 items-center gap-3 rounded-xl border border-[#263149] bg-[#101826] px-4">
                                            <Search size={16} className="text-slate-500" />
                                            <input
                                                value={infojobsSearchTerms}
                                                onChange={(event) => setInfojobsSearchTerms(event.target.value)}
                                                placeholder="Ex: Desenvolvedor Front-end"
                                                className="h-full w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                                            />
                                        </div>
                                    </label>

                                    <label className="block space-y-2">
                                        <span className="text-sm font-medium text-slate-300">Estado/UF</span>
                                        <SelectField
                                            value={infojobsState}
                                            onChange={setInfojobsState}
                                            options={infojobsStateOptions}
                                        />
                                    </label>

                                    <label className="block space-y-2">
                                        <span className="text-sm font-medium text-slate-300">Raio de busca</span>
                                        <SelectField
                                            value={infojobsRadius}
                                            onChange={setInfojobsRadius}
                                            options={infojobsRadiusOptions}
                                        />
                                    </label>

                                    <label className="block space-y-2">
                                        <span className="text-sm font-medium text-slate-300">Pretensão Salarial</span>
                                        <SelectField
                                            value={infojobsSalary}
                                            onChange={setInfojobsSalary}
                                            options={infojobsSalaryOptions}
                                        />
                                    </label>

                                    <label className="block space-y-2">
                                        <span className="text-sm font-medium text-slate-300">Data de Publicação</span>
                                        <SelectField
                                            value={infojobsDatePosted}
                                            onChange={setInfojobsDatePosted}
                                            options={infojobsDateOptions}
                                        />
                                    </label>

                                    <label className="block space-y-2">
                                        <span className="text-sm font-medium text-slate-300">Modelo de Trabalho</span>
                                        <SelectField
                                            value={infojobsWorkModel}
                                            onChange={setInfojobsWorkModel}
                                            options={infojobsWorkModelOptions}
                                        />
                                    </label>

                                    <label className="block space-y-2">
                                        <span className="text-sm font-medium text-slate-300">Área de Atuação</span>
                                        <SelectField
                                            value={infojobsArea}
                                            onChange={setInfojobsArea}
                                            options={infojobsAreaOptions}
                                        />
                                    </label>

                                    <label className="block space-y-2">
                                        <span className="text-sm font-medium text-slate-300">Tipo de Contrato</span>
                                        <SelectField
                                            value={infojobsContract}
                                            onChange={setInfojobsContract}
                                            options={infojobsContractOptions}
                                        />
                                    </label>

                                    <label className="block space-y-2">
                                        <span className="text-sm font-medium text-slate-300">Jornada</span>
                                        <SelectField
                                            value={infojobsShift}
                                            onChange={setInfojobsShift}
                                            options={infojobsShiftOptions}
                                        />
                                    </label>

                                    <label className="block space-y-2">
                                        <span className="text-sm font-medium text-slate-300">Nível Hierárquico</span>
                                        <SelectField
                                            value={infojobsSeniority}
                                            onChange={setInfojobsSeniority}
                                            options={infojobsSeniorityOptions}
                                        />
                                    </label>

                                    <label className="block space-y-2">
                                        <span className="text-sm font-medium text-slate-300">Inclusão PcD</span>
                                        <SelectField
                                            value={infojobsPcd}
                                            onChange={setInfojobsPcd}
                                            options={infojobsPcdOptions}
                                        />
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-4 border-t border-[#1C2333] pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="inline-flex items-center gap-2 text-sm text-slate-500">
                            <Info size={14} />
                            Check your filters before starting
                        </div>

                        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                            <Link
                                href="/campanhas"
                                className="inline-flex h-11 items-center justify-center rounded-xl border border-[#273247] px-5 text-sm font-semibold text-slate-300 transition hover:border-[#31415c] hover:bg-[#131B2A]"
                            >
                                Cancel
                            </Link>
                            <button
                                type="button"
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.28)] transition hover:bg-[#1d4ed8]"
                            >
                                <Rocket size={16} />
                                Create Campaign
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function SelectField<T extends string>({
    value,
    onChange,
    options,
    placeholder = "Select...",
}: {
    value: T | "";
    onChange: (value: T | "") => void;
    options: readonly T[];
    placeholder?: string;
}) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(event) => onChange(event.target.value as T | "")}
                className="h-12 w-full appearance-none rounded-xl border border-[#263149] bg-[#101826] px-4 pr-10 text-sm text-slate-200 outline-none transition focus:border-[#3B82F6]"
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
        </div>
    );
}
