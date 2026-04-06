"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Plus, Search } from "lucide-react";
import { ConfirmDialog } from "../../components/molecules/ConfirmDialog";
import { CampaignCard } from "../../components/molecules/CampaignCard";
import { CampaignCardSkeleton } from "../../components/molecules/CampaignCardSkeleton";
import { CampaignDetailsModal } from "../../components/organisms/CampaignDetailsModal";
import { CampaignEditModal } from "../../components/organisms/CampaignEditModal";
import { useCampaigns } from "../../hooks/use-campaigns";
import type { Campaign } from "../../types/campaign";

const statusOptions = [
    { label: "Todos os status", value: "all" },
    { label: "Running", value: "active" },
    { label: "Paused", value: "paused" },
    { label: "Inactive", value: "inactive" },
] as const;

const platformOptions = [
    { label: "Todas as plataformas", value: "all" },
    { label: "LinkedIn", value: "linkedin" },
    { label: "InfoJobs", value: "infojobs" },
] as const;

export default function CampaignsPage() {
    const [search, setSearch] = useState("");
    const [selectedPlatform, setSelectedPlatform] = useState<(typeof platformOptions)[number]["value"]>("all");
    const [selectedStatus, setSelectedStatus] = useState<(typeof statusOptions)[number]["value"]>("all");
    const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
    const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [page, setPage] = useState(1);
    const { campaigns, isLoading, error, refetch, deleteCampaign } = useCampaigns();

    const filteredCampaigns = campaigns.filter((campaign) => {
        const matchesSearch = campaign.name.toLowerCase().includes(search.toLowerCase().trim());
        const matchesPlatform = selectedPlatform === "all" || campaign.platform === selectedPlatform;
        const matchesStatus = selectedStatus === "all" || campaign.status === selectedStatus;

        return matchesSearch && matchesPlatform && matchesStatus;
    });

    const pageSize = 4;
    const totalPages = Math.max(1, Math.ceil(filteredCampaigns.length / pageSize));
    const currentPage = Math.min(page, totalPages);
    const visibleCampaigns = filteredCampaigns.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    async function handleDeleteCampaign() {
        if (!campaignToDelete) {
            return;
        }

        setIsDeleting(true);

        try {
            await deleteCampaign(campaignToDelete.id);
            setCampaignToDelete(null);
        } finally {
            setIsDeleting(false);
        }
    }

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
                            onChange={(event) => {
                                setSearch(event.target.value);
                                setPage(1);
                            }}
                            placeholder="Buscar campanhas..."
                            className="h-full w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                        />
                    </label>

                    <div className="grid gap-3 sm:grid-cols-2 lg:w-auto">
                        <div className="relative">
                            <select
                                value={selectedPlatform}
                                onChange={(event) => {
                                    setSelectedPlatform(event.target.value as (typeof platformOptions)[number]["value"]);
                                    setPage(1);
                                }}
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
                                onChange={(event) => {
                                    setSelectedStatus(event.target.value as (typeof statusOptions)[number]["value"]);
                                    setPage(1);
                                }}
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
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, index) => <CampaignCardSkeleton key={index} />)
                ) : error ? (
                    <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-6 py-10 text-center">
                        <p className="text-lg font-semibold text-white">Não foi possível carregar as campanhas</p>
                        <p className="mt-2 text-sm text-slate-300">Verifique sua conexão e tente novamente.</p>
                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-[#2563EB] px-5 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
                        >
                            Tentar novamente
                        </button>
                    </div>
                ) : visibleCampaigns.length > 0 ? (
                    visibleCampaigns.map((campaign) => (
                        <CampaignCard
                            key={campaign.id}
                            campaign={campaign}
                            onEdit={setEditingCampaign}
                            onView={setActiveCampaign}
                            onDelete={setCampaignToDelete}
                        />
                    ))
                ) : campaigns.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#2A3445] bg-[#131B2A] px-6 py-14 text-center">
                        <p className="text-lg font-semibold text-white">Nenhuma campanha criada.</p>
                        <p className="mt-2 text-sm text-slate-400">
                            Configure sua primeira automação!
                        </p>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-[#2A3445] bg-[#131B2A] px-6 py-14 text-center">
                        <p className="text-lg font-semibold text-white">Nenhuma campanha encontrada</p>
                        <p className="mt-2 text-sm text-slate-400">
                            Ajuste a busca ou os filtros para visualizar outras campanhas.
                        </p>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-3 border-t border-[#1C2333] pt-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <p>
                    Exibindo {visibleCampaigns.length} de {filteredCampaigns.length} campanhas
                </p>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                        type="button"
                        onClick={() => setPage((current) => Math.max(1, current - 1))}
                        disabled={currentPage === 1}
                        className="inline-flex h-10 items-center rounded-xl border border-[#273247] px-4 text-slate-300 transition hover:border-[#31415c] hover:bg-[#131B2A] disabled:cursor-not-allowed disabled:text-slate-700"
                    >
                        Anterior
                    </button>
                    <button
                        type="button"
                        onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                        disabled={currentPage === totalPages}
                        className="inline-flex h-10 items-center rounded-xl border border-[#273247] px-4 text-slate-300 transition hover:border-[#31415c] hover:bg-[#131B2A] disabled:cursor-not-allowed disabled:text-slate-700"
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

            <ConfirmDialog
                open={Boolean(campaignToDelete)}
                title="Excluir campanha"
                description="Tem certeza? Jobs e relatórios vinculados serão removidos."
                confirmLabel="Excluir campanha"
                danger
                loading={isDeleting}
                onCancel={() => setCampaignToDelete(null)}
                onConfirm={handleDeleteCampaign}
            />
        </section>
    );
}
