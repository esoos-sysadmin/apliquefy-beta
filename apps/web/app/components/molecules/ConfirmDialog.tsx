"use client";

import { AlertTriangle, X } from "lucide-react";
import type { ReactNode } from "react";

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    description: ReactNode;
    confirmLabel: string;
    cancelLabel?: string;
    danger?: boolean;
    loading?: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

export function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel,
    cancelLabel = "Cancelar",
    danger = false,
    loading = false,
    onCancel,
    onConfirm,
}: ConfirmDialogProps) {
    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#020817]/80 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-[24px] border border-[#273247] bg-[#111827] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div
                            className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
                                danger
                                    ? "border-rose-500/20 bg-rose-500/10 text-rose-300"
                                    : "border-amber-500/20 bg-amber-500/10 text-amber-300"
                            }`}
                        >
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">{title}</h2>
                            <div className="mt-2 text-sm leading-6 text-slate-400">{description}</div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-xl p-2 text-slate-500 transition hover:bg-[#172033] hover:text-white"
                        aria-label="Fechar confirmação"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="inline-flex h-11 items-center justify-center rounded-xl border border-[#2A3445] px-4 text-sm font-semibold text-slate-300 transition hover:border-[#3A4A61] hover:text-white"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className={`inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold text-white transition ${
                            danger ? "bg-rose-600 hover:bg-rose-500" : "bg-[#2563EB] hover:bg-[#1d4ed8]"
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                        {loading ? "Processando..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
