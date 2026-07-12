"use client";

import { inputStyle, sectionStyle, sectionTitle, labelStyle, gridTwo, addButtonStyle, removeButtonStyle } from "../../lib/constants/resume-styles";
import { MonthYearPicker } from "../molecules/MonthYearPicker";
import type { ResumeFormExperience } from "../../types/resume-form";

export function ResumeWorkExperienceSection({
    experience,
    isEditing = true,
    onChange,
    onAdd,
    onRemove,
    onUnlock,
}: {
    experience: ResumeFormExperience[];
    isEditing?: boolean;
    onChange: (index: number, field: string, value: string | boolean) => void;
    onAdd: () => void;
    onRemove: (index: number) => void;
    onUnlock?: () => void;
}) {
    const frozen = !isEditing;

    return (
        <section style={sectionStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ ...sectionTitle, marginBottom: 0 }}>Work Experience</h2>
                {isEditing && (
                    <button onClick={onAdd} style={addButtonStyle}>
                        + Add Position
                    </button>
                )}
            </div>

            {experience.length === 0 && (
                <p style={{ color: "#555", fontSize: 14, textAlign: "center", padding: "24px 0" }}>
                    Nenhuma experiência adicionada ainda.
                </p>
            )}

            {experience.map((exp, i) => (
                <div key={i} style={{ background: "#1C2333", borderRadius: 8, padding: 16, marginBottom: 12 }}>
                    {isEditing && (
                        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
                            <button onClick={() => onRemove(i)} style={removeButtonStyle}>Remover</button>
                        </div>
                    )}
                    <div style={gridTwo}>
                        <div>
                            <label style={labelStyle}>Empresa</label>
                            <input value={exp.companyName} onChange={(e) => onChange(i, "companyName", e.target.value)} onClick={onUnlock} readOnly={frozen} style={inputStyle(false, frozen)} placeholder="Nome da empresa" />
                        </div>
                        <div>
                            <label style={labelStyle}>Área de atuação</label>
                            <input value={exp.jobArea} onChange={(e) => onChange(i, "jobArea", e.target.value)} onClick={onUnlock} readOnly={frozen} style={inputStyle(false, frozen)} placeholder="Ex: Tecnologia" />
                        </div>
                        <div>
                            <label style={labelStyle}>Tipo de contrato</label>
                            <input value={exp.jobType} onChange={(e) => onChange(i, "jobType", e.target.value)} onClick={onUnlock} readOnly={frozen} style={inputStyle(false, frozen)} placeholder="Ex: CLT, PJ" />
                        </div>
                        <div>
                            <label style={labelStyle}>Data de início</label>
                            <MonthYearPicker
                                value={exp.jobStartDate}
                                onChange={(v) => onChange(i, "jobStartDate", v)}
                                onOpen={onUnlock}
                                readOnly={frozen}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Data de término</label>
                            <MonthYearPicker
                                value={exp.jobEndDate}
                                onChange={(v) => onChange(i, "jobEndDate", v)}
                                onOpen={onUnlock}
                                readOnly={frozen}
                                disabled={exp.isActualJob}
                                placeholder={exp.isActualJob ? "Atual" : "Selecione mês e ano"}
                            />
                        </div>
                        {isEditing && (
                            <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 24 }}>
                                <input
                                    type="checkbox"
                                    id={`current-${i}`}
                                    checked={exp.isActualJob}
                                    onChange={(e) => onChange(i, "isActualJob", e.target.checked)}
                                />
                                <label htmlFor={`current-${i}`} style={{ fontSize: 13, color: "#aaa", cursor: "pointer" }}>
                                    Emprego atual
                                </label>
                            </div>
                        )}
                        <div style={{ gridColumn: "1 / -1" }}>
                            <label style={labelStyle}>Descrição das atividades</label>
                            <textarea
                                value={exp.description}
                                onChange={(e) => onChange(i, "description", e.target.value)}
                                onClick={onUnlock}
                                readOnly={frozen}
                                rows={3}
                                style={{ ...inputStyle(false, frozen), resize: "vertical" }}
                                placeholder="Descreva suas principais atividades..."
                            />
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
}
