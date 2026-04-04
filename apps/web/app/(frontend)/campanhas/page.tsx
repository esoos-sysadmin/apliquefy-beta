"use client";

import { useState } from "react";
import Link from "next/link";
import {
    BarChart3,
    BriefcaseBusiness,
    ChevronDown,
    Eye,
    Pause,
    Pencil,
    Play,
    Plus,
    Search,
    X,
} from "lucide-react";

type CampaignStatus = "running" | "paused" | "inactive";
type CampaignPlatform = "LinkedIn" | "InfoJobs";

type Campaign = {
    id: string;
    name: string;
    platform: CampaignPlatform;
    location: string;
    status: CampaignStatus;
    appliedCount: number;
    endedAt?: string;
    resumeTitle: string;
    dailyApplicationLimit: number;
    metrics: {
        totalApplied: number;
        successCount: number;
        failureCount: number;
        usedCredits: number;
        refundedCredits: number;
        lastUpdated: string;
    };
};

const campaignsMock: Campaign[] = [
    {
        id: "campaign-1",
        name: "Automação InfoJobs 2024",
        platform: "InfoJobs",
        location: "São Paulo, SP",
        status: "running",
        appliedCount: 124,
        resumeTitle: "Currículo Produto Tech",
        dailyApplicationLimit: 50,
        metrics: {
            totalApplied: 124,
            successCount: 98,
            failureCount: 26,
            usedCredits: 124,
            refundedCredits: 12,
            lastUpdated: "há 2 min",
        },
    },
    {
        id: "campaign-2",
        name: "Busca React Sênior - Q3",
        platform: "LinkedIn",
        location: "Remoto",
        status: "paused",
        appliedCount: 45,
        resumeTitle: "Currículo React Sênior",
        dailyApplicationLimit: 35,
        metrics: {
            totalApplied: 45,
            successCount: 31,
            failureCount: 14,
            usedCredits: 45,
            refundedCredits: 6,
            lastUpdated: "há 14 min",
        },
    },
    {
        id: "campaign-3",
        name: "Marketing Assistant - RJ",
        platform: "InfoJobs",
        location: "Rio de Janeiro, RJ",
        status: "inactive",
        appliedCount: 89,
        endedAt: "15 de out.",
        resumeTitle: "Currículo Marketing",
        dailyApplicationLimit: 20,
        metrics: {
            totalApplied: 89,
            successCount: 62,
            failureCount: 27,
            usedCredits: 89,
            refundedCredits: 18,
            lastUpdated: "há 1 dia",
        },
    },
    {
        id: "campaign-4",
        name: "Fullstack Node.js Europa",
        platform: "LinkedIn",
        location: "Worldwide",
        status: "running",
        appliedCount: 342,
        resumeTitle: "Currículo Fullstack Internacional",
        dailyApplicationLimit: 80,
        metrics: {
            totalApplied: 342,
            successCount: 290,
            failureCount: 52,
            usedCredits: 342,
            refundedCredits: 24,
            lastUpdated: "há 5 min",
        },
    },
];

const resumeOptions = [
    "Currículo Produto Tech",
    "Currículo React Sênior",
    "Currículo Marketing",
    "Currículo Fullstack Internacional",
] as const;

const statusOptions = [
    { label: "Todos os status", value: "all" },
    { label: "Running", value: "running" },
    { label: "Paused", value: "paused" },
    { label: "Inactive", value: "inactive" },
] as const;

const platformOptions = [
    { label: "Todas as plataformas", value: "all" },
    { label: "LinkedIn", value: "LinkedIn" },
    { label: "InfoJobs", value: "InfoJobs" },
] as const;

const statusConfig: Record<
    CampaignStatus,
    {
        label: string;
        badgeClassName: string;
        actionLabel: string;
        ActionIcon: typeof Pause;
        actionClassName: string;
        dotClassName: string;
        iconBoxClassName: string;
    }
> = {
    running: {
        label: "Running",
        badgeClassName: "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
        actionLabel: "Pausar",
        ActionIcon: Pause,
        actionClassName: "border border-slate-700 bg-slate-800/70 text-slate-200 hover:border-slate-600 hover:bg-slate-800",
        dotClassName: "bg-emerald-300",
        iconBoxClassName: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
    },
    paused: {
        label: "Paused",
        badgeClassName: "border border-amber-500/20 bg-amber-500/10 text-amber-300",
        actionLabel: "Retomar",
        ActionIcon: Play,
        actionClassName: "border border-blue-500/20 bg-blue-500/10 text-blue-300 hover:border-blue-400/30 hover:bg-blue-500/15",
        dotClassName: "bg-amber-300",
        iconBoxClassName: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
    },
    inactive: {
        label: "Inactive",
        badgeClassName: "border border-slate-700 bg-slate-800 text-slate-300",
        actionLabel: "Reativar",
        ActionIcon: Play,
        actionClassName: "border border-slate-700 bg-slate-800/70 text-slate-300 hover:border-slate-600 hover:bg-slate-800",
        dotClassName: "bg-slate-300",
        iconBoxClassName: "border border-orange-500/20 bg-orange-500/10 text-orange-300",
    },
};

function CampaignDetailsModal({
    campaign,
    onClose,
}: {
    campaign: Campaign;
    onClose: () => void;
}) {
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
                    <div className="rounded-2xl border border-[#24304A] bg-[#1A2436] px-4 py-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                            Total de vagas aplicadas
                        </p>
                        <p className="mt-2 text-4xl font-bold leading-none text-white">{campaign.metrics.totalApplied}</p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-[#202B40] bg-[#1A2436] px-4 py-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Sucesso</p>
                            <p className="mt-3 text-3xl font-semibold text-white">{campaign.metrics.successCount}</p>
                        </div>

                        <div className="rounded-2xl border border-[#202B40] bg-[#1A2436] px-4 py-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Falhas</p>
                            <p className="mt-3 text-3xl font-semibold text-white">{campaign.metrics.failureCount}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Consumo de créditos
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl border border-[#24437C] bg-[#15233A] px-4 py-4 text-center">
                                <p className="text-2xl font-semibold text-blue-300">{campaign.metrics.usedCredits}</p>
                                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Usados</p>
                            </div>
                            <div className="rounded-2xl border border-[#202B40] bg-[#1A2436] px-4 py-4 text-center">
                                <p className="text-2xl font-semibold text-slate-200">{campaign.metrics.refundedCredits}</p>
                                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Reembolsados</p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#243B63] px-4 text-sm font-semibold text-white transition hover:bg-[#2B4675]"
                    >
                        Fechar painel
                    </button>
                </div>

                <div className="flex items-center justify-between border-t border-[#192236] bg-[#0D1522] px-5 py-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-blue-400" />
                        Engine sincronizado
                    </span>
                    <span>Última atualização: {campaign.metrics.lastUpdated}</span>
                </div>
            </div>
        </div>
    );
}

function CampaignEditModal({
    campaign,
    onClose,
}: {
    campaign: Campaign;
    onClose: () => void;
}) {
    const [campaignName, setCampaignName] = useState(campaign.name);
    const [resumeTitle, setResumeTitle] = useState(campaign.resumeTitle);
    const [dailyLimit, setDailyLimit] = useState(String(campaign.dailyApplicationLimit));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/75 px-4 py-8 backdrop-blur-sm">
            <div className="w-full max-w-md overflow-hidden rounded-[22px] border border-[#273247] bg-[#1B2331] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                <div className="flex items-center justify-between border-b border-[#273247] px-5 py-5">
                    <h2 className="text-xl font-semibold text-blue-400">Editar campanha</h2>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar modal de edição"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-[#243146] hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="space-y-5 px-5 py-5">
                    <label className="block space-y-2">
                        <span className="text-sm font-medium text-slate-300">Campaign Name</span>
                        <input
                            value={campaignName}
                            onChange={(event) => setCampaignName(event.target.value)}
                            placeholder="Campaign name"
                            className="h-11 w-full rounded-xl border border-[#202A3A] bg-[#0F1623] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#3B82F6]"
                        />
                    </label>

                    <label className="block space-y-2">
                        <span className="text-sm font-medium text-slate-300">Resume</span>
                        <div className="relative">
                            <select
                                value={resumeTitle}
                                onChange={(event) => setResumeTitle(event.target.value)}
                                className="h-11 w-full appearance-none rounded-xl border border-[#202A3A] bg-[#0F1623] px-4 pr-10 text-sm text-slate-200 outline-none transition focus:border-[#3B82F6]"
                            >
                                {resumeOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        </div>
                    </label>

                    <label className="block space-y-2">
                        <span className="text-sm font-medium text-slate-300">Daily Application Limit</span>
                        <input
                            value={dailyLimit}
                            onChange={(event) => setDailyLimit(event.target.value.replace(/\D/g, "").slice(0, 3))}
                            inputMode="numeric"
                            placeholder="50"
                            className="h-11 w-full rounded-xl border border-[#202A3A] bg-[#0F1623] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#3B82F6]"
                        />
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                            Limit between 1 and 200 applications
                        </p>
                    </label>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-[#273247] bg-[#242C3A] px-5 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-11 items-center justify-center rounded-xl border border-[#313A49] px-4 text-sm font-semibold text-slate-300 transition hover:border-[#3D4658] hover:text-white"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-11 items-center justify-center rounded-xl bg-[#3B82F6] px-5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(59,130,246,0.25)] transition hover:bg-[#2563EB]"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

function CampaignCard({
    campaign,
    onView,
    onEdit,
}: {
    campaign: Campaign;
    onView: (campaign: Campaign) => void;
    onEdit: (campaign: Campaign) => void;
}) {
    const config = statusConfig[campaign.status];
    const ActionIcon = config.ActionIcon;

    return (
        <article className="rounded-2xl border border-[#1C2333] bg-[#131B2A] px-4 py-5 shadow-[0_0_0_1px_rgba(17,24,39,0.15)] transition-colors hover:border-[#283349] sm:px-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${config.iconBoxClassName}`}>
                        <BriefcaseBusiness size={22} strokeWidth={1.8} />
                    </div>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                            <h2 className="truncate text-lg font-semibold text-white">{campaign.name}</h2>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${config.badgeClassName}`}>
                                <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${config.dotClassName}`} />
                                {config.label}
                            </span>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-400">
                            <span className={`font-semibold ${campaign.platform === "LinkedIn" ? "text-sky-400" : "text-orange-400"}`}>
                                {campaign.platform}
                            </span>
                            <span className="text-slate-600">•</span>
                            <span>{campaign.location}</span>
                            <span className="text-slate-600">•</span>
                            <span>{campaign.appliedCount} candidaturas</span>
                            {campaign.endedAt ? (
                                <>
                                    <span className="text-slate-600">•</span>
                                    <span>Encerrada: {campaign.endedAt}</span>
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                    <button
                        type="button"
                        className={`inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-medium transition-colors ${config.actionClassName}`}
                    >
                        <ActionIcon size={15} />
                        {config.actionLabel}
                    </button>

                    <button
                        type="button"
                        onClick={() => onEdit(campaign)}
                        aria-label={`Editar campanha ${campaign.name}`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-slate-400 transition-colors hover:border-[#263149] hover:bg-[#182233] hover:text-white"
                    >
                        <Pencil size={16} />
                    </button>

                    <button
                        type="button"
                        onClick={() => onView(campaign)}
                        aria-label={`Visualizar campanha ${campaign.name}`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-slate-400 transition-colors hover:border-[#263149] hover:bg-[#182233] hover:text-white"
                    >
                        <Eye size={17} />
                    </button>
                </div>
            </div>
        </article>
    );
}

export default function CampaignsPage() {
    const [search, setSearch] = useState("");
    const [selectedPlatform, setSelectedPlatform] = useState<(typeof platformOptions)[number]["value"]>("all");
    const [selectedStatus, setSelectedStatus] = useState<(typeof statusOptions)[number]["value"]>("all");
    const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

    const filteredCampaigns = campaignsMock.filter((campaign) => {
        const matchesSearch = campaign.name.toLowerCase().includes(search.toLowerCase().trim());
        const matchesPlatform = selectedPlatform === "all" || campaign.platform === selectedPlatform;
        const matchesStatus = selectedStatus === "all" || campaign.status === selectedStatus;

        return matchesSearch && matchesPlatform && matchesStatus;
    });

    return (
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 text-white">
            <div className="flex items-start justify-between gap-4 border-b border-[#1C2333] pb-6">
                <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                        <Link href="/dashboard" className="transition-colors hover:text-slate-300">
                            Dashboard
                        </Link>
                        <span>/</span>
                        <span className="text-slate-300">Campanhas</span>
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Minhas campanhas</h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
                            Gerencie, acompanhe e prepare a automação de envios de currículos que futuramente controlará o RPA no desktop.
                        </p>
                    </div>
                </div>

                <Link
                    href="/campanhas/nova"
                    className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-[#2563EB] px-5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.28)] transition hover:bg-[#1d4ed8]"
                >
                    <Plus size={17} />
                    Nova campanha
                </Link>
            </div>

            <div className="rounded-2xl border border-[#1C2333] bg-[#131B2A] p-3 sm:p-4">
                <div className="flex flex-col gap-3 lg:flex-row">
                    <label className="group flex h-12 flex-1 items-center gap-3 rounded-xl border border-[#2A3445] bg-[#101826] px-4 transition-colors focus-within:border-[#35507E]">
                        <Search size={17} className="text-slate-500 transition-colors group-focus-within:text-slate-300" />
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Buscar campanhas..."
                            className="h-full w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                        />
                    </label>

                    <div className="grid gap-3 sm:grid-cols-2 lg:w-auto">
                        <div className="relative">
                            <select
                                value={selectedPlatform}
                                onChange={(event) => setSelectedPlatform(event.target.value as (typeof platformOptions)[number]["value"])}
                                className="h-12 w-full appearance-none rounded-xl border border-[#2A3445] bg-[#101826] px-4 pr-10 text-sm text-slate-200 outline-none transition focus:border-[#35507E]"
                            >
                                {platformOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        </div>

                        <div className="relative">
                            <select
                                value={selectedStatus}
                                onChange={(event) => setSelectedStatus(event.target.value as (typeof statusOptions)[number]["value"])}
                                className="h-12 w-full appearance-none rounded-xl border border-[#2A3445] bg-[#101826] px-4 pr-10 text-sm text-slate-200 outline-none transition focus:border-[#35507E]"
                            >
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {filteredCampaigns.length > 0 ? (
                    filteredCampaigns.map((campaign) => (
                        <CampaignCard
                            key={campaign.id}
                            campaign={campaign}
                            onEdit={setEditingCampaign}
                            onView={setActiveCampaign}
                        />
                    ))
                ) : (
                    <div className="rounded-2xl border border-dashed border-[#2A3445] bg-[#131B2A] px-6 py-14 text-center">
                        <p className="text-lg font-semibold text-white">Nenhuma campanha encontrada</p>
                        <p className="mt-2 text-sm text-slate-400">
                            Ajuste a busca ou os filtros para visualizar outras campanhas mocadas.
                        </p>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-3 border-t border-[#1C2333] pt-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <p>
                    Exibindo {filteredCampaigns.length} de {campaignsMock.length} campanhas
                </p>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                        type="button"
                        className="inline-flex h-10 items-center rounded-xl border border-[#273247] px-4 text-slate-600 transition hover:border-[#31415c] hover:text-slate-300"
                    >
                        Anterior
                    </button>
                    <button
                        type="button"
                        className="inline-flex h-10 items-center rounded-xl border border-[#273247] px-4 text-slate-300 transition hover:border-[#31415c] hover:bg-[#131B2A]"
                    >
                        Próxima
                    </button>
                </div>
            </div>

            {activeCampaign ? (
                <CampaignDetailsModal
                    campaign={activeCampaign}
                    onClose={() => setActiveCampaign(null)}
                />
            ) : null}

            {editingCampaign ? (
                <CampaignEditModal
                    campaign={editingCampaign}
                    onClose={() => setEditingCampaign(null)}
                />
            ) : null}
        </section>
    );
}
