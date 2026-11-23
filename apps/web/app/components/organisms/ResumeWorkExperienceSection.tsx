"use client";

import { Trash2 } from "lucide-react";
import { inputStyle, sectionStyle, sectionTitle, labelStyle, gridTwoClass, addButtonStyle, addButtonClass, removeButtonStyle, sectionHeaderClass, itemCardClass } from "../../lib/constants/resume-styles";
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
            <div className={sectionHeaderClass}>
                <h2 style={{ ...sectionTitle, marginBottom: 0 }}>Experiência profissional</h2>
                {isEditing && (
                    <button type="button" onClick={onAdd} style={addButtonStyle} className={addButtonClass}>
                        + Adicionar experiência
                    </button>
                )}
            </div>

            {experience.length === 0 && (
                <p style={{ color: "rgb(var(--c-slate-600))", fontSize: 14, textAlign: "center", padding: "24px 0" }}>
                    Nenhuma experiência adicionada ainda.
                </p>
            )}

            {experience.map((exp, i) => (
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
                        {/* celular: início/término lado a lado; sm:contents devolve cada data à grade do desktop */}
                        <div className="col-span-full grid grid-cols-2 gap-2 sm:contents">
                        <div className="min-w-0">
                            <label style={labelStyle}>Data de início</label>
                            <MonthYearPicker
                                value={exp.jobStartDate}
                                onChange={(v) => onChange(i, "jobStartDate", v)}
                                onOpen={onUnlock}
                                readOnly={frozen}
                            />
                        </div>
                        <div className="min-w-0">
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
                        </div>
                        {isEditing && (
                            <div className="flex items-center gap-2 sm:pt-6">
                                <input
                                    type="checkbox"
                                    id={`current-${i}`}
                                    checked={exp.isActualJob}
                                    onChange={(e) => onChange(i, "isActualJob", e.target.checked)}
                                />
                                <label htmlFor={`current-${i}`} className="max-sm:flex-1 max-sm:py-3" style={{ fontSize: 13, color: "rgb(var(--c-slate-300))", cursor: "pointer" }}>
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
