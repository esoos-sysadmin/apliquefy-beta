"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Plus, Search, Sparkles } from "lucide-react";
import { ConfirmDialog } from "../../components/molecules/ConfirmDialog";
import { ResumeCard } from "../../components/molecules/ResumeCard";
import { ResumeCardSkeleton } from "../../components/molecules/ResumeCardSkeleton";
import { useResumes } from "../../hooks/use-resumes";
import type { Resume } from "../../types/resume";

export default function ResumesPage() {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<"newest" | "oldest" | "alpha">("newest");
    const [resumeToDelete, setResumeToDelete] = useState<Resume | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { resumes, isLoading, error, refetch, deleteResume } = useResumes();

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
            setResumeToDelete(null);
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 text-white">
            <div className="flex flex-col gap-4 border-b border-[#1C2333] pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                        <Link href="/relatorios" className="transition-colors hover:text-slate-300">Relatórios</Link>
                        <span>/</span>
                        <span className="text-slate-300">Resumes</span>
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">My Resumes</h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
                            Browse, organize, and update the resumes you use across automation campaigns.
                        </p>
                    </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-3">
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
                        New Resume
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
                            placeholder="Search resumes..."
                            className="h-full w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                        />
                    </label>

                    <div className="relative lg:w-64">
                        <select
                            value={sort}
                            onChange={(event) => setSort(event.target.value as "newest" | "oldest" | "alpha")}
                            className="h-12 w-full appearance-none rounded-xl border border-[#2A3445] bg-[#101826] px-4 pr-10 text-sm text-slate-200 outline-none transition focus:border-[#35507E]"
                        >
                            <option value="newest">Last edited: Newest</option>
                            <option value="oldest">Last edited: Oldest</option>
                            <option value="alpha">Alphabetical</option>
                        </select>
                        <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
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
                    <p className="text-lg font-semibold text-white">No resumes found</p>
                    <p className="mt-2 text-sm text-slate-400">
                        Try a different search or create a new resume to get started.
                    </p>
                </div>
            )}

            <div className="border-t border-[#1C2333] pt-5 text-sm text-slate-500">
                Displaying {filteredResumes.length} of {resumes.length} resumes
            </div>

            <ConfirmDialog
                open={Boolean(resumeToDelete)}
                title="Excluir currículo"
                description="Tem certeza? Campanhas vinculadas perderão o currículo."
                confirmLabel="Excluir currículo"
                danger
                loading={isDeleting}
                onCancel={() => setResumeToDelete(null)}
                onConfirm={handleDeleteResume}
            />
        </section>
    );
}
