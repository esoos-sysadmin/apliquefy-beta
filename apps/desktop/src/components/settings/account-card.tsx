import { Power } from "lucide-react";
import type { RunnerAuthState } from "../../../shared/runner-types";

type AccountCardProps = {
    auth: RunnerAuthState;
    onDisconnect: () => void;
};

export function AccountCard({ auth, onDisconnect }: AccountCardProps) {
    return (
        <section className="settings-section">
            <div className="section-header section-header--stacked">
                <h2 className="section-header__title section-header__title--small">Account Connection</h2>
            </div>

            {auth.isAuthenticated ? (
                <div className="account-card">
                    <div className="account-card__summary">
                        <div className="account-card__avatar">
                            {(auth.displayName ?? auth.email ?? "A").slice(0, 2).toUpperCase()}
                        </div>
                        <div className="account-card__info">
                            <strong className="account-card__name">
                                {auth.displayName ?? auth.email ?? "Authenticated User"}
                            </strong>
                            <span className="account-card__label">
                                {auth.email ?? "Authenticated via Clerk"}
                            </span>
                        </div>
                        <span className="account-card__status-dot" />
                    </div>

                    <button
                        type="button"
                        onClick={onDisconnect}
                        className="secondary-button secondary-button--full no-drag"
                    >
                        <Power size={14} />
                        Disconnect Account
                    </button>
                </div>
            ) : (
                <div className="account-card account-card--empty">
                    <strong className="account-card__name">No account connected</strong>
                    <p className="account-card__empty-copy">
                        Sign in with Clerk to unlock the runner and access local automation controls.
                    </p>
                </div>
            )}
        </section>
    );
}
