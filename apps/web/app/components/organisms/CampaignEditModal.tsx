"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
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
    const [resumeId, setResumeId] = useState(campaign.resumeId);
    const [dailyLimit, setDailyLimit] = useState(String(campaign.dailyLimit ?? 50));
    const [isSaving, setIsSaving] = useState(false);

    async function handleSave() {
        setIsSaving(true);

        try {
            await updateCampaign(campaign.id, {
                name: campaignName,
                resumeId,
                dailyLimit: Number(dailyLimit || 0),
            });
            onClose();
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/75 px-4 py-8 backdrop-blur-sm">
            <div className="w-full max-w-md overflow-hidden rounded-[22px] border border-[#273247] bg-[#1B2331] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                <div className="flex items-center justify-between border-b border-[#273247] px-5 py-5">
                    <h2 className="text-xl font-semibold text-blue-400">Editar campanha</h2>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar modal de edição"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-[#243146] hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="space-y-5 px-5 py-5">
                    <label className="block space-y-2">
                        <span className="text-sm font-medium text-slate-300">Campaign Name</span>
                        <input
                            value={campaignName}
                            onChange={(event) => setCampaignName(event.target.value)}
                            placeholder="Campaign name"
                            className="h-11 w-full rounded-xl border border-[#202A3A] bg-[#0F1623] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#3B82F6]"
                        />
                    </label>

                    <label className="block space-y-2">
                        <span className="text-sm font-medium text-slate-300">Resume</span>
                        <div className="relative">
                            <select
                                value={resumeId}
                                onChange={(event) => setResumeId(event.target.value)}
                                className="h-11 w-full appearance-none rounded-xl border border-[#202A3A] bg-[#0F1623] px-4 pr-10 text-sm text-slate-200 outline-none transition focus:border-[#3B82F6]"
                            >
                                {resumes.map((resume) => (
                                    <option key={resume.id} value={resume.id}>
                                        {resume.title}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        </div>
                    </label>

                    <label className="block space-y-2">
                        <span className="text-sm font-medium text-slate-300">Daily Application Limit</span>
                        <input
                            value={dailyLimit}
                            onChange={(event) => setDailyLimit(event.target.value.replace(/\D/g, "").slice(0, 3))}
                            inputMode="numeric"
                            placeholder="50"
                            className="h-11 w-full rounded-xl border border-[#202A3A] bg-[#0F1623] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#3B82F6]"
                        />
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                            Limit between 1 and 200 applications
                        </p>
                    </label>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-[#273247] bg-[#242C3A] px-5 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-11 items-center justify-center rounded-xl border border-[#313A49] px-4 text-sm font-semibold text-slate-300 transition hover:border-[#3D4658] hover:text-white"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="inline-flex h-11 items-center justify-center rounded-xl bg-[#3B82F6] px-5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(59,130,246,0.25)] transition hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
