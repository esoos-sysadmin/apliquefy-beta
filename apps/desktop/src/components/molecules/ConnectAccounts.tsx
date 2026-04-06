import { ExternalLink, Zap } from "lucide-react";
import type { RunnerPlatform } from "../../../shared/runner-types";
import { LoginButton } from "./LoginButton";

type ConnectAccountsProps = {
    onConnect: (platform: RunnerPlatform) => void;
};

export function ConnectAccounts({ onConnect }: ConnectAccountsProps) {
    return (
        <section className="settings-empty">
            <div className="settings-empty__hero">
                <div className="settings-empty__icon">
                    <Zap size={28} />
                </div>
            </div>

            <div className="settings-empty__content">
                <h2 className="settings-empty__title">Connect Your Accounts</h2>
                <p className="settings-empty__description">
                    Login to your platforms to start the automation.
                </p>
            </div>

            <div className="settings-empty__actions">
                <LoginButton platform="linkedin" onClick={onConnect} />
                <LoginButton platform="infojobs" onClick={onConnect} />
            </div>

            <a
                href="mailto:support@apliquefy.com"
                target="_blank"
                rel="noreferrer"
                className="settings-empty__support no-drag"
            >
                Help &amp; Support <ExternalLink size={12} />
            </a>
        </section>
    );
}
