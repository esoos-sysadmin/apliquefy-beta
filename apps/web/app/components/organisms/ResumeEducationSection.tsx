"use client";

import { inputStyle, sectionStyle, sectionTitle, labelStyle, gridTwo, addButtonStyle, removeButtonStyle } from "../../lib/constants/resume-styles";
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ ...sectionTitle, marginBottom: 0 }}>Education</h2>
                {isEditing && (
                    <button onClick={onAdd} style={addButtonStyle}>
                        + Add Degree
                    </button>
                )}
            </div>

            {education.length === 0 && (
                <p style={{ color: "#555", fontSize: 14, textAlign: "center", padding: "24px 0" }}>
                    Nenhuma formação adicionada ainda.
                </p>
            )}

            {education.map((edu, i) => (
                <div key={i} style={{ background: "#1C2333", borderRadius: 8, padding: 16, marginBottom: 12 }}>
                    {isEditing && (
                        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
                            <button onClick={() => onRemove(i)} style={removeButtonStyle}>Remover</button>
                        </div>
                    )}
                    <div style={gridTwo}>
                        <div>
                            <label style={labelStyle}>Instituição</label>
                            <input value={edu.nameOfInstitution} onChange={(e) => onChange(i, "nameOfInstitution", e.target.value)} onClick={onUnlock} readOnly={frozen} style={inputStyle(false, frozen)} placeholder="Nome da instituição" />
                        </div>
                        <div>
                            <label style={labelStyle}>Curso</label>
                            <input value={edu.nameOfGraduation} onChange={(e) => onChange(i, "nameOfGraduation", e.target.value)} onClick={onUnlock} readOnly={frozen} style={inputStyle(false, frozen)} placeholder="Nome do curso" />
                        </div>
                        <div>
                            <label style={labelStyle}>Data de início</label>
                            <input type={isEditing ? "month" : "text"} value={edu.StartDateOfGraduation} onChange={(e) => onChange(i, "StartDateOfGraduation", e.target.value)} onClick={onUnlock} readOnly={frozen} style={inputStyle(false, frozen)} />
                        </div>
                        <div>
                            <label style={labelStyle}>Data de conclusão</label>
                            <input type={isEditing ? "month" : "text"} value={edu.EndDateOfGraduation} onChange={(e) => onChange(i, "EndDateOfGraduation", e.target.value)} onClick={onUnlock} readOnly={frozen} style={inputStyle(false, frozen)} />
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
}
