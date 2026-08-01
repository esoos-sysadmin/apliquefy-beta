import { ExternalLink, Loader2, Zap } from "lucide-react";
import type { RunnerPlatform, RunnerSessionMap } from "../../../shared/runner-types";
import { SessionBadge } from "../atoms/SessionBadge";
import { LoginButton } from "./LoginButton";

type ConnectAccountsProps = {
    sessions: RunnerSessionMap;
    capturingPlatform: RunnerPlatform | null;
    onConnect: (platform: RunnerPlatform) => void;
};

const PLATFORMS: RunnerPlatform[] = ["linkedin", "infojobs"];

export function ConnectAccounts({ sessions, capturingPlatform, onConnect }: ConnectAccountsProps) {
    return (
        <section className="settings-empty">
            <div className="settings-empty__hero">
                <div className="settings-empty__icon">
                    <Zap size={28} />
                </div>
            </div>

            <div className="settings-empty__content">
                <h2 className="settings-empty__title">Conecte suas contas</h2>
                <p className="settings-empty__description">
                    Faça login nas suas plataformas para iniciar a automação.
                </p>
            </div>

            <div className="settings-empty__actions">
                {PLATFORMS.map((platform) => (
                    <div key={platform} className="settings-empty__platform">
                        <LoginButton platform={platform} onClick={onConnect} />
                        <div className="settings-empty__platform-status">
                            {capturingPlatform === platform ? (
                                <span className="status-badge status-badge--paused">
                                    <Loader2 size={12} className="spin" /> Capturando...
                                </span>
                            ) : (
                                <SessionBadge status={sessions[platform]?.status ?? "pending"} />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <a
                href="mailto:support@apliquefy.com"
                target="_blank"
                rel="noreferrer"
                className="settings-empty__support no-drag"
            >
                Ajuda e suporte <ExternalLink size={12} />
            </a>
        </section>
    );
}
