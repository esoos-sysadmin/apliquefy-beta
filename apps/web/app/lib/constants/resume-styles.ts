import type React from "react";

export const inputStyle = (hasError = false, frozen = false): React.CSSProperties => ({
    width: "100%",
    background: frozen ? "#101826" : "#1C2333",
    border: `1px solid ${hasError ? "#ef4444" : frozen ? "#1a2336" : "#1C2B46"}`,
    borderRadius: 8,
    padding: "10px 12px",
    color: frozen ? "#6b7fa3" : "#fff",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    cursor: frozen ? "pointer" : "text",
    transition: "background 0.15s, color 0.15s",
});

export const sectionStyle: React.CSSProperties = {
    background: "#161C27",
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
    border: "1px solid #1C2333",
};

export const sectionTitle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 20,
    color: "#60a5fa",
};

export const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    color: "#94a3b8",
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
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
};

export const addButtonStyle: React.CSSProperties = {
    background: "transparent",
    border: "1px solid #3b82f6",
    color: "#3b82f6",
    borderRadius: 8,
    padding: "6px 14px",
    fontSize: 13,
    cursor: "pointer",
    fontWeight: 600,
};

export const removeButtonStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    color: "#ef4444",
    fontSize: 12,
    cursor: "pointer",
};
