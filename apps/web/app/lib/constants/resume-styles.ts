import type React from "react";

// Escala de camadas sobre o fundo da página (#0B111A):
//   página  #0B111A  (mais escuro)
//   card     #1A2335  (elevado, com borda + sombra)
//   input    #0F1826  (inset, mais escuro que o card, borda nítida)

export const inputStyle = (hasError = false, frozen = false): React.CSSProperties => ({
    width: "100%",
    background: frozen ? "#141D2D" : "#0F1826",
    border: `1px solid ${hasError ? "#ef4444" : frozen ? "#28344C" : "#33486A"}`,
    borderRadius: 8,
    padding: "10px 12px",
    color: frozen ? "#C6D2E6" : "#F1F5F9",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    cursor: frozen ? "pointer" : "text",
    transition: "background 0.15s, color 0.15s, border-color 0.15s",
});

export const sectionStyle: React.CSSProperties = {
    background: "#1A2335",
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
    border: "1px solid #2B3853",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.25)",
};

export const sectionTitle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 700,
    marginTop: 0,
    marginBottom: 20,
    paddingBottom: 12,
    borderBottom: "1px solid #2B3853",
    color: "#7FB2FF",
};

export const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    color: "#A6B4CC",
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
    color: "#f87171",
    fontSize: 12,
    marginTop: 4,
};

export const addButtonStyle: React.CSSProperties = {
    background: "rgba(59, 130, 246, 0.12)",
    border: "1px solid #3b82f6",
    color: "#93c5fd",
    borderRadius: 8,
    padding: "6px 14px",
    fontSize: 13,
    cursor: "pointer",
    fontWeight: 600,
};

export const removeButtonStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    color: "#f87171",
    fontSize: 12,
    cursor: "pointer",
};
