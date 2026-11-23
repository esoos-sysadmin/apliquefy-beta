"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BriefcaseBusiness, Cloud, FlaskConical, Info, Rocket } from "lucide-react";
import { useCampaigns } from "../../../hooks/use-campaigns";
import { useAbTests } from "../../../hooks/use-ab-tests";
import { useResumes } from "../../../hooks/use-resumes";
import { useIsMobile } from "../../../hooks/use-is-mobile";
import { AB_TESTS_ENABLED } from "../../../lib/constants/features";
import { SelectField } from "../../../components/atoms/SelectField";
import { LinkedinParametersForm } from "../../../components/organisms/LinkedinParametersForm";
import { InfojobsParametersForm } from "../../../components/organisms/InfojobsParametersForm";
import { FormErrorBanner } from "../../../components/molecules/FormErrorBanner";
import { ApiError } from "../../../lib/api-client";
import { flattenZodErrorTree, type FieldError } from "../../../lib/format-field-errors";
import type { LinkedinFormValues } from "../../../components/organisms/LinkedinParametersForm";
import type { InfojobsFormValues } from "../../../components/organisms/InfojobsParametersForm";
import { AtsParametersForm, type AtsFormValues } from "../../../components/organisms/AtsParametersForm";

type CampaignPlatform = "linkedin" | "infojobs" | "ats";

const defaultAtsValues: AtsFormValues = {
    searchTerms: [],
    location: [],
    workModels: [],
    seniorities: [],
    excludeTerms: [],
    atsAllowlist: [],
    fitMinScore: "0", // ADR-07: gate desligado por padrão
    consent: false,
};

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
    const { createLinkedinCampaign, createInfojobsCampaign, createAtsCampaign } = useCampaigns();
    const { createAbTest } = useAbTests();
    const [platform, setPlatform] = useState<CampaignPlatform>("linkedin");
    const isMobile = useIsMobile();
    // Celular: nuvem primeiro e já selecionada; LinkedIn/InfoJobs ficam desabilitados (UX, o backend aceita).
    useEffect(() => {
        if (isMobile) setPlatform("ats");
    }, [isMobile]);
    function selectPlatform(next: CampaignPlatform) {
        if (isMobile && next !== "ats") return;
        setPlatform(next);
    }
    const blocked = (p: CampaignPlatform) => isMobile === true && p !== "ats";
    const [resumeId, setResumeId] = useState("");
    const [abTest, setAbTest] = useState(() => AB_TESTS_ENABLED && searchParams.get("ab") === "1");
    const [resumeBId, setResumeBId] = useState("");
    const [hypothesis, setHypothesis] = useState("");
    const [campaignName, setCampaignName] = useState("");
    const [dailyLimit, setDailyLimit] = useState("20");
    const [linkedinValues, setLinkedinValues] = useState<LinkedinFormValues>(defaultLinkedinValues);
    const [infojobsValues, setInfojobsValues] = useState<InfojobsFormValues>(defaultInfojobsValues);
    const [atsValues, setAtsValues] = useState<AtsFormValues>(defaultAtsValues);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // A/B ainda não existe para a nuvem
    const isAbTest = abTest && platform !== "ats";
    const [apiErrors, setApiErrors] = useState<FieldError[]>([]);
    const [localError, setLocalError] = useState<string | null>(null);

    function handleLinkedinChange<K extends keyof LinkedinFormValues>(field: K, value: LinkedinFormValues[K]) {
        setLinkedinValues((prev) => ({ ...prev, [field]: value }));
    }

    function handleInfojobsChange<K extends keyof InfojobsFormValues>(field: K, value: InfojobsFormValues[K]) {
        setInfojobsValues((prev) => ({ ...prev, [field]: value }));
    }

    function handleAtsChange<K extends keyof AtsFormValues>(field: K, value: AtsFormValues[K]) {
        setAtsValues((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSubmit() {
        setApiErrors([]);
        setLocalError(null);

        const missing: FieldError[] = [];
        if (!campaignName.trim()) missing.push({ path: "name", label: "Nome da campanha", message: "Campo obrigatório" });
        if (!resumeId) missing.push({ path: "resumeId", label: isAbTest ? "Currículo A" : "Currículo", message: "Selecione um currículo" });
        if (isAbTest && !resumeBId) missing.push({ path: "resumeBId", label: "Currículo B", message: "Selecione o segundo currículo" });
        if (isAbTest && resumeBId && resumeBId === resumeId) missing.push({ path: "resumeBId", label: "Currículo B", message: "Escolha um currículo diferente do A" });
        if (Number(dailyLimit) <= 0) missing.push({ path: "dailyLimit", label: "Limite diário", message: "Informe um valor maior que zero" });
        const terms = platform === "linkedin" ? linkedinValues.searchTerms : platform === "ats" ? atsValues.searchTerms : infojobsValues.searchTerms;
        if (platform === "ats" && Number(atsValues.fitMinScore) > 100) missing.push({ path: "fitMinScore", label: "Nota mínima", message: "Use um valor de 0 a 100" });
        if (platform === "ats" && !atsValues.consent) missing.push({ path: "consent", label: "Consentimento", message: "Aceite o envio pelo navegador na nuvem" });
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
            if (isAbTest) {
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

            if (platform === "ats") {
                await createAtsCampaign({
                    name: campaignName,
                    resumeId,
                    dailyLimit: Number(dailyLimit || 0),
                    consent: atsValues.consent,
                    atsConfig: {
                        searchTerms: atsValues.searchTerms.join(", "),
                        locationTerm: atsValues.location.join(", ") || undefined,
                        workModels: atsValues.workModels,
                        seniorities: atsValues.seniorities,
                        excludeTerms: atsValues.excludeTerms,
                        atsAllowlist: atsValues.atsAllowlist,
                        fitMinScore: Number(atsValues.fitMinScore || 0),
                    },
                });
            } else if (platform === "linkedin") {
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
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-4 text-fg sm:gap-6">
            <div className="border-b border-line pb-4 sm:pb-6">
                <div className="space-y-3">
                    <div className="hidden flex-wrap items-center gap-2 text-sm text-slate-500 sm:flex">
                        <Link href="/relatorios" className="transition-colors hover:text-slate-300">Relatórios</Link>
                        <span>/</span>
                        <Link href="/campanhas" className="transition-colors hover:text-slate-300">
                            Campanhas
                        </Link>
                        <span>/</span>
                        <span className="text-slate-300">Nova campanha</span>
                    </div>

                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-fg sm:text-4xl">
                            Criar nova campanha de automação
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
                            <span className="sm:hidden">Configure os parâmetros da busca e dos envios.</span>
                            <span className="hidden sm:inline">Configure os parâmetros para o agente desktop iniciar a busca e preparar os envios automáticos.</span>
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
                <div className="rounded-2xl border border-line bg-surface p-6">
                    <div className="h-40 animate-pulse rounded-2xl bg-sunken" />
                </div>
            ) : resumes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
                    <p className="text-lg font-semibold text-fg">Você precisa de um currículo antes de criar campanhas.</p>
                    <p className="mt-2 text-sm text-slate-400">Crie um currículo e depois volte para configurar a automação.</p>
                    <Link
                        href="/curriculos/novo"
                        className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-accent px-5 text-sm font-semibold text-white transition hover:bg-accent-hover"
                    >
                        Criar currículo
                    </Link>
                </div>
            ) : (
                <div className="rounded-xl border border-line bg-surface p-4 sm:rounded-2xl sm:p-6">
                    <div className="space-y-4 sm:space-y-6">
                        <div className="grid gap-4 lg:grid-cols-2">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-200">Nome da campanha</label>
                                <input
                                    value={campaignName}
                                    onChange={(event) => setCampaignName(event.target.value)}
                                    placeholder="ex.: Busca React Sênior - Q3"
                                    className="h-12 w-full rounded-xl border border-line-strong bg-sunken px-4 text-sm text-fg outline-none transition placeholder:text-slate-500 focus:border-accent"
                                />
                            </div>

                            <label className="block space-y-2">
                                <span className="text-sm font-medium text-slate-200">{isAbTest ? "Currículo A (variante A)" : "Currículo"}</span>
                                <SelectField
                                    value={resumeId}
                                    onChange={setResumeId}
                                    options={resumes.map((resume) => ({ label: resume.title, value: resume.id }))}
                                    placeholder="Selecione um currículo..."
                                />
                            </label>
                        </div>

                        {AB_TESTS_ENABLED && platform !== "ats" && (
                        <div className="space-y-4 rounded-2xl border border-line-strong bg-sunken p-4">
                            <label className="flex cursor-pointer items-start justify-between gap-4">
                                <span className="flex items-start gap-3">
                                    <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl border border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-300">
                                        <FlaskConical size={18} />
                                    </span>
                                    <span>
                                        <span className="block text-sm font-semibold text-fg">Teste A/B</span>
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
                                    className="mt-1 h-5 w-9 shrink-0 cursor-pointer appearance-none rounded-full bg-line-strong transition checked:bg-accent relative before:absolute before:top-0.5 before:left-0.5 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition checked:before:translate-x-4"
                                />
                            </label>

                            {abTest ? (
                                <div className="grid gap-4 border-t border-line pt-4 lg:grid-cols-2">
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
                                            className="h-12 w-full rounded-xl border border-line-strong bg-sunken px-4 text-sm text-fg outline-none transition placeholder:text-slate-500 focus:border-accent"
                                        />
                                    </label>
                                </div>
                            ) : null}
                        </div>
                        )}

                        <div className="max-w-[320px] space-y-2">
                            <label className="block text-sm font-medium text-slate-200">
                                Limite diário de tentativas de candidatura
                                <span className="mt-1 block text-xs text-slate-400 sm:ml-1 sm:mt-0 sm:inline sm:text-sm">
                                    (Este campo consome créditos, por exemplo: limite de 20 tentativas = 20 créditos)
                                </span>
                            </label>
                            <input
                                value={dailyLimit}
                                onChange={(event) => setDailyLimit(event.target.value.replace(/\D/g, "").slice(0, 3))}
                                inputMode="numeric"
                                className="h-12 w-full rounded-xl border border-line-strong bg-sunken px-4 text-sm text-fg outline-none transition placeholder:text-slate-500 focus:border-accent"
                            />
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm font-medium text-slate-200">Plataforma alvo</p>

                            {isMobile && (
                                <div role="note" className="rounded-xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-fg">
                                    <strong>Você está no celular.</strong> Daqui, suas candidaturas vão pela nuvem, em formulários abertos nos
                                    sites das empresas (Greenhouse, Lever, Ashby…). Para candidatar pelo LinkedIn ou InfoJobs, use o app no
                                    computador.{" "}
                                    <Link href="/desktop" className="inline-block py-1 font-semibold text-accent-text underline">
                                        Baixar o app desktop →
                                    </Link>
                                </div>
                            )}

                            <div className="grid gap-3 lg:grid-cols-3">
                                <button
                                    type="button"
                                    onClick={() => selectPlatform("linkedin")}
                                    aria-disabled={blocked("linkedin") || undefined}
                                    className={`flex min-h-[44px] items-center justify-between gap-3 rounded-xl border px-3 py-3 sm:rounded-2xl sm:px-4 sm:py-4 text-left transition ${blocked("linkedin") ? "cursor-not-allowed opacity-50 grayscale" : ""} ${
                                        platform === "linkedin"
                                            ? "border-accent bg-accent-soft shadow-[0_0_0_1px_rgb(var(--c-accent) / 0.35)]"
                                            : "border-line-strong bg-surface hover:border-line-strong"
                                    }`}
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center sm:h-12 sm:w-12 justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300">
                                            <BriefcaseBusiness size={20} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-fg">LinkedIn</p>
                                            <p className="text-sm text-slate-400">Ideal para networking profissional</p>
                                        </div>
                                    </div>
                                    <span
                                        className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${
                                            platform === "linkedin"
                                                ? "border-accent bg-accent text-white"
                                                : "border-line-strong text-transparent"
                                        }`}
                                    >
                                        ●
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => selectPlatform("infojobs")}
                                    aria-disabled={blocked("infojobs") || undefined}
                                    className={`flex min-h-[44px] items-center justify-between gap-3 rounded-xl border px-3 py-3 sm:rounded-2xl sm:px-4 sm:py-4 text-left transition ${blocked("infojobs") ? "cursor-not-allowed opacity-50 grayscale" : ""} ${
                                        platform === "infojobs"
                                            ? "border-accent bg-accent-soft shadow-[0_0_0_1px_rgb(var(--c-accent) / 0.35)]"
                                            : "border-line-strong bg-surface hover:border-line-strong"
                                    }`}
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center sm:h-12 sm:w-12 justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-300">
                                            <BriefcaseBusiness size={20} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-fg">InfoJobs</p>
                                            <p className="text-sm text-slate-400">Alto volume de vagas</p>
                                        </div>
                                    </div>
                                    <span
                                        className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${
                                            platform === "infojobs"
                                                ? "border-accent bg-accent text-white"
                                                : "border-line-strong text-transparent"
                                        }`}
                                    >
                                        ●
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => selectPlatform("ats")}
                                    aria-disabled={blocked("ats") || undefined}
                                    className={`flex min-h-[44px] items-center justify-between gap-3 rounded-xl border px-3 py-3 sm:rounded-2xl sm:px-4 sm:py-4 text-left transition ${blocked("ats") ? "cursor-not-allowed opacity-50 grayscale" : ""} ${isMobile ? "order-first" : ""} ${
                                        platform === "ats"
                                            ? "border-accent bg-accent-soft shadow-[0_0_0_1px_rgb(var(--c-accent) / 0.35)]"
                                            : "border-line-strong bg-surface hover:border-line-strong"
                                    }`}
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center sm:h-12 sm:w-12 justify-center rounded-2xl border border-accent/20 bg-accent-soft text-accent-text">
                                            <Cloud size={20} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-fg">Sites de empresas</p>
                                            <p className="text-sm text-slate-400">Roda na nuvem, sem o desktop</p>
                                        </div>
                                    </div>
                                    <span
                                        className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${
                                            platform === "ats"
                                                ? "border-accent bg-accent text-white"
                                                : "border-line-strong text-transparent"
                                        }`}
                                    >
                                        ●
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="border-t border-line pt-6">
                            {platform === "ats" ? (
                                <AtsParametersForm values={atsValues} onChange={handleAtsChange} />
                            ) : platform === "linkedin" ? (
                                <LinkedinParametersForm values={linkedinValues} onChange={handleLinkedinChange} />
                            ) : (
                                <InfojobsParametersForm values={infojobsValues} onChange={handleInfojobsChange} />
                            )}
                        </div>

                        <div className="flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="hidden items-center gap-2 text-sm text-slate-500 sm:inline-flex">
                                <Info size={14} />
                                Confira seus filtros antes de começar
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-end">
                                <Link
                                    href="/campanhas"
                                    className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-line-strong px-5 text-sm font-semibold text-slate-300 sm:w-auto transition hover:border-line-strong hover:bg-surface"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="inline-flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-accent px-4 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(122,59,255,0.28)] transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Rocket size={16} />
                                    {isSubmitting ? "Criando..." : isAbTest ? "Criar Teste A/B" : (<><span className="sm:hidden">Criar</span><span className="hidden sm:inline">Criar campanha</span></>)}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
