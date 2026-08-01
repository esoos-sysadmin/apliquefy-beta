"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BriefcaseBusiness, FlaskConical, Info, Rocket } from "lucide-react";
import { useCampaigns } from "../../../hooks/use-campaigns";
import { useAbTests } from "../../../hooks/use-ab-tests";
import { useResumes } from "../../../hooks/use-resumes";
import { SelectField } from "../../../components/atoms/SelectField";
import { LinkedinParametersForm } from "../../../components/organisms/LinkedinParametersForm";
import { InfojobsParametersForm } from "../../../components/organisms/InfojobsParametersForm";
import { FormErrorBanner } from "../../../components/molecules/FormErrorBanner";
import { ApiError } from "../../../lib/api-client";
import { flattenZodErrorTree, type FieldError } from "../../../lib/format-field-errors";
import type { LinkedinFormValues } from "../../../components/organisms/LinkedinParametersForm";
import type { InfojobsFormValues } from "../../../components/organisms/InfojobsParametersForm";

type CampaignPlatform = "linkedin" | "infojobs";

const defaultLinkedinValues: LinkedinFormValues = {
    searchTerms: [],
    location: [],
    sortBy: "relevant",
    datePosted: "past_week",
    experienceLevel: "mid_senior",
    jobType: "full_time",
    remoteFilter: "remote",
};

const defaultInfojobsValues: InfojobsFormValues = {
    searchTerms: [],
    locationState: "sao_paulo",
    radius: "km_25",
    salary: "brl_5000",
    datePosted: "ultima_semana",
    workModel: "hibrido",
    area: "informatica_ti_telecomunicacoes",
    contract: "clt",
    shift: "periodo_integral",
    seniority: "analista",
    pcd: "",
};

export default function NewCampaignPage() {
    return (
        <Suspense fallback={null}>
            <NewCampaignForm />
        </Suspense>
    );
}

function NewCampaignForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { resumes, isLoading: isLoadingResumes } = useResumes();
    const { createLinkedinCampaign, createInfojobsCampaign } = useCampaigns();
    const { createAbTest } = useAbTests();
    const [platform, setPlatform] = useState<CampaignPlatform>("linkedin");
    const [resumeId, setResumeId] = useState("");
    const [abTest, setAbTest] = useState(() => searchParams.get("ab") === "1");
    const [resumeBId, setResumeBId] = useState("");
    const [hypothesis, setHypothesis] = useState("");
    const [campaignName, setCampaignName] = useState("");
    const [dailyLimit, setDailyLimit] = useState("20");
    const [linkedinValues, setLinkedinValues] = useState<LinkedinFormValues>(defaultLinkedinValues);
    const [infojobsValues, setInfojobsValues] = useState<InfojobsFormValues>(defaultInfojobsValues);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiErrors, setApiErrors] = useState<FieldError[]>([]);
    const [localError, setLocalError] = useState<string | null>(null);

    function handleLinkedinChange<K extends keyof LinkedinFormValues>(field: K, value: LinkedinFormValues[K]) {
        setLinkedinValues((prev) => ({ ...prev, [field]: value }));
    }

    function handleInfojobsChange<K extends keyof InfojobsFormValues>(field: K, value: InfojobsFormValues[K]) {
        setInfojobsValues((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSubmit() {
        setApiErrors([]);
        setLocalError(null);

        const missing: FieldError[] = [];
        if (!campaignName.trim()) missing.push({ path: "name", label: "Nome da campanha", message: "Campo obrigatório" });
        if (!resumeId) missing.push({ path: "resumeId", label: abTest ? "Currículo A" : "Currículo", message: "Selecione um currículo" });
        if (abTest && !resumeBId) missing.push({ path: "resumeBId", label: "Currículo B", message: "Selecione o segundo currículo" });
        if (abTest && resumeBId && resumeBId === resumeId) missing.push({ path: "resumeBId", label: "Currículo B", message: "Escolha um currículo diferente do A" });
        if (Number(dailyLimit) <= 0) missing.push({ path: "dailyLimit", label: "Limite diário", message: "Informe um valor maior que zero" });
        const terms = platform === "linkedin" ? linkedinValues.searchTerms : infojobsValues.searchTerms;
        if (terms.length === 0) missing.push({ path: "searchTerms", label: "Termos de busca", message: "Adicione ao menos um termo" });

        if (missing.length > 0) {
            setApiErrors(missing);
            if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        const linkedinConfig = {
            searchTerms: linkedinValues.searchTerms.join(", "),
            locationTerm: linkedinValues.location.join(", "),
            sortBy: linkedinValues.sortBy,
            datePosted: linkedinValues.datePosted,
            expLevel: [linkedinValues.experienceLevel],
            jobType: [linkedinValues.jobType],
            remoteFilter: [linkedinValues.remoteFilter],
        };
        const infojobsConfig = {
            searchTerms: infojobsValues.searchTerms.join(", "),
            locationState: infojobsValues.locationState,
            kmDeVoce: infojobsValues.radius,
            salaryFilter: infojobsValues.salary,
            datePosted: infojobsValues.datePosted,
            workModels: [infojobsValues.workModel],
            jobAreas: [infojobsValues.area],
            contractTypes: [infojobsValues.contract],
            workSchedules: [infojobsValues.shift],
            seniorityLevels: [infojobsValues.seniority],
            pcdTypes: infojobsValues.pcd ? [infojobsValues.pcd] : [],
        };

        setIsSubmitting(true);

        try {
            if (abTest) {
                const base = {
                    name: campaignName,
                    resumeAId: resumeId,
                    resumeBId,
                    dailyLimit: Number(dailyLimit || 0),
                    hypothesis: hypothesis.trim() || undefined,
                };
                if (platform === "linkedin") {
                    await createAbTest({ ...base, platform: "linkedin", linkedinConfig });
                } else {
                    await createAbTest({ ...base, platform: "infojobs", infojobsConfig });
                }
                router.push("/campanhas?tab=ab");
                return;
            }

            if (platform === "linkedin") {
                await createLinkedinCampaign({
                    name: campaignName,
                    resumeId,
                    platform: "linkedin",
                    dailyLimit: Number(dailyLimit || 0),
                    linkedinConfig,
                });
            } else {
                await createInfojobsCampaign({
                    name: campaignName,
                    resumeId,
                    platform: "infojobs",
                    dailyLimit: Number(dailyLimit || 0),
                    infojobsConfig,
                });
            }

            router.push("/campanhas");
        } catch (error) {
            if (error instanceof ApiError && error.status === 400 && error.details) {
                const fieldErrors = flattenZodErrorTree(error.details);
                if (fieldErrors.length > 0) {
                    setApiErrors(fieldErrors);
                    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
                    return;
                }
            }
            if (error instanceof ApiError) {
                setLocalError(error.message);
            } else {
                setLocalError("Falha de comunicação com o servidor");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 text-white">
            <div className="border-b border-[#1C2333] pb-6">
                <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                        <Link href="/relatorios" className="transition-colors hover:text-slate-300">Relatórios</Link>
                        <span>/</span>
                        <Link href="/campanhas" className="transition-colors hover:text-slate-300">
                            Campanhas
                        </Link>
                        <span>/</span>
                        <span className="text-slate-300">Nova campanha</span>
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Criar nova campanha de automação
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
                            Configure os parâmetros para o agente desktop iniciar a busca e preparar os envios automáticos.
                        </p>
                    </div>
                </div>
            </div>

            <FormErrorBanner errors={apiErrors} />
            {localError && (
                <div
                    role="alert"
                    className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                >
                    {localError}
                </div>
            )}
            {isLoadingResumes ? (
                <div className="rounded-2xl border border-[#1C2333] bg-[#131B2A] p-6">
                    <div className="h-40 animate-pulse rounded-2xl bg-[#101826]" />
                </div>
            ) : resumes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#2A3445] bg-[#131B2A] px-6 py-14 text-center">
                    <p className="text-lg font-semibold text-white">Você precisa de um currículo antes de criar campanhas.</p>
                    <p className="mt-2 text-sm text-slate-400">Crie um currículo e depois volte para configurar a automação.</p>
                    <Link
                        href="/curriculos/novo"
                        className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-[#2563EB] px-5 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
                    >
                        Criar currículo
                    </Link>
                </div>
            ) : (
                <div className="rounded-2xl border border-[#1C2333] bg-[#131B2A] p-5 sm:p-6">
                    <div className="space-y-6">
                        <div className="grid gap-4 lg:grid-cols-2">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-200">Nome da campanha</label>
                                <input
                                    value={campaignName}
                                    onChange={(event) => setCampaignName(event.target.value)}
                                    placeholder="ex.: Busca React Sênior - Q3"
                                    className="h-12 w-full rounded-xl border border-[#263149] bg-[#101826] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#3B82F6]"
                                />
                            </div>

                            <label className="block space-y-2">
                                <span className="text-sm font-medium text-slate-200">{abTest ? "Currículo A (variante A)" : "Currículo"}</span>
                                <SelectField
                                    value={resumeId}
                                    onChange={setResumeId}
                                    options={resumes.map((resume) => ({ label: resume.title, value: resume.id }))}
                                    placeholder="Selecione um currículo..."
                                />
                            </label>
                        </div>

                        <div className="space-y-4 rounded-2xl border border-[#263149] bg-[#101826] p-4">
                            <label className="flex cursor-pointer items-start justify-between gap-4">
                                <span className="flex items-start gap-3">
                                    <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl border border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-300">
                                        <FlaskConical size={18} />
                                    </span>
                                    <span>
                                        <span className="block text-sm font-semibold text-white">Teste A/B</span>
                                        <span className="mt-1 block max-w-xl text-xs text-slate-400">
                                            Cria duas campanhas idênticas (variante A e B) com currículos diferentes. Você registra
                                            manualmente respostas e entrevistas e compara qual variante rende mais.
                                        </span>
                                    </span>
                                </span>
                                <input
                                    type="checkbox"
                                    checked={abTest}
                                    onChange={(event) => setAbTest(event.target.checked)}
                                    className="mt-1 h-5 w-9 shrink-0 cursor-pointer appearance-none rounded-full bg-[#263149] transition checked:bg-[#2563EB] relative before:absolute before:top-0.5 before:left-0.5 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition checked:before:translate-x-4"
                                />
                            </label>

                            {abTest ? (
                                <div className="grid gap-4 border-t border-[#1C2333] pt-4 lg:grid-cols-2">
                                    <label className="block space-y-2">
                                        <span className="text-sm font-medium text-slate-200">Currículo B (variante B)</span>
                                        <SelectField
                                            value={resumeBId}
                                            onChange={setResumeBId}
                                            options={resumes
                                                .filter((resume) => resume.id !== resumeId)
                                                .map((resume) => ({ label: resume.title, value: resume.id }))}
                                            placeholder="Selecione o segundo currículo..."
                                        />
                                    </label>
                                    <label className="block space-y-2">
                                        <span className="text-sm font-medium text-slate-200">Hipótese (opcional)</span>
                                        <input
                                            value={hypothesis}
                                            onChange={(event) => setHypothesis(event.target.value.slice(0, 200))}
                                            placeholder="Ex.: currículo enxuto responde mais que o detalhado"
                                            className="h-12 w-full rounded-xl border border-[#263149] bg-[#0D1522] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#3B82F6]"
                                        />
                                    </label>
                                </div>
                            ) : null}
                        </div>

                        <div className="max-w-[320px] space-y-2">
                            <label className="block text-sm font-medium text-slate-200">
                                Limite diário de tentativas de candidatura
                                <span className="ml-1 text-slate-400">
                                    (Este campo consome créditos, por exemplo: limite de 20 tentativas = 20 créditos)
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
                            <p className="text-sm font-medium text-slate-200">Plataforma alvo</p>

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
                                            <p className="text-sm text-slate-400">Ideal para networking profissional</p>
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
                                            <p className="text-sm text-slate-400">Alto volume de vagas</p>
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
                                <LinkedinParametersForm values={linkedinValues} onChange={handleLinkedinChange} />
                            ) : (
                                <InfojobsParametersForm values={infojobsValues} onChange={handleInfojobsChange} />
                            )}
                        </div>

                        <div className="flex flex-col gap-4 border-t border-[#1C2333] pt-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="inline-flex items-center gap-2 text-sm text-slate-500">
                                <Info size={14} />
                                Confira seus filtros antes de começar
                            </div>

                            <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                                <Link
                                    href="/campanhas"
                                    className="inline-flex h-11 items-center justify-center rounded-xl border border-[#273247] px-5 text-sm font-semibold text-slate-300 transition hover:border-[#31415c] hover:bg-[#131B2A]"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.28)] transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Rocket size={16} />
                                    {isSubmitting ? "Criando..." : abTest ? "Criar Teste A/B" : "Criar campanha"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
