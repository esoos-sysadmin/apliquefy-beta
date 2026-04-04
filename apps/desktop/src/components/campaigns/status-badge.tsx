import type { RunnerCampaignStatus } from "../../../shared/runner-types";

type StatusBadgeProps = {
    status: RunnerCampaignStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
    const isActive = status === "active";
    const label = status.toUpperCase();

    return (
        <span className={`status-badge ${isActive ? "status-badge--active" : "status-badge--paused"}`}>
            <span className="status-badge__dot" />
            {label}
        </span>
    );
}
