"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BriefcaseBusiness, Info, Rocket } from "lucide-react";
import { useCampaigns } from "../../../hooks/use-campaigns";
import { useResumes } from "../../../hooks/use-resumes";
import { SelectField } from "../../../components/atoms/SelectField";
import { LinkedinParametersForm } from "../../../components/organisms/LinkedinParametersForm";
import { InfojobsParametersForm } from "../../../components/organisms/InfojobsParametersForm";
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
    const router = useRouter();
    const { resumes, isLoading: isLoadingResumes } = useResumes();
    const { createLinkedinCampaign, createInfojobsCampaign } = useCampaigns();
    const [platform, setPlatform] = useState<CampaignPlatform>("linkedin");
    const [resumeId, setResumeId] = useState("");
    const [campaignName, setCampaignName] = useState("");
    const [dailyLimit, setDailyLimit] = useState("20");
    const [linkedinValues, setLinkedinValues] = useState<LinkedinFormValues>(defaultLinkedinValues);
    const [infojobsValues, setInfojobsValues] = useState<InfojobsFormValues>(defaultInfojobsValues);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleLinkedinChange<K extends keyof LinkedinFormValues>(field: K, value: LinkedinFormValues[K]) {
        setLinkedinValues((prev) => ({ ...prev, [field]: value }));
    }

    function handleInfojobsChange<K extends keyof InfojobsFormValues>(field: K, value: InfojobsFormValues[K]) {
        setInfojobsValues((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSubmit() {
        if (!resumeId || !campaignName.trim()) {
            return;
        }

        setIsSubmitting(true);

        try {
            if (platform === "linkedin") {
                await createLinkedinCampaign({
                    name: campaignName,
                    resumeId,
                    platform: "linkedin",
                    dailyLimit: Number(dailyLimit || 0),
                    linkedinConfig: {
                        searchTerms: linkedinValues.searchTerms.join(", "),
                        locationTerm: linkedinValues.location.join(", "),
                        sortBy: linkedinValues.sortBy,
                        datePosted: linkedinValues.datePosted,
                        expLevel: [linkedinValues.experienceLevel],
                        jobType: [linkedinValues.jobType],
                        remoteFilter: [linkedinValues.remoteFilter],
                    },
                });
            } else {
                await createInfojobsCampaign({
                    name: campaignName,
                    resumeId,
                    platform: "infojobs",
                    dailyLimit: Number(dailyLimit || 0),
                    infojobsConfig: {
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
                    },
                });
            }

            router.push("/campanhas");
        } finally {
            setIsSubmitting(false);
        }
    }

    const canSubmit =
        Boolean(resumeId) &&
        Boolean(campaignName.trim()) &&
        Number(dailyLimit) > 0 &&
        (platform === "linkedin" ? linkedinValues.searchTerms.length > 0 : infojobsValues.searchTerms.length > 0);

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
                                <label className="block text-sm font-medium text-slate-200">Campaign Name</label>
                                <input
                                    value={campaignName}
                                    onChange={(event) => setCampaignName(event.target.value)}
                                    placeholder="e.g. Senior React Search - Q3"
                                    className="h-12 w-full rounded-xl border border-[#263149] bg-[#101826] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#3B82F6]"
                                />
                            </div>

                            <label className="block space-y-2">
                                <span className="text-sm font-medium text-slate-200">Resume</span>
                                <SelectField
                                    value={resumeId}
                                    onChange={setResumeId}
                                    options={resumes.map((resume) => ({ label: resume.title, value: resume.id }))}
                                    placeholder="Select a resume..."
                                />
                            </label>
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
                                <LinkedinParametersForm values={linkedinValues} onChange={handleLinkedinChange} />
                            ) : (
                                <InfojobsParametersForm values={infojobsValues} onChange={handleInfojobsChange} />
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
                                    onClick={handleSubmit}
                                    disabled={!canSubmit || isSubmitting}
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.28)] transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Rocket size={16} />
                                    {isSubmitting ? "Creating..." : "Create Campaign"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
