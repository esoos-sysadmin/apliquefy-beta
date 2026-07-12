import { AlertTriangle, X } from "lucide-react";
import type { RunnerPlatform } from "../../../shared/runner-types";

type SessionRequiredModalProps = {
    open: boolean;
    platform: RunnerPlatform | null;
    onClose: () => void;
    onLogin: (platform: RunnerPlatform) => void;
};

const PLATFORM_LABEL: Record<RunnerPlatform, string> = {
    linkedin: "LinkedIn",
    infojobs: "InfoJobs",
};

export function SessionRequiredModal({ open, platform, onClose, onLogin }: SessionRequiredModalProps) {
    if (!open || !platform) {
        return null;
    }

    const label = PLATFORM_LABEL[platform];

    return (
        <div className="session-modal__backdrop" role="dialog" aria-modal="true">
            <div className="session-modal">
                <button
                    type="button"
                    className="session-modal__close no-drag"
                    onClick={onClose}
                    aria-label="Fechar"
                >
                    <X size={16} />
                </button>

                <div className="session-modal__icon">
                    <AlertTriangle size={28} />
                </div>

                <h2 className="session-modal__title">Sessão necessária</h2>
                <p className="session-modal__description">
                    Para iniciar a campanha você precisa estar logado na sua conta {label}.
                </p>

                <button
                    type="button"
                    className="session-modal__action no-drag"
                    onClick={() => onLogin(platform)}
                >
                    Fazer login no {label}
                </button>
            </div>
        </div>
    );
}
