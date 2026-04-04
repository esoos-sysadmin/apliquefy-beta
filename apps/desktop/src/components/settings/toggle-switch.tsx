type ToggleSwitchProps = {
    checked: boolean;
    onChange: (nextValue: boolean) => void;
};

export function ToggleSwitch({ checked, onChange }: ToggleSwitchProps) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`toggle-switch no-drag ${checked ? "toggle-switch--checked" : ""}`}
        >
            <span className="toggle-switch__thumb" />
        </button>
    );
}
