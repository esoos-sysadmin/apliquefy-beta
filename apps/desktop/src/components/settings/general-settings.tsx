import type { RunnerSettings } from "../../../shared/runner-types";
import { ToggleSwitch } from "./toggle-switch";

type GeneralSettingsProps = {
    settings: RunnerSettings;
    onToggle: (key: keyof RunnerSettings, value: boolean) => void;
};

export function GeneralSettings({ settings, onToggle }: GeneralSettingsProps) {
    return (
        <section className="settings-section">
            <div className="section-header section-header--stacked">
                <h2 className="section-header__title section-header__title--small">General Settings</h2>
            </div>

            <div className="settings-card">
                <div className="settings-card__row">
                    <div>
                        <strong className="settings-card__label">Start with Windows</strong>
                        <p className="settings-card__description">Automatically launch at login</p>
                    </div>
                    <ToggleSwitch
                        checked={settings.startWithWindows}
                        onChange={(value) => onToggle("startWithWindows", value)}
                    />
                </div>

                <div className="settings-card__row">
                    <div>
                        <strong className="settings-card__label">Desktop Notifications</strong>
                        <p className="settings-card__description">Alerts for campaign status changes</p>
                    </div>
                    <ToggleSwitch
                        checked={settings.desktopNotifications}
                        onChange={(value) => onToggle("desktopNotifications", value)}
                    />
                </div>

                <div className="settings-card__row">
                    <div>
                        <strong className="settings-card__label">Always on top</strong>
                        <p className="settings-card__description">Keep the runner pinned above other windows</p>
                    </div>
                    <ToggleSwitch
                        checked={settings.alwaysOnTop}
                        onChange={(value) => onToggle("alwaysOnTop", value)}
                    />
                </div>
            </div>
        </section>
    );
}
