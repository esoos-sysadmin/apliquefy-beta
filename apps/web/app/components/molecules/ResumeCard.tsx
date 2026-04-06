"use client";

import Link from "next/link";
import { Eye, FileText, Pencil, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "../../lib/date";
import { getResumeMeta } from "../../lib/helpers/resume";
import type { Resume } from "../../types/resume";

export function ResumeCard({
    resume,
    onDelete,
}: {
    resume: Resume;
    onDelete: (resume: Resume) => void;
}) {
    const meta = getResumeMeta(resume);
    const isSynced = meta.status === "synced";

    return (
        <article className="flex min-h-[220px] overflow-hidden rounded-2xl border border-[#1C2333] bg-[#131B2A] transition-colors hover:border-[#283349]">
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

                        <div className="flex items-center gap-2">
                            <Link
                                href={`/curriculos/${resume.id}`}
                                aria-label={`Preview ${resume.title}`}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-slate-400 transition-colors hover:border-[#263149] hover:bg-[#182233] hover:text-white"
                            >
                                <Eye size={17} />
                            </Link>
                            <button
                                type="button"
                                onClick={() => onDelete(resume)}
                                aria-label={`Excluir ${resume.title}`}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-slate-400 transition-colors hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-200"
                            >
                                <Trash2 size={17} />
                            </button>
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold text-white">{resume.title}</h2>
                    <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-400">
                        <span className="font-medium text-sky-300">{meta.role}</span>
                        <span className="text-slate-600">•</span>
                        <span>{meta.location}</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-500">
                        Last edited: {formatDistanceToNow(resume.createdAt)}
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
                    <FileText className="mx-auto mt-3 h-12 w-12 text-slate-600" />
                </div>
            </div>
        </article>
    );
}
