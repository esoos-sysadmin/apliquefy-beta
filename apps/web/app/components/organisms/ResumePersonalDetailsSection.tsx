"use client";

import { inputStyle, sectionStyle, sectionTitle, labelStyle, gridTwo, errorStyle } from "../../lib/constants/resume-styles";
import { seniorityOptions } from "../../lib/constants/resume-form";
import type { ResumeFormPersonalInfo } from "../../types/resume-form";

export function ResumePersonalDetailsSection({
    personalInfo,
    errors,
    isEditing = true,
    onChange,
    onUnlock,
}: {
    personalInfo: ResumeFormPersonalInfo;
    errors: Record<string, string>;
    isEditing?: boolean;
    onChange: (field: string, value: string) => void;
    onUnlock?: () => void;
}) {
    const frozen = !isEditing;

    return (
        <section style={sectionStyle}>
            <h2 style={sectionTitle}>Personal Details</h2>
            <div style={gridTwo}>
                <div>
                    <label style={labelStyle}>Full Name *</label>
                    <input
                        value={personalInfo.name}
                        onChange={(e) => onChange("name", e.target.value)}
                        onClick={onUnlock}
                        readOnly={frozen}
                        style={inputStyle(!!errors.name, frozen)}
                        placeholder="Seu nome completo"
                    />
                    {errors.name && <span style={errorStyle}>{errors.name}</span>}
                </div>

                <div>
                    <label style={labelStyle}>Professional Headline *</label>
                    <input
                        value={personalInfo.jobTitle}
                        onChange={(e) => onChange("jobTitle", e.target.value)}
                        onClick={onUnlock}
                        readOnly={frozen}
                        style={inputStyle(!!errors.jobTitle, frozen)}
                        placeholder="Ex: Senior Frontend Engineer"
                    />
                    {errors.jobTitle && <span style={errorStyle}>{errors.jobTitle}</span>}
                </div>

                <div>
                    <label style={labelStyle}>Email Address *</label>
                    <input
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) => onChange("email", e.target.value)}
                        onClick={onUnlock}
                        readOnly={frozen}
                        style={inputStyle(!!errors.email, frozen)}
                        placeholder="seu@email.com"
                    />
                    {errors.email && <span style={errorStyle}>{errors.email}</span>}
                </div>

                <div>
                    <label style={labelStyle}>Phone Number *</label>
                    <input
                        value={personalInfo.contact}
                        onChange={(e) => onChange("contact", e.target.value)}
                        onClick={onUnlock}
                        readOnly={frozen}
                        style={inputStyle(!!errors.contact, frozen)}
                        placeholder="(11) 99999-9999"
                    />
                    {errors.contact && <span style={errorStyle}>{errors.contact}</span>}
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Endereço residencial</label>
                    <input
                        value={personalInfo.address}
                        onChange={(e) => onChange("address", e.target.value)}
                        onClick={onUnlock}
                        readOnly={frozen}
                        style={inputStyle(false, frozen)}
                        placeholder="Rua, número, cidade - Estado"
                    />
                </div>

                <div>
                    <label style={labelStyle}>Salário Desejado</label>
                    <input
                        value={personalInfo.desiredSalary}
                        onChange={(e) => onChange("desiredSalary", e.target.value)}
                        onClick={onUnlock}
                        readOnly={frozen}
                        style={inputStyle(false, frozen)}
                        placeholder="Ex: R$ 8.000 / mês"
                    />
                </div>

                <div>
                    <label style={labelStyle}>Nível de Senioridade atual</label>
                    <select
                        value={personalInfo.seniority}
                        onChange={(e) => onChange("seniority", e.target.value)}
                        onClick={onUnlock}
                        disabled={frozen}
                        style={{ ...inputStyle(false, frozen), appearance: "none" }}
                    >
                        <option value="">Selecione...</option>
                        {seniorityOptions.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label style={labelStyle}>LinkedIn URL</label>
                    <input
                        value={personalInfo.linkedinUrl}
                        onChange={(e) => onChange("linkedinUrl", e.target.value)}
                        onClick={onUnlock}
                        readOnly={frozen}
                        style={inputStyle(false, frozen)}
                        placeholder="linkedin.com/in/seuperfil"
                    />
                </div>

                <div>
                    <label style={labelStyle}>Portfolio URL</label>
                    <input
                        value={personalInfo.portfolio}
                        onChange={(e) => onChange("portfolio", e.target.value)}
                        onClick={onUnlock}
                        readOnly={frozen}
                        style={inputStyle(false, frozen)}
                        placeholder="https://seusite.com"
                    />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Professional Summary</label>
                    <textarea
                        value={personalInfo.professionalSummary}
                        onChange={(e) => onChange("professionalSummary", e.target.value)}
                        onClick={onUnlock}
                        readOnly={frozen}
                        maxLength={500}
                        rows={4}
                        style={{ ...inputStyle(false, frozen), resize: "vertical" }}
                        placeholder="Descreva sua experiência profissional resumidamente..."
                    />
                    <p style={{ textAlign: "right", fontSize: 12, color: "#666", margin: "4px 0 0" }}>
                        {personalInfo.professionalSummary.length}/500 characters
                    </p>
                </div>
            </div>
        </section>
    );
}
