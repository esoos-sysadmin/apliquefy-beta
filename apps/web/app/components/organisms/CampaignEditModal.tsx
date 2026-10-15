"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { SelectField } from "../atoms/SelectField";
import { useCampaigns } from "../../hooks/use-campaigns";
import { useResumes } from "../../hooks/use-resumes";
import type { Campaign } from "../../types/campaign";

export function CampaignEditModal({
    campaign,
    onClose,
}: {
    campaign: Campaign;
    onClose: () => void;
}) {
    const { resumes } = useResumes();
    const { updateCampaign } = useCampaigns();
    const [campaignName, setCampaignName] = useState(campaign.name);
    // "" = campanha ficou órfã (currículo excluído); o select abre vazio
    const [resumeId, setResumeId] = useState(campaign.resumeId ?? "");
    const [dailyLimit, setDailyLimit] = useState(String(campaign.dailyLimit ?? 50));
    const [isSaving, setIsSaving] = useState(false);

    async function handleSave() {
        setIsSaving(true);

        try {
            await updateCampaign(campaign.id, {
                name: campaignName,
                // updateCampaign ignora resumeId falsy: não sobrescreve com vazio
                resumeId: resumeId || undefined,
                dailyLimit: Number(dailyLimit || 0),
            });
            onClose();
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ap-ink/75 px-4 py-8 backdrop-blur-sm">
            <div className="w-full max-w-md overflow-hidden rounded-[22px] border border-line-strong bg-surface shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                <div className="flex items-center justify-between border-b border-line-strong px-5 py-5">
                    <h2 className="text-xl font-semibold text-blue-400">Editar campanha</h2>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar modal de edição"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-overlay hover:text-fg"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="space-y-5 px-5 py-5">
                    <label className="block space-y-2">
                        <span className="text-sm font-medium text-slate-300">Nome da campanha</span>
                        <input
                            value={campaignName}
                            onChange={(event) => setCampaignName(event.target.value)}
                            placeholder="Nome da campanha"
                            className="h-11 w-full rounded-xl border border-line bg-sunken px-4 text-sm text-fg outline-none transition placeholder:text-slate-500 focus:border-accent"
                        />
                    </label>

                    <label className="block space-y-2">
                        <span className="text-sm font-medium text-slate-300">Currículo</span>
                        <SelectField
                            value={resumeId}
                            onChange={setResumeId}
                            options={resumes.map((resume) => ({ label: resume.title, value: resume.id }))}
                            placeholder="Selecione um currículo"
                            clearable={false}
                        />
                    </label>

                    <label className="block space-y-2">
                        <span className="text-sm font-medium text-slate-300">Limite diário de candidaturas</span>
                        <input
                            value={dailyLimit}
                            onChange={(event) => setDailyLimit(event.target.value.replace(/\D/g, "").slice(0, 3))}
                            inputMode="numeric"
                            placeholder="50"
                            className="h-11 w-full rounded-xl border border-line bg-sunken px-4 text-sm text-fg outline-none transition placeholder:text-slate-500 focus:border-accent"
                        />
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                            Limite entre 1 e 200 candidaturas
                        </p>
                    </label>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-line-strong bg-overlay px-5 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-11 items-center justify-center rounded-xl border border-line-strong px-4 text-sm font-semibold text-slate-300 transition hover:border-line-strong hover:text-fg"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="inline-flex h-11 items-center justify-center rounded-xl bg-accent-hover px-5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(122,59,255,0.25)] transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSaving ? "Salvando..." : "Salvar alterações"}
                    </button>
                </div>
            </div>
        </div>
    );
}
