import type React from "react";

// Camadas (tokens de theme.palette.js, valem nos dois temas):
//   página  canvas
//   card    surface (elevado, com borda + sombra)
//   input   sunken (rebaixado em relação ao card, borda nítida)

export const inputStyle = (hasError = false, frozen = false): React.CSSProperties => ({
    width: "100%",
    background: frozen ? "rgb(var(--c-raised))" : "rgb(var(--c-sunken))",
    border: `1px solid ${hasError ? "rgb(var(--c-rose-500))" : frozen ? "rgb(var(--c-line))" : "rgb(var(--c-line-strong))"}`,
    borderRadius: 8,
    padding: "10px 12px",
    color: frozen ? "rgb(var(--c-slate-300))" : "rgb(var(--c-fg))",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    cursor: frozen ? "pointer" : "text",
    transition: "background 0.15s, color 0.15s, border-color 0.15s",
});

export const sectionStyle: React.CSSProperties = {
    background: "rgb(var(--c-surface))",
    borderRadius: 12,
    padding: "clamp(16px, 4vw, 24px)",
    marginBottom: 20,
    border: "1px solid rgb(var(--c-line))",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.25)",
};

export const sectionTitle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 700,
    marginTop: 0,
    marginBottom: 20,
    paddingBottom: 12,
    borderBottom: "1px solid rgb(var(--c-line))",
    color: "rgb(var(--c-accent-text))",
};

export const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    color: "rgb(var(--c-slate-400))",
    marginBottom: 8,
    fontWeight: 500,
    letterSpacing: "0.03em",
};

// 1 coluna no celular, 2 a partir de sm (640 px). Classe porque estilo inline não tem breakpoint.
export const gridTwoClass = "grid gap-4 sm:grid-cols-2";

export const errorStyle: React.CSSProperties = {
    display: "block",
    color: "rgb(var(--c-rose-400))",
    fontSize: 12,
    marginTop: 4,
};

export const addButtonStyle: React.CSSProperties = {
    background: "rgb(var(--c-accent) / 0.12)",
    border: "1px solid rgb(var(--c-accent))",
    color: "rgb(var(--c-accent-text))",
    borderRadius: 8,
    padding: "6px 14px",
    fontSize: 13,
    cursor: "pointer",
    fontWeight: 600,
};
// celular: botão na largura toda e com 44 px de altura; sm+ volta ao tamanho do conteúdo.
export const addButtonClass = "min-h-[44px] w-full sm:min-h-0 sm:w-auto";
// cabeçalho de seção: título e "+ Adicionar" empilham no celular
export const sectionHeaderClass = "mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between";
// card de item (experiência/formação/idioma)
export const itemCardClass = "mb-3 rounded-lg bg-raised p-3 sm:p-4";

export const removeButtonStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    color: "rgb(var(--c-rose-400))",
    fontSize: 12,
    cursor: "pointer",
};
