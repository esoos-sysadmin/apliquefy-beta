"use client";

import { AlertCircle } from "lucide-react";
import type { FieldError } from "../../lib/format-field-errors";

interface FormErrorBannerProps {
    title?: string;
    errors: FieldError[];
}

export function FormErrorBanner({ title = "Não foi possível salvar. Corrija os campos abaixo:", errors }: FormErrorBannerProps) {
    if (errors.length === 0) return null;

    return (
        <div
            role="alert"
            style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.35)",
                borderRadius: 12,
                padding: "14px 16px",
                marginBottom: 20,
                color: "#FCA5A5",
                fontSize: 14,
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontWeight: 600, color: "#FECACA" }}>
                <AlertCircle size={16} />
                <span>{title}</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 4 }}>
                {errors.map((err, i) => (
                    <li key={`${err.path}-${i}`}>
                        <strong style={{ color: "#FECACA" }}>{err.label}:</strong> {err.message}
                    </li>
                ))}
            </ul>
        </div>
    );
}
