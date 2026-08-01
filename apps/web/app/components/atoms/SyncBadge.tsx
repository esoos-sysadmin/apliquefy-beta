import { MonitorCheck, MonitorX } from "lucide-react";

type SyncBadgeProps = {
    synced: boolean;
};

export function SyncBadge({ synced }: SyncBadgeProps) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: synced ? "#22c55e" : "#6b7280" }}>
            {synced ? <MonitorCheck size={14} /> : <MonitorX size={14} />}
            {synced ? "Sincronizado com o app desktop" : "Não sincronizado"}
        </div>
    );
}
