"use client";

import { Trash2 } from "lucide-react";
import { inputStyle, sectionStyle, sectionTitle, labelStyle, gridTwoClass, addButtonStyle, addButtonClass, removeButtonStyle, sectionHeaderClass, itemCardClass } from "../../lib/constants/resume-styles";
import { MonthYearPicker } from "../molecules/MonthYearPicker";
import type { ResumeFormEducation } from "../../types/resume-form";

export function ResumeEducationSection({
    education,
    isEditing = true,
    onChange,
    onAdd,
    onRemove,
    onUnlock,
}: {
    education: ResumeFormEducation[];
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
                <h2 style={{ ...sectionTitle, marginBottom: 0 }}>Formação acadêmica</h2>
                {isEditing && (
                    <button type="button" onClick={onAdd} style={addButtonStyle} className={addButtonClass}>
                        + Adicionar formação
                    </button>
                )}
            </div>

            {education.length === 0 && (
                <p style={{ color: "rgb(var(--c-slate-600))", fontSize: 14, textAlign: "center", padding: "24px 0" }}>
                    Nenhuma formação adicionada ainda.
                </p>
            )}

            {education.map((edu, i) => (
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
                            <label style={labelStyle}>Instituição</label>
                            <input value={edu.nameOfInstitution} onChange={(e) => onChange(i, "nameOfInstitution", e.target.value)} onClick={onUnlock} readOnly={frozen} style={inputStyle(false, frozen)} placeholder="Nome da instituição" />
                        </div>
                        <div>
                            <label style={labelStyle}>Curso</label>
                            <input value={edu.nameOfGraduation} onChange={(e) => onChange(i, "nameOfGraduation", e.target.value)} onClick={onUnlock} readOnly={frozen} style={inputStyle(false, frozen)} placeholder="Nome do curso" />
                        </div>
                        {/* celular: início/conclusão lado a lado; sm:contents devolve cada data à grade do desktop */}
                        <div className="col-span-full grid grid-cols-2 gap-2 sm:contents">
                        <div className="min-w-0">
                            <label style={labelStyle}>Data de início</label>
                            <MonthYearPicker
                                value={edu.StartDateOfGraduation}
                                onChange={(v) => onChange(i, "StartDateOfGraduation", v)}
                                onOpen={onUnlock}
                                readOnly={frozen}
                            />
                        </div>
                        <div className="min-w-0">
                            <label style={labelStyle}>Data de conclusão</label>
                            <MonthYearPicker
                                value={edu.EndDateOfGraduation}
                                onChange={(v) => onChange(i, "EndDateOfGraduation", v)}
                                onOpen={onUnlock}
                                readOnly={frozen}
                            />
                        </div>
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
}
