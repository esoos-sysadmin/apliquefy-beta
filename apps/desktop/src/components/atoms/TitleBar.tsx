import { X } from "lucide-react";

type TitleBarProps = {
    onClose: () => void;
};

export function TitleBar({ onClose }: TitleBarProps) {
    return (
        <header className="titlebar">
            <div className="titlebar__inner">
                <span className="titlebar__label">APLIQUEFY RUNNER</span>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close runner window"
                    className="titlebar__close no-drag"
                >
                    <X size={18} />
                </button>
            </div>
        </header>
    );
}
