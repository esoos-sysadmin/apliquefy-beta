"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Search, Sparkles, Upload } from "lucide-react";
import { SelectField } from "../../components/atoms/SelectField";
import { RESUME_IMPORT_STORAGE_KEY } from "../../lib/constants/resume-form";
import { ConfirmDialog } from "../../components/molecules/ConfirmDialog";
import { ResumeCard } from "../../components/molecules/ResumeCard";
import { ResumeCardSkeleton } from "../../components/molecules/ResumeCardSkeleton";
import { useCampaigns } from "../../hooks/use-campaigns";
import { useResumes } from "../../hooks/use-resumes";
import type { Resume } from "../../types/resume";

export default function ResumesPage() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<"newest" | "oldest" | "alpha">("newest");
    const [resumeToDelete, setResumeToDelete] = useState<Resume | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { resumes, isLoading, error, refetch, deleteResume, importResumePdf } = useResumes();
    const { campaigns, refetch: refetchCampaigns } = useCampaigns();

    // usadas no aviso de exclusão: são as campanhas que o delete vai desativar
    const linkedCampaigns = resumeToDelete
        ? campaigns.filter((campaign) => campaign.resumeId === resumeToDelete.id)
        : [];

    async function handleImportPdf(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        // limpa o input antes de qualquer await: sem isso, reenviar o mesmo arquivo
        // depois de um erro não dispara onChange de novo
        event.target.value = "";
        if (!file) return;

        setIsImporting(true);
        try {
            const form = await importResumePdf(file);
            // handoff pro formulário sem passar o objeto inteiro pela URL
            sessionStorage.setItem(RESUME_IMPORT_STORAGE_KEY, JSON.stringify(form));
            router.push("/curriculos/novo");
            // sem setIsImporting(false) aqui de propósito: o push é assíncrono e
            // desligar o overlay agora devolveria esta página piscando antes da troca.
            // Quem desmonta este componente é a navegação.
        } catch {
            // handleClientError no hook já exibiu o toast
            setIsImporting(false);
        }
    }

    const filteredResumes = [...resumes]
        .filter((resume) => {
            const query = search.toLowerCase().trim();
            return (
                resume.title.toLowerCase().includes(query) ||
                (resume.personalInfo?.jobTitle ?? "").toLowerCase().includes(query) ||
                (resume.personalInfo?.location ?? resume.personalInfo?.address ?? "").toLowerCase().includes(query)
            );
        })
        .sort((a, b) => {
            if (sort === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            if (sort === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            return a.title.localeCompare(b.title);
        });

    async function handleDeleteResume() {
        if (!resumeToDelete) return;

        setIsDeleting(true);

        try {
            await deleteResume(resumeToDelete.id);
            // o delete desativa as campanhas vinculadas; sem isto a lista de campanhas
            // fica em cache mostrando "ativa" para uma campanha sem currículo
            await refetchCampaigns();
            setResumeToDelete(null);
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 text-white">
            {isImporting && (
                <div
                    role="status"
                    aria-live="polite"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1120]/85 px-6 backdrop-blur-sm"
                >
                    <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border border-[#1C2333] bg-[#131B2A] px-8 py-10 text-center">
                        <Loader2 size={34} className="animate-spin text-sky-400" />
                        <div>
                            <p className="text-lg font-semibold text-white">Lendo seu currículo...</p>
                            <p className="mt-2 text-sm text-slate-400">
                                A IA está extraindo os dados do PDF. Isso leva alguns segundos — não feche esta aba.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-4 border-b border-[#1C2333] pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                        <Link href="/relatorios" className="transition-colors hover:text-slate-300">Relatórios</Link>
                        <span>/</span>
                        <span className="text-slate-300">Currículos</span>
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Meus currículos</h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
                            Consulte, organize e atualize os currículos que você usa nas campanhas de automação.
                        </p>
                    </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-3">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={handleImportPdf}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isImporting}
                        className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#2A3445] bg-[#131B2A] px-5 text-sm font-semibold text-slate-200 transition hover:border-[#35507E] hover:bg-[#182236] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Upload size={17} />
                        {isImporting ? "Lendo PDF..." : "Importar PDF"}
                    </button>
                    <Link
                        href="/curriculos/analisar"
                        className="inline-flex h-11 items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-5 text-sm font-semibold text-sky-300 transition hover:border-sky-400/40 hover:bg-sky-500/15"
                    >
                        <Sparkles size={17} />
                        Analisar com IA
                    </Link>
                    <Link
                        href="/curriculos/novo"
                        className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#2563EB] px-5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.28)] transition hover:bg-[#1d4ed8]"
                    >
                        <Plus size={17} />
                        Novo currículo
                    </Link>
                </div>
            </div>

            <div className="rounded-2xl border border-[#1C2333] bg-[#131B2A] p-3 sm:p-4">
                <div className="flex flex-col gap-3 lg:flex-row">
                    <label className="group flex h-12 flex-1 items-center gap-3 rounded-xl border border-[#2A3445] bg-[#101826] px-4 transition-colors focus-within:border-[#35507E]">
                        <Search size={17} className="text-slate-500 transition-colors group-focus-within:text-slate-300" />
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Buscar currículos..."
                            className="h-full w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                        />
                    </label>

                    <div className="relative lg:w-64">
                        <SelectField
                            value={sort}
                            onChange={setSort}
                            options={[
                                { label: "Editado por último: mais recente", value: "newest" },
                                { label: "Editado por último: mais antigo", value: "oldest" },
                                { label: "Ordem alfabética", value: "alpha" },
                            ] as const}
                            clearable={false}
                        />
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="grid gap-4 xl:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <ResumeCardSkeleton key={index} />
                    ))}
                </div>
            ) : error ? (
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-6 py-10 text-center">
                    <p className="text-lg font-semibold text-white">Não foi possível carregar os currículos</p>
                    <p className="mt-2 text-sm text-slate-300">Verifique sua conexão e tente novamente.</p>
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-[#2563EB] px-5 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
                    >
                        Tentar novamente
                    </button>
                </div>
            ) : filteredResumes.length > 0 ? (
                <div className="grid gap-4 xl:grid-cols-2">
                    {filteredResumes.map((resume) => (
                        <ResumeCard key={resume.id} resume={resume} onDelete={setResumeToDelete} />
                    ))}
                </div>
            ) : resumes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#2A3445] bg-[#131B2A] px-6 py-14 text-center">
                    <p className="text-lg font-semibold text-white">Nenhum currículo ainda.</p>
                    <p className="mt-2 text-sm text-slate-400">Crie seu primeiro currículo para começar!</p>
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-[#2A3445] bg-[#131B2A] px-6 py-14 text-center">
                    <p className="text-lg font-semibold text-white">Nenhum currículo encontrado</p>
                    <p className="mt-2 text-sm text-slate-400">
                        Tente outra busca ou crie um novo currículo para começar.
                    </p>
                </div>
            )}

            <div className="border-t border-[#1C2333] pt-5 text-sm text-slate-500">
                Exibindo {filteredResumes.length} de {resumes.length} currículos
            </div>

            <ConfirmDialog
                open={Boolean(resumeToDelete)}
                title="Excluir currículo"
                description={
                    linkedCampaigns.length ? (
                        <>
                            <p>
                                Este currículo está sendo usado por {linkedCampaigns.length} campanha(s), que serão
                                <strong className="text-slate-200"> desativadas</strong> ao excluí-lo:
                            </p>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
                                {linkedCampaigns.map((campaign) => (
                                    <li key={campaign.id}>{campaign.name}</li>
                                ))}
                            </ul>
                            <p className="mt-3">
                                Elas só poderão ser ativadas de novo depois que você{" "}
                                <Link href="/campanhas" className="text-sky-400 underline">
                                    editar cada campanha
                                </Link>{" "}
                                e selecionar outro currículo. Esta ação não pode ser desfeita.
                            </p>
                        </>
                    ) : (
                        "Tem certeza? Esta ação não pode ser desfeita."
                    )
                }
                confirmLabel="Excluir currículo"
                danger
                loading={isDeleting}
                onCancel={() => setResumeToDelete(null)}
                onConfirm={handleDeleteResume}
            />
        </section>
    );
}
