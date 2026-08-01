"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export function TagInput({
    tags,
    onChange,
    placeholder = "Digite e pressione Enter",
    icon,
}: {
    tags: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    icon?: React.ReactNode;
}) {
    const [input, setInput] = useState("");

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" && input.trim()) {
            e.preventDefault();
            const tag = input.trim();
            if (!tags.includes(tag)) {
                onChange([...tags, tag]);
            }
            setInput("");
        }
    }

    function removeTag(tag: string) {
        onChange(tags.filter((t) => t !== tag));
    }

    return (
        <div className="rounded-xl border border-[#263149] bg-[#101826] px-4 py-2 focus-within:border-[#3B82F6] transition">
            <div className="flex items-center gap-3">
                {icon ?? <Search size={16} className="shrink-0 text-slate-500" />}
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={tags.length === 0 ? placeholder : "Adicionar mais..."}
                    className="h-8 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                />
            </div>
            {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#1C2B46] px-3 py-1 text-xs font-medium text-blue-400"
                        >
                            {tag}
                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="leading-none text-blue-400 hover:text-white"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
