import { Bot, Clock3, Coins, MemoryStick } from "lucide-react";
import type { RunnerCreditBalance, RunnerEngineStatus } from "../../../shared/runner-types";

type StatusBarProps = {
    status: RunnerEngineStatus | null;
    creditBalance?: RunnerCreditBalance | null;
};

export function StatusBar({ status, creditBalance }: StatusBarProps) {
    const isBlocked = creditBalance ? creditBalance.balance <= 0 : false;

    return (
        <footer className="status-bar">
            <span className="status-bar__item">
                <span className={`status-bar__dot ${status?.running ? "status-bar__dot--active" : ""}`} />
                Engine Running: {status?.uptimeLabel ?? "0m"}
            </span>
            <span className="status-bar__item" style={isBlocked ? { color: "#f87171" } : undefined}>
                <Coins size={12} />
                {creditBalance ? creditBalance.balance : "—"} créditos
            </span>
            <span className="status-bar__item">
                <MemoryStick size={12} />
                {status?.memoryLabel ?? "0MB"}
            </span>
            <span className="status-bar__item">
                <Bot size={12} />
                {status?.scriptVersion ?? "v12"}
            </span>
            <span className="status-bar__item">
                <Clock3 size={12} />
                {status?.engineVersion ?? "APLIQUEFY V1.0.0"}
            </span>
        </footer>
    );
}
