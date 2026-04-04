"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Eye, Pencil, Plus, Search } from "lucide-react";

type Resume = {
    id: string;
    title: string;
    updatedAt: string;
    status: "synced" | "draft";
    role: string;
    location: string;
};

const resumesMock: Resume[] = [
    {
        id: "resume-1",
        title: "Senior Frontend Resume",
        updatedAt: "2026-04-04T09:30:00.000Z",
        status: "synced",
        role: "Frontend Engineer",
        location: "Remote",
    },
    {
        id: "resume-2",
        title: "Product Engineer Resume",
        updatedAt: "2026-04-03T18:15:00.000Z",
        status: "synced",
        role: "Product Engineer",
        location: "Sao Paulo, BR",
    },
    {
        id: "resume-3",
        title: "Fullstack Europe Resume",
        updatedAt: "2026-04-01T14:00:00.000Z",
        status: "draft",
        role: "Fullstack Developer",
        location: "Europe",
    },
    {
        id: "resume-4",
        title: "Marketing Ops Resume",
        updatedAt: "2026-03-29T11:20:00.000Z",
        status: "synced",
        role: "Marketing Operations",
        location: "Rio de Janeiro, BR",
    },
];

function timeAgo(date: string): string {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    return `${weeks}w ago`;
}

export default function ResumesPage() {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<"newest" | "oldest" | "alpha">("newest");

    const filteredResumes = resumesMock
        .filter((resume) => {
            const query = search.toLowerCase().trim();
            return (
                resume.title.toLowerCase().includes(query) ||
                resume.role.toLowerCase().includes(query) ||
                resume.location.toLowerCase().includes(query)
            );
        })
        .sort((a, b) => {
            if (sort === "newest") {
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            }
            if (sort === "oldest") {
                return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
            }
            return a.title.localeCompare(b.title);
        });

    return (
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 text-white">
            <div className="flex flex-col gap-4 border-b border-[#1C2333] pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                        <Link href="/dashboard" className="transition-colors hover:text-slate-300">
                            Dashboard
                        </Link>
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

                <Link
                    href="/curriculos/novo"
                    className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-[#2563EB] px-5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.28)] transition hover:bg-[#1d4ed8]"
                >
                    <Plus size={17} />
                    New Resume
                </Link>
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

            {filteredResumes.length > 0 ? (
                <div className="grid gap-4 xl:grid-cols-2">
                    {filteredResumes.map((resume) => {
                        const isSynced = resume.status === "synced";

                        return (
                            <article
                                key={resume.id}
                                className="flex min-h-[220px] overflow-hidden rounded-2xl border border-[#1C2333] bg-[#131B2A] transition-colors hover:border-[#283349]"
                            >
                                <div className="flex flex-1 flex-col justify-between p-6">
                                    <div>
                                        <div className="mb-5 flex items-start justify-between gap-4">
                                            <span
                                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                                    isSynced
                                                        ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                                                        : "border border-amber-500/20 bg-amber-500/10 text-amber-300"
                                                }`}
                                            >
                                                {isSynced ? "Synced" : "Draft"}
                                            </span>

                                            <button
                                                type="button"
                                                aria-label={`Preview ${resume.title}`}
                                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-slate-400 transition-colors hover:border-[#263149] hover:bg-[#182233] hover:text-white"
                                            >
                                                <Eye size={17} />
                                            </button>
                                        </div>

                                        <h2 className="text-xl font-semibold text-white">{resume.title}</h2>
                                        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-400">
                                            <span className="font-medium text-sky-300">{resume.role}</span>
                                            <span className="text-slate-600">•</span>
                                            <span>{resume.location}</span>
                                        </div>
                                        <p className="mt-3 text-sm text-slate-500">
                                            Last edited: {timeAgo(resume.updatedAt)}
                                        </p>
                                    </div>

                                    <div className="mt-6 flex items-center gap-3">
                                        <Link
                                            href={`/curriculos/${resume.id}`}
                                            className="inline-flex h-11 items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 text-sm font-semibold text-blue-300 transition hover:border-blue-400/30 hover:bg-blue-500/15"
                                        >
                                            <Pencil size={15} />
                                            Edit Resume
                                        </Link>
                                    </div>
                                </div>

                                <div className="hidden w-44 shrink-0 border-l border-[#1C2333] bg-[radial-gradient(circle_at_top,#1d2a42,transparent_55%),linear-gradient(180deg,#172132_0%,#111827_100%)] lg:flex lg:items-center lg:justify-center">
                                    <div className="rounded-2xl border border-[#2A3445] bg-[#101826]/80 px-5 py-6 text-center">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                            Resume
                                        </p>
                                        <p className="mt-3 text-5xl font-light text-slate-700">≡</p>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
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
                Displaying {filteredResumes.length} of {resumesMock.length} resumes
            </div>
        </section>
    );
}
