"use client";

import { Moon, Sun } from "lucide-react";
import { setTheme, useTheme } from "../../lib/theme";

export function ThemeToggle() {
    const theme = useTheme();
    const next = theme === "dark" ? "light" : "dark";

    return (
        <button
            type="button"
            onClick={() => setTheme(next)}
            className="nav-item flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-muted"
            aria-label={`Ativar tema ${next === "dark" ? "escuro" : "claro"}`}
        >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            {theme === "dark" ? "Tema claro" : "Tema escuro"}
        </button>
    );
}
