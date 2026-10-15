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
    padding: 24,
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

export const gridTwo: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
};

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

export const removeButtonStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    color: "rgb(var(--c-rose-400))",
    fontSize: 12,
    cursor: "pointer",
};
