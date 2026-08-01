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
                <h2 className="section-header__title section-header__title--small">Conexão da conta</h2>
            </div>

            {auth.isAuthenticated ? (
                <div className="account-card">
                    <div className="account-card__summary">
                        <div className="account-card__avatar">
                            {(auth.displayName ?? auth.email ?? "A").slice(0, 2).toUpperCase()}
                        </div>
                        <div className="account-card__info">
                            <strong className="account-card__name">
                                {auth.displayName ?? auth.email ?? "Usuário autenticado"}
                            </strong>
                            <span className="account-card__label">
                                {auth.email ?? "Autenticado via Clerk"}
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
                        Desconectar conta
                    </button>
                </div>
            ) : (
                <div className="account-card account-card--empty">
                    <strong className="account-card__name">Nenhuma conta conectada</strong>
                    <p className="account-card__empty-copy">
                        Entre com o Clerk para desbloquear o runner e acessar os controles de automação local.
                    </p>
                </div>
            )}
        </section>
    );
}
