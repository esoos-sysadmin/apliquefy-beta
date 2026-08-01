import { BriefcaseBusiness, ChevronRight } from "lucide-react";
import type { RunnerPlatform } from "../../../shared/runner-types";

type LoginButtonProps = {
    platform: RunnerPlatform;
    onClick: (platform: RunnerPlatform) => void;
};

export function LoginButton({ platform, onClick }: LoginButtonProps) {
    const isLinkedIn = platform === "linkedin";

    return (
        <button
            type="button"
            onClick={() => onClick(platform)}
            className="login-button no-drag"
        >
            <span className={`login-button__icon ${isLinkedIn ? "login-button__icon--linkedin" : "login-button__icon--infojobs"}`}>
                {isLinkedIn ? <span className="login-button__wordmark">in</span> : <BriefcaseBusiness size={18} />}
            </span>
            <span className="login-button__label">
                {isLinkedIn ? "Entrar com o LinkedIn" : "Entrar com o InfoJobs"}
            </span>
            <ChevronRight size={18} className="login-button__chevron" />
        </button>
    );
}
