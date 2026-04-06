"use client";

import { ChevronDown } from "lucide-react";

export function SelectField<T extends string>({
    value,
    onChange,
    options,
    placeholder = "Select...",
}: {
    value: T;
    onChange: (value: T) => void;
    options: readonly { label: string; value: T }[];
    placeholder?: string;
}) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(event) => onChange(event.target.value as T)}
                className="h-12 w-full appearance-none rounded-xl border border-[#263149] bg-[#101826] px-4 pr-10 text-sm text-slate-200 outline-none transition focus:border-[#3B82F6]"
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
        </div>
    );
}
