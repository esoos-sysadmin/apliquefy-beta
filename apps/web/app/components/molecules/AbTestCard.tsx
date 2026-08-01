"use client";

import { FlaskConical, Trophy, Trash2 } from "lucide-react";
import type { AbTest } from "../../types/ab-test";

const winnerLabel: Record<string, string> = { A: "Variante A", B: "Variante B", tie: "Empate" };

function VariantMini({ label, name, apps }: { label: "A" | "B"; name: string; apps: number }) {
    return (
        <div className="flex-1 rounded-xl border border-[#24304A] bg-[#101826] px-3 py-2.5">
            <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-[#2563EB] text-[10px] font-bold text-white">{label}</span>
                <span className="truncate text-xs font-medium text-slate-200" title={name}>{name}</span>
            </div>
            <p className="mt-1.5 text-xs text-slate-500">{apps} candidatura(s)</p>
        </div>
    );
}

export function AbTestCard({
    abTest,
    onView,
    onDelete,
}: {
    abTest: AbTest;
    onView: (abTest: AbTest) => void;
    onDelete: (abTest: AbTest) => void;
}) {
    return (
        <div className="rounded-2xl border border-[#1C2333] bg-[#131B2A] p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-300">
                        <FlaskConical size={18} />
                    </div>
                    <div>
                        <p className="font-semibold text-white">{abTest.name}</p>
                        <p className="text-xs uppercase tracking-wide text-slate-500">{abTest.platform}</p>
                    </div>
                </div>

                {abTest.winner ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
                        <Trophy size={12} /> {winnerLabel[abTest.winner]}
                    </span>
                ) : (
                    <span className="rounded-full border border-[#273247] bg-[#101826] px-3 py-1 text-xs font-semibold text-slate-400">
                        Em andamento
                    </span>
                )}
            </div>

            <div className="mt-4 flex gap-3">
                <VariantMini label="A" name={abTest.variantA.resume?.title ?? abTest.variantA.name} apps={abTest.variantA._count.jobApplications} />
                <VariantMini label="B" name={abTest.variantB.resume?.title ?? abTest.variantB.name} apps={abTest.variantB._count.jobApplications} />
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
                <button
                    type="button"
                    onClick={() => onDelete(abTest)}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#273247] px-4 text-sm font-semibold text-rose-300 transition hover:border-rose-500/40 hover:bg-rose-500/10"
                >
                    <Trash2 size={15} /> Excluir
                </button>
                <button
                    type="button"
                    onClick={() => onView(abTest)}
                    className="inline-flex h-10 items-center rounded-xl bg-[#2563EB] px-4 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
                >
                    Ver comparação
                </button>
            </div>
        </div>
    );
}
