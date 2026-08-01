import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import type { PersonaId } from "../../../shared/runner-types";

export type VoiceOption = { id: PersonaId; label: string; hint: string };

type VoiceSelectProps = {
    options: VoiceOption[];
    value: PersonaId;
    onChange: (id: PersonaId) => void;
    disabled?: boolean;
};

// Dropdown próprio em vez de <select>: no Electron a lista de <option> é desenhada pelo
// SO e não aceita o estilo do app. O preço é ter que fechar no clique de fora e no Esc.
export function VoiceSelect({ options, value, onChange, disabled }: VoiceSelectProps) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const current = options.find((o) => o.id === value) ?? options[0];

    useEffect(() => {
        if (!open) return;
        const onPointerDown = (event: PointerEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
        };
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };
        document.addEventListener("pointerdown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    return (
        <div className="voicesel no-drag" ref={rootRef}>
            <button
                type="button"
                className={`voicesel__trigger${open ? " voicesel__trigger--open" : ""}`}
                onClick={() => setOpen((v) => !v)}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={`Voz do Apollo: ${current.label}`}
            >
                <span className="voicesel__dot" data-voice={current.id} />
                <span className="voicesel__label">{current.label}</span>
                <ChevronDown size={13} className="voicesel__chev" />
            </button>

            {open ? (
                <ul className="voicesel__menu" role="listbox" aria-label="Voz do Apollo">
                    {options.map((option) => (
                        <li key={option.id}>
                            <button
                                type="button"
                                role="option"
                                aria-selected={option.id === value}
                                className={`voicesel__opt${option.id === value ? " voicesel__opt--on" : ""}`}
                                onClick={() => {
                                    onChange(option.id);
                                    setOpen(false);
                                }}
                            >
                                <span className="voicesel__dot" data-voice={option.id} />
                                <span className="voicesel__opttext">
                                    <span className="voicesel__optlabel">{option.label}</span>
                                    <span className="voicesel__opthint">{option.hint}</span>
                                </span>
                                {option.id === value ? <Check size={13} className="voicesel__check" /> : null}
                            </button>
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    );
}
