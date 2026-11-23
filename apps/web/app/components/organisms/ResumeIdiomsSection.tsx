"use client";

import { Trash2 } from "lucide-react";
import { inputStyle, sectionStyle, sectionTitle, labelStyle, gridTwoClass, addButtonStyle, addButtonClass, removeButtonStyle, sectionHeaderClass, itemCardClass } from "../../lib/constants/resume-styles";
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
            <div className={sectionHeaderClass}>
                <h2 style={{ ...sectionTitle, marginBottom: 0 }}>Idiomas</h2>
                {isEditing && (
                    <button type="button" onClick={onAdd} style={addButtonStyle} className={addButtonClass}>
                        + Adicionar idioma
                    </button>
                )}
            </div>

            {idioms.map((idiom, i) => (
                <div key={i} className={itemCardClass}>
                    {isEditing && (
                        <div className="mb-2 flex justify-end">
                            <button type="button" onClick={() => onRemove(i)} style={removeButtonStyle} className="inline-flex min-h-[44px] items-center gap-1.5 px-2 sm:min-h-0 sm:px-0">
                                <Trash2 size={16} className="sm:hidden" /> Remover
                            </button>
                        </div>
                    )}
                    <div className={gridTwoClass}>
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
                <p style={{ color: "rgb(var(--c-slate-600))", fontSize: 14, textAlign: "center", padding: "24px 0" }}>
                    Nenhum idioma adicionado ainda.
                </p>
            )}
        </section>
    );
}
