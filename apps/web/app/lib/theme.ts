"use client";

import { useSyncExternalStore } from "react";

// Tema = atributo data-theme no <html> (cores em theme.palette.js). O script inline do
// layout raiz aplica a preferência salva antes da pintura; aqui só lemos/alteramos.
export type Theme = "light" | "dark";

const read = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

const subscribe = (onChange: () => void) => {
    const observer = new MutationObserver(onChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
};

export const useTheme = () => useSyncExternalStore<Theme>(subscribe, read, () => "light");

export function setTheme(theme: Theme) {
    document.documentElement.dataset.theme = theme;
    try {
        localStorage.setItem("theme", theme);
    } catch {
        // storage bloqueado: o tema vale só para esta aba
    }
}

// Clerk calcula tons a partir das variables, então elas vão em hex por tema (não var(--c-*)).
export const clerkAppearance = {
    light: {
        variables: {
            colorPrimary: "#7A3BFF",
            colorBackground: "#FFFFFF",
            colorText: "#14121C",
            colorTextSecondary: "#625D6C",
            colorInputBackground: "#FFFFFF",
            colorInputText: "#14121C",
            colorNeutral: "#14121C",
            borderRadius: "10px",
            fontFamily: "inherit",
        },
    },
    dark: {
        variables: {
            colorPrimary: "#7A3BFF",
            colorBackground: "#1A1723",
            colorText: "#F6F4FA",
            colorTextSecondary: "#9E98AA",
            colorInputBackground: "#0C0A11",
            colorInputText: "#F6F4FA",
            colorNeutral: "#F6F4FA",
            colorShimmer: "#2B2638",
            borderRadius: "10px",
            fontFamily: "inherit",
        },
    },
} as const;
