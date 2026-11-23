"use client";

import { useState } from "react";
import Link from "next/link";
import { FlaskConical, Megaphone, Plus, Search } from "lucide-react";
import { SelectField } from "../../components/atoms/SelectField";
import { ConfirmDialog } from "../../components/molecules/ConfirmDialog";
import { CampaignCard } from "../../components/molecules/CampaignCard";
import { CampaignCardSkeleton } from "../../components/molecules/CampaignCardSkeleton";
import { CampaignDetailsModal } from "../../components/organisms/CampaignDetailsModal";
import { CampaignParamsModal } from "../../components/organisms/CampaignParamsModal";
import { CampaignEditModal } from "../../components/organisms/CampaignEditModal";
import { AbTestCard } from "../../components/molecules/AbTestCard";
import { AbTestDetailModal } from "../../components/organisms/AbTestDetailModal";
import { useCampaigns } from "../../hooks/use-campaigns";
import { useAbTests } from "../../hooks/use-ab-tests";
import { AB_TESTS_ENABLED } from "../../lib/constants/features";
import type { Campaign } from "../../types/campaign";
import type { AbTest } from "../../types/ab-test";

const statusOptions = [
    { label: "Todos os status", value: "all" },
    { label: "Em execução", value: "active" },
    { label: "Pausadas", value: "paused" },
    { label: "Inativas", value: "inactive" },
] as const;

const platformOptions = [
    { label: "Todas as plataformas", value: "all" },
    { label: "LinkedIn", value: "linkedin" },
    { label: "InfoJobs", value: "infojobs" },
    { label: "Nuvem", value: "ats" },
] as const;

export default function CampaignsPage() {
    const [tab, setTab] = useState<"campaigns" | "ab">(
        AB_TESTS_ENABLED && typeof window !== "undefined" && new URLSearchParams(window.location.search).get("tab") === "ab" ? "ab" : "campaigns",
    );
    const [search, setSearch] = useState("");
    const [selectedPlatform, setSelectedPlatform] = useState<(typeof platformOptions)[number]["value"]>("all");
    const [selectedStatus, setSelectedStatus] = useState<(typeof statusOptions)[number]["value"]>("all");
    const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
    const [detailsCampaign, setDetailsCampaign] = useState<Campaign | null>(null);
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
    const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [page, setPage] = useState(1);
    const { campaigns, isLoading, error, refetch, deleteCampaign, activateCampaign, pauseCampaign } = useCampaigns();
    const [togglingId, setTogglingId] = useState<string | null>(null);

    async function handleToggle(campaign: Campaign) {
        setTogglingId(campaign.id);
        try {
            // o hook já mostra o erro do service em toast e desfaz o status otimista
            await (campaign.status === "active" ? pauseCampaign(campaign.id) : activateCampaign(campaign.id));
        } catch {
        } finally {
            setTogglingId(null);
        }
    }

    // Testes A/B
    const [abSearch, setAbSearch] = useState("");
    const [activeAbTest, setActiveAbTest] = useState<AbTest | null>(null);
    const [abTestToDelete, setAbTestToDelete] = useState<AbTest | null>(null);
    const [isDeletingAb, setIsDeletingAb] = useState(false);
    const { abTests, isLoading: isLoadingAb, deleteAbTest } = useAbTests();
    const filteredAbTests = abTests.filter((t) => t.name.toLowerCase().includes(abSearch.toLowerCase().trim()));

    // Variantes de teste A/B são Campaigns reais, mas pertencem à aba Testes A/B — não entram na aba Campanhas.
    // Com A/B oculto, as variantes já existentes voltam a aparecer como campanhas comuns.
    const abVariantIds = new Set(AB_TESTS_ENABLED ? abTests.flatMap((t) => [t.variantA.id, t.variantB.id]) : []);

    const filteredCampaigns = campaigns.filter((campaign) => {
        if (abVariantIds.has(campaign.id)) return false;
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

    async function handleDeleteAbTest() {
        if (!abTestToDelete) return;
        setIsDeletingAb(true);
        try {
            await deleteAbTest(abTestToDelete.id);
            setAbTestToDelete(null);
        } finally {
            setIsDeletingAb(false);
        }
    }

    return (
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-4 text-fg sm:gap-6">
            <div className="flex flex-col gap-4 border-b border-line pb-4 sm:pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3">
                    <div className="hidden flex-wrap items-center gap-2 text-sm text-slate-500 sm:flex">
                        <Link href="/relatorios" className="transition-colors hover:text-slate-300">Relatórios</Link>
                        <span>/</span>
                        <span className="text-slate-300">Campanhas</span>
                    </div>

                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-fg sm:text-4xl">Minhas campanhas</h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
                            Gerencie e acompanhe suas campanhas: pela nuvem, em sites de empresas, ou pelo app desktop, no LinkedIn e InfoJobs.
                        </p>
                    </div>
                </div>

                <Link
                    href={tab === "ab" ? "/campanhas/nova?ab=1" : "/campanhas/nova"}
                    className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-accent px-5 sm:w-auto text-sm font-semibold text-white shadow-[0_10px_30px_rgba(122,59,255,0.28)] transition hover:bg-accent-hover"
                >
                    <Plus size={17} />
                    {tab === "ab" ? "Novo teste A/B" : "Nova campanha"}
                </Link>
            </div>

            {AB_TESTS_ENABLED && (
            <div className="flex gap-2 border-b border-line pb-1">
                <button
                    type="button"
                    onClick={() => setTab("campaigns")}
                    className={`inline-flex min-h-[44px] items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
                        tab === "campaigns" ? "border-accent text-fg" : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                >
                    <Megaphone size={16} /> Campanhas
                </button>
                <button
                    type="button"
                    onClick={() => setTab("ab")}
                    className={`inline-flex min-h-[44px] items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
                        tab === "ab" ? "border-accent text-fg" : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                >
                    <FlaskConical size={16} /> Testes A/B
                </button>
            </div>
            )}

            {tab === "campaigns" ? (
            <>
            <div className="sm:rounded-2xl sm:border sm:border-line sm:bg-surface sm:p-4">
                <div className="flex flex-col gap-3 lg:flex-row">
                    <label className="group flex h-12 flex-1 items-center gap-3 rounded-xl border border-line-strong bg-sunken px-4 transition-colors focus-within:border-accent/50">
                        <Search size={17} className="text-slate-500 transition-colors group-focus-within:text-slate-300" />
                        <input
                            value={search}
                            onChange={(event) => {
                                setSearch(event.target.value);
                                setPage(1);
                            }}
                            placeholder="Buscar campanhas..."
                            className="h-full w-full bg-transparent text-sm text-fg outline-none placeholder:text-slate-500"
                        />
                    </label>

                    <div className="grid gap-3 sm:grid-cols-2 lg:w-auto">
                        <SelectField
                            value={selectedPlatform}
                            onChange={(value) => {
                                setSelectedPlatform(value);
                                setPage(1);
                            }}
                            options={platformOptions}
                            clearable={false}
                        />

                        <SelectField
                            value={selectedStatus}
                            onChange={(value) => {
                                setSelectedStatus(value);
                                setPage(1);
                            }}
                            options={statusOptions}
                            clearable={false}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, index) => <CampaignCardSkeleton key={index} />)
                ) : error ? (
                    <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-6 py-10 text-center">
                        <p className="text-lg font-semibold text-fg">Não foi possível carregar as campanhas</p>
                        <p className="mt-2 text-sm text-slate-300">Verifique sua conexão e tente novamente.</p>
                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-accent px-5 text-sm font-semibold text-white transition hover:bg-accent-hover"
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
                            onOpenDetails={setDetailsCampaign}
                            onDelete={setCampaignToDelete}
                            onToggle={handleToggle}
                            toggling={togglingId === campaign.id}
                        />
                    ))
                ) : campaigns.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
                        <p className="text-lg font-semibold text-fg">Nenhuma campanha criada.</p>
                        <p className="mt-2 text-sm text-slate-400">
                            Configure sua primeira automação!
                        </p>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
                        <p className="text-lg font-semibold text-fg">Nenhuma campanha encontrada</p>
                        <p className="mt-2 text-sm text-slate-400">
                            Ajuste a busca ou os filtros para visualizar outras campanhas.
                        </p>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-3 border-t border-line pt-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <p>
                    Exibindo {visibleCampaigns.length} de {filteredCampaigns.length} campanhas
                </p>

                <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:self-auto">
                    <button
                        type="button"
                        onClick={() => setPage((current) => Math.max(1, current - 1))}
                        disabled={currentPage === 1}
                        className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-xl border border-line-strong px-4 text-slate-300 transition hover:border-line-strong hover:bg-surface disabled:cursor-not-allowed disabled:text-slate-700"
                    >
                        Anterior
                    </button>
                    <button
                        type="button"
                        onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                        disabled={currentPage === totalPages}
                        className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-xl border border-line-strong px-4 text-slate-300 transition hover:border-line-strong hover:bg-surface disabled:cursor-not-allowed disabled:text-slate-700"
                    >
                        Próxima
                    </button>
                </div>
            </div>
            </>
            ) : (
            <>
            <div className="sm:rounded-2xl sm:border sm:border-line sm:bg-surface sm:p-4">
                <label className="group flex h-12 items-center gap-3 rounded-xl border border-line-strong bg-sunken px-4 transition-colors focus-within:border-accent/50">
                    <Search size={17} className="text-slate-500 transition-colors group-focus-within:text-slate-300" />
                    <input
                        value={abSearch}
                        onChange={(event) => setAbSearch(event.target.value)}
                        placeholder="Buscar testes A/B..."
                        className="h-full w-full bg-transparent text-sm text-fg outline-none placeholder:text-slate-500"
                    />
                </label>
            </div>

            <div className="space-y-4">
                {isLoadingAb ? (
                    <CampaignCardSkeleton />
                ) : filteredAbTests.length > 0 ? (
                    filteredAbTests.map((abTest) => (
                        <AbTestCard key={abTest.id} abTest={abTest} onView={setActiveAbTest} onDelete={setAbTestToDelete} />
                    ))
                ) : abTests.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
                        <p className="text-lg font-semibold text-fg">Nenhum teste A/B criado.</p>
                        <p className="mt-2 text-sm text-slate-400">
                            Crie uma campanha e ative a opção <span className="text-slate-200">Teste A/B</span> para comparar dois currículos.
                        </p>
                        <Link
                            href="/campanhas/nova?ab=1"
                            className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-accent px-5 text-sm font-semibold text-white transition hover:bg-accent-hover"
                        >
                            Criar teste A/B
                        </Link>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
                        <p className="text-lg font-semibold text-fg">Nenhum teste A/B encontrado</p>
                        <p className="mt-2 text-sm text-slate-400">Ajuste a busca para visualizar outros testes.</p>
                    </div>
                )}
            </div>
            </>
            )}

            {activeAbTest ? (
                <AbTestDetailModal abTestId={activeAbTest.id} onClose={() => setActiveAbTest(null)} />
            ) : null}

            <ConfirmDialog
                open={Boolean(abTestToDelete)}
                title="Excluir teste A/B"
                description="As duas campanhas variantes, candidaturas e relatórios vinculados serão removidos."
                confirmLabel="Excluir teste"
                danger
                loading={isDeletingAb}
                onCancel={() => setAbTestToDelete(null)}
                onConfirm={handleDeleteAbTest}
            />

            {activeCampaign ? (
                <CampaignDetailsModal
                    campaign={activeCampaign}
                    onClose={() => setActiveCampaign(null)}
                />
            ) : null}

            {detailsCampaign ? (
                <CampaignParamsModal
                    campaign={detailsCampaign}
                    onClose={() => setDetailsCampaign(null)}
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
