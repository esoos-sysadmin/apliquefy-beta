import type { ReactNode } from "react";
import { GradientButton } from "../atoms/GradientButton";

type SettingsTemplateProps = {
    children: ReactNode;
    isSaving: boolean;
    onSave: () => void;
};

export function SettingsTemplate({ children, isSaving, onSave }: SettingsTemplateProps) {
    return (
        <div className="settings-page">
            <div className="settings-page__content">{children}</div>

            <div className="settings-page__footer">
                <GradientButton
                    fullWidth
                    onClick={onSave}
                    disabled={isSaving}
                >
                    {isSaving ? "Salvando..." : "Salvar alterações"}
                </GradientButton>
            </div>
        </div>
    );
}
