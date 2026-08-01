import type { RunnerSettings } from "../../../shared/runner-types";
import { ToggleSwitch } from "../atoms/ToggleSwitch";

type GeneralSettingsProps = {
    settings: RunnerSettings;
    onToggle: (key: keyof RunnerSettings, value: boolean) => void;
};

export function GeneralSettings({ settings, onToggle }: GeneralSettingsProps) {
    return (
        <section className="settings-section">
            <div className="section-header section-header--stacked">
                <h2 className="section-header__title section-header__title--small">Configurações gerais</h2>
            </div>

            <div className="settings-card">
                <div className="settings-card__row">
                    <div>
                        <strong className="settings-card__label">Iniciar com o Windows</strong>
                        <p className="settings-card__description">Abrir automaticamente ao ligar o computador</p>
                    </div>
                    <ToggleSwitch
                        checked={settings.startWithWindows}
                        onChange={(value) => onToggle("startWithWindows", value)}
                    />
                </div>

                <div className="settings-card__row">
                    <div>
                        <strong className="settings-card__label">Notificações no desktop</strong>
                        <p className="settings-card__description">Avisos quando o status das campanhas mudar</p>
                    </div>
                    <ToggleSwitch
                        checked={settings.desktopNotifications}
                        onChange={(value) => onToggle("desktopNotifications", value)}
                    />
                </div>

                <div className="settings-card__row">
                    <div>
                        <strong className="settings-card__label">Sempre visível</strong>
                        <p className="settings-card__description">Mantém o runner acima das outras janelas</p>
                    </div>
                    <ToggleSwitch
                        checked={settings.alwaysOnTop}
                        onChange={(value) => onToggle("alwaysOnTop", value)}
                    />
                </div>

                <div className="settings-card__row">
                    <div>
                        <strong className="settings-card__label">Relatórios de erro anônimos</strong>
                        <p className="settings-card__description">
                            Envia falhas técnicas do runner para corrigirmos mais rápido. Nunca inclui
                            currículo, senha ou capturas de tela. Aplica ao reiniciar o app.
                        </p>
                    </div>
                    <ToggleSwitch
                        checked={settings.errorReports}
                        onChange={(value) => onToggle("errorReports", value)}
                    />
                </div>
            </div>
        </section>
    );
}
