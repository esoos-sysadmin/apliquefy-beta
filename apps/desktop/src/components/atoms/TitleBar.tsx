import { Minus, X } from "lucide-react";

type TitleBarProps = {
    onClose: () => void;
    onMinimize: () => void;
};

export function TitleBar({ onClose, onMinimize }: TitleBarProps) {
    return (
        <header className="titlebar">
            <div className="titlebar__inner">
                <span className="titlebar__brand">Apliquefy</span>
                <div className="titlebar__actions">
                    <button
                        type="button"
                        onClick={onMinimize}
                        aria-label="Minimizar janela do runner"
                        className="titlebar__close no-drag"
                    >
                        <Minus size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar janela do runner"
                        className="titlebar__close no-drag"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
}
