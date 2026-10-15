"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export function SelectField<T extends string>({
    value,
    onChange,
    options,
    placeholder = "Select...",
    disabled,
    className = "",
    clearable = true,
}: {
    value: T;
    onChange: (value: T) => void;
    options: readonly { label: string; value: T }[];
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    clearable?: boolean;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const selected = options.find((option) => option.value === value) ?? null;

    // mantém o comportamento do <option value=""> nativo que existia antes
    const items = clearable
        ? [{ label: placeholder, value: "" as T }, ...options]
        : options;

    useEffect(() => {
        if (!open) return;
        function onDoc(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
        }
        function onKey(event: KeyboardEvent) {
            if (event.key === "Escape") setOpen(false);
        }
        document.addEventListener("mousedown", onDoc);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDoc);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    return (
        <div ref={ref} className={`relative ${className}`}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen((previous) => !previous)}
                aria-haspopup="listbox"
                aria-expanded={open}
                className={`flex h-12 w-full items-center justify-between gap-3 rounded-xl border bg-sunken px-4 text-left text-sm transition hover:border-accent/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
                    open ? "border-accent" : "border-line-strong"
                }`}
            >
                <span className={`truncate ${selected ? "text-slate-100" : "text-slate-500"}`}>
                    {selected?.label ?? placeholder}
                </span>
                <ChevronDown
                    size={16}
                    className={`shrink-0 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <ul
                    role="listbox"
                    className="absolute z-30 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-line-strong bg-surface p-1 shadow-2xl shadow-black/50"
                >
                    {items.map((option) => {
                        const active = option.value === value;
                        return (
                            <li key={option.value || "__empty"}>
                                <button
                                    type="button"
                                    role="option"
                                    aria-selected={active}
                                    onClick={() => {
                                        onChange(option.value);
                                        setOpen(false);
                                    }}
                                    className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                                        active
                                            ? "bg-sky-500/15 text-sky-200"
                                            : option.value
                                              ? "text-slate-300 hover:bg-raised"
                                              : "text-slate-500 hover:bg-raised"
                                    }`}
                                >
                                    <span className="truncate">{option.label}</span>
                                    {active && <Check size={15} className="shrink-0 text-sky-300" />}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
