import { Bot, Clock3, MemoryStick } from "lucide-react";
import type { RunnerEngineStatus } from "../../../shared/runner-types";

type StatusBarProps = {
    status: RunnerEngineStatus | null;
};

export function StatusBar({ status }: StatusBarProps) {
    return (
        <footer className="status-bar">
            <span className="status-bar__item">
                <span className={`status-bar__dot ${status?.running ? "status-bar__dot--active" : ""}`} />
                Engine Running: {status?.uptimeLabel ?? "0m"}
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
