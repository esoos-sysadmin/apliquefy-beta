"use client";

import { inputStyle, sectionStyle, sectionTitle, labelStyle, gridTwo, addButtonStyle, removeButtonStyle } from "../../lib/constants/resume-styles";
import { idiomLevelOptions } from "../../lib/constants/resume-form";
import type { ResumeFormIdiom } from "../../types/resume-form";

export function ResumeIdiomsSection({
    idioms,
    isEditing = true,
    onChange,
    onAdd,
    onRemove,
    onUnlock,
}: {
    idioms: ResumeFormIdiom[];
    isEditing?: boolean;
    onChange: (index: number, field: string, value: string) => void;
    onAdd: () => void;
    onRemove: (index: number) => void;
    onUnlock?: () => void;
}) {
    const frozen = !isEditing;

    return (
        <section style={sectionStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ ...sectionTitle, marginBottom: 0 }}>Idiomas</h2>
                {isEditing && (
                    <button onClick={onAdd} style={addButtonStyle}>
                        + Adicionar idioma
                    </button>
                )}
            </div>

            {idioms.map((idiom, i) => (
                <div key={i} style={{ background: "#1C2333", borderRadius: 8, padding: 16, marginBottom: 12 }}>
                    {isEditing && (
                        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
                            <button onClick={() => onRemove(i)} style={removeButtonStyle}>Remover</button>
                        </div>
                    )}
                    <div style={gridTwo}>
                        <div>
                            <label style={labelStyle}>Idioma</label>
                            <input value={idiom.language} onChange={(e) => onChange(i, "language", e.target.value)} onClick={onUnlock} readOnly={frozen} style={inputStyle(false, frozen)} placeholder="Ex: Inglês" />
                        </div>
                        <div>
                            <label style={labelStyle}>Nível</label>
                            <select
                                value={idiom.level}
                                onChange={(e) => onChange(i, "level", e.target.value)}
                                onClick={onUnlock}
                                disabled={frozen}
                                style={{ ...inputStyle(false, frozen), appearance: "none" }}
                            >
                                <option value="">Selecione...</option>
                                {idiomLevelOptions.map((l) => (
                                    <option key={l} value={l}>{l}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            ))}

            {idioms.length === 0 && (
                <p style={{ color: "#555", fontSize: 14, textAlign: "center", padding: "24px 0" }}>
                    Nenhum idioma adicionado ainda.
                </p>
            )}
        </section>
    );
}
