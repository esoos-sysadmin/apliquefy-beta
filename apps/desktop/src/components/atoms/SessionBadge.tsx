import { Check, X } from "lucide-react";
import type { SessionStatus } from "../../../shared/runner-types";

type SessionBadgeProps = {
    status: SessionStatus | null | undefined;
};

const LABELS: Record<SessionStatus, string> = {
    active: "Sessão Ativa",
    invalid: "Sessão Inválida",
    pending: "Sessão Pendente",
    expired: "Sessão Expirada",
};

export function SessionBadge({ status }: SessionBadgeProps) {
    const isActive = status === "active";
    const label = status ? LABELS[status] : "Sessão Pendente";

    return (
        <span
            className={`status-badge ${isActive ? "status-badge--active" : "status-badge--paused"}`}
            data-session-status={status ?? "pending"}
        >
            {isActive ? <Check size={12} /> : <X size={12} />}
            {label}
        </span>
    );
}
