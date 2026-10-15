"use client";

import Link from "next/link";
import { Download, Eye, FileText, Pencil, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "../../lib/date";
import { getResumeMeta } from "../../lib/helpers/resume";
import { downloadResumePdf } from "../../lib/resume-pdf";
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
        <article className="flex min-h-[220px] overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-line-strong">
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
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line-strong bg-raised text-fg transition-colors hover:border-line-strong hover:bg-overlay"
                            >
                                <Eye size={17} />
                            </Link>
                            <button
                                type="button"
                                onClick={() => onDelete(resume)}
                                aria-label={`Excluir ${resume.title}`}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-200 transition-colors hover:border-rose-500 hover:bg-rose-600 hover:text-fg"
                            >
                                <Trash2 size={17} />
                            </button>
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold text-fg">{resume.title}</h2>
                    <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-400">
                        <span className="font-medium text-sky-300">{meta.role}</span>
                        <span className="text-slate-600">•</span>
                        <span>{meta.location}</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-500">
                        Editado {formatDistanceToNow(resume.createdAt)}
                    </p>
                </div>

                <div className="mt-6 flex items-center gap-3">
                    <Link
                        href={`/curriculos/${resume.id}`}
                        className="inline-flex h-11 items-center gap-2 rounded-xl border border-blue-400/30 bg-blue-500/15 px-4 text-sm font-semibold text-blue-300 transition hover:border-blue-500 hover:bg-blue-600 hover:text-fg"
                    >
                        <Pencil size={15} />
                        Editar currículo
                    </Link>
                    <button
                        type="button"
                        onClick={() => downloadResumePdf(resume)}
                        className="inline-flex h-11 items-center gap-2 rounded-xl border border-line-strong bg-raised px-4 text-sm font-semibold text-fg transition hover:border-line-strong hover:bg-overlay"
                    >
                        <Download size={15} />
                        Baixar PDF
                    </button>
                </div>
            </div>

            <div className="hidden w-44 shrink-0 border-l border-line bg-[radial-gradient(circle_at_top,rgb(var(--c-accent-soft)),transparent_55%)] bg-sunken lg:flex lg:items-center lg:justify-center">
                <div className="rounded-2xl border border-line-strong bg-sunken/80 px-5 py-6 text-center">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Currículo
                    </p>
                    <FileText className="mx-auto mt-3 h-12 w-12 text-slate-600" />
                </div>
            </div>
        </article>
    );
}
