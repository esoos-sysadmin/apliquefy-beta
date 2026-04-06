import { Pause, Play } from "lucide-react";
import type { CampaignStatus } from "../../types/campaign";

export const statusConfig: Record<
    CampaignStatus,
    {
        label: string;
        badgeClassName: string;
        actionLabel: string;
        ActionIcon: typeof Pause;
        actionClassName: string;
        dotClassName: string;
        iconBoxClassName: string;
    }
> = {
    active: {
        label: "Running",
        badgeClassName: "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
        actionLabel: "Pausar",
        ActionIcon: Pause,
        actionClassName: "border border-slate-700 bg-slate-800/70 text-slate-200 hover:border-slate-600 hover:bg-slate-800",
        dotClassName: "bg-emerald-300",
        iconBoxClassName: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
    },
    paused: {
        label: "Paused",
        badgeClassName: "border border-amber-500/20 bg-amber-500/10 text-amber-300",
        actionLabel: "Retomar",
        ActionIcon: Play,
        actionClassName: "border border-blue-500/20 bg-blue-500/10 text-blue-300 hover:border-blue-400/30 hover:bg-blue-500/15",
        dotClassName: "bg-amber-300",
        iconBoxClassName: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
    },
    inactive: {
        label: "Inactive",
        badgeClassName: "border border-slate-700 bg-slate-800 text-slate-300",
        actionLabel: "Reativar",
        ActionIcon: Play,
        actionClassName: "border border-slate-700 bg-slate-800/70 text-slate-300 hover:border-slate-600 hover:bg-slate-800",
        dotClassName: "bg-slate-300",
        iconBoxClassName: "border border-orange-500/20 bg-orange-500/10 text-orange-300",
    },
};
