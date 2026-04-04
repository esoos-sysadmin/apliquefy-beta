"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Experience = {
    companyName: string;
    jobType: string;
    description: string;
    jobArea: string;
    jobStartDate: string;
    jobEndDate: string;
    isActualJob: boolean;
};

type Education = {
    nameOfInstitution: string;
    nameOfGraduation: string;
    StartDateOfGraduation: string;
    EndDateOfGraduation: string;
};

type Idiom = {
    language: string;
    level: "Básico" | "Intermediário" | "Avançado" | "Fluente" | "Nativo" | "";
};

type FormData = {
    title: string;
    personalInfo: {
        name: string;
        jobTitle: string;
        email: string;
        contact: string;
        address: string;
        desiredSalary: string;
        seniority: string;
        linkedinUrl: string;
        portfolio: string;
        github: string;
        professionalSummary: string;
    };
    experience: Experience[];
    skills: string[];
    education: Education[];
    idioms: Idiom[];
};

const emptyExperience: Experience = {
    companyName: "",
    jobType: "",
    description: "",
    jobArea: "",
    jobStartDate: "",
    jobEndDate: "",
    isActualJob: false,
};

const emptyEducation: Education = {
    nameOfInstitution: "",
    nameOfGraduation: "",
    StartDateOfGraduation: "",
    EndDateOfGraduation: "",
};

const emptyIdiom: Idiom = { language: "", level: "" };

function formatPhone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function NovoResumePage() {
    const router = useRouter();

    const [form, setForm] = useState<FormData>({
        title: "",
        personalInfo: {
            name: "",
            jobTitle: "",
            email: "",
            contact: "",
            address: "",
            desiredSalary: "",
            seniority: "",
            linkedinUrl: "",
            portfolio: "",
            github: "",
            professionalSummary: "",
        },
        experience: [],
        skills: [],
        education: [],
        idioms: [],
    });

    const [skillInput, setSkillInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [popup, setPopup] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // ── Progress calculation ─────────────────────────────────────────────────
    const calcProgress = () => {
        const p = form.personalInfo;
        const fields = [
            p.name, p.jobTitle, p.email, p.contact,
            p.address, p.desiredSalary, p.seniority,
            p.linkedinUrl, p.portfolio, p.professionalSummary,
        ];
        const filledPersonal = fields.filter(Boolean).length;
        const hasExperience = form.experience.length > 0 ? 1 : 0;
        const hasEducation = form.education.length > 0 ? 1 : 0;
        const hasSkills = form.skills.length > 0 ? 1 : 0;
        const total = filledPersonal + hasExperience + hasEducation + hasSkills;
        const max = fields.length + 3;
        return Math.round((total / max) * 100);
    };

    const progress = calcProgress();

    // ── Helpers ──────────────────────────────────────────────────────────────
    const setPersonal = (field: string, value: string) => {
        setForm(f => ({ ...f, personalInfo: { ...f.personalInfo, [field]: value } }));
    };

    const setExp = (index: number, field: string, value: string | boolean) => {
        setForm(f => {
            const exp = [...f.experience];
            exp[index] = { ...exp[index], [field]: value };
            return { ...f, experience: exp };
        });
    };

    const setEdu = (index: number, field: string, value: string) => {
        setForm(f => {
            const edu = [...f.education];
            edu[index] = { ...edu[index], [field]: value };
            return { ...f, education: edu };
        });
    };

    const setIdiom = (index: number, field: string, value: string) => {
        setForm(f => {
            const idioms = [...f.idioms];
            idioms[index] = { ...idioms[index], [field]: value };
            return { ...f, idioms };
        });
    };

    const addSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && skillInput.trim()) {
            e.preventDefault();
            if (!form.skills.includes(skillInput.trim())) {
                setForm(f => ({ ...f, skills: [...f.skills, skillInput.trim()] }));
            }
            setSkillInput("");
        }
    };

    const removeSkill = (skill: string) => {
        setForm(f => ({ ...f, skills: f.skills.filter(s => s !== skill) }));
    };

    // ── Validation ───────────────────────────────────────────────────────────
    const validate = () => {
        const errs: Record<string, string> = {};
        if (!form.title.trim()) errs.title = "O título do currículo é obrigatório";
        if (!form.personalInfo.name || form.personalInfo.name.length < 3) errs.name = "O nome deve ter ao menos 3 letras";
        if (!form.personalInfo.jobTitle || form.personalInfo.jobTitle.length < 3) errs.jobTitle = "O cargo deve ter ao menos 3 letras";
        if (!form.personalInfo.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.personalInfo.email)) errs.email = "Formato de e-mail inválido";
        if (!form.personalInfo.contact || form.personalInfo.contact.replace(/\D/g, "").length < 8) errs.contact = "Digite um número de contato válido com DDD";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    // ── Submit ───────────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const body = {
                title: form.title,
                personalInfo: form.personalInfo,
                experience: form.experience,
                skills: form.skills,
                education: form.education,
                idioms: form.idioms.filter(i => i.language && i.level),
            };

            const res = await fetch("/api/resumes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                setPopup({ type: "error", message: data.message ?? "Erro ao criar currículo" });
            } else {
                setPopup({ type: "success", message: "Currículo criado com sucesso!" });
            }
        } catch {
            setPopup({ type: "error", message: "Falha de comunicação com o servidor" });
        } finally {
            setLoading(false);
        }
    };

    const handleClosePopup = () => {
        if (popup?.type === "success") {
            router.push("/curriculos");
        }
        setPopup(null);
    };

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <div style={{ minHeight: "100vh", color: "#fff", fontFamily: "sans-serif" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>

            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>Resume Profile</h1>
                <p style={{ color: "#64748b", marginTop: 6, fontSize: 15 }}>Manage your structured data for automated applications.</p>
            </div>

            {/* Title */}
            <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, color: "#94a3b8", marginBottom: 8, fontWeight: 500 }}>Título do Currículo *</label>
                <input
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Ex: Currículo Dev Full Stack"
                    style={inputStyle(!!errors.title)}
                />
                {errors.title && <span style={errorStyle}>{errors.title}</span>}
            </div>

            {/* Progress Bar */}
            <div style={{ background: "#161C27", borderRadius: 12, padding: 20, marginBottom: 24, border: "1px solid #1C2333" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <div>
                        <p style={{ margin: 0, fontWeight: 600 }}>Profile Completeness</p>
                        {progress < 90 && (
                            <p style={{ margin: 0, fontSize: 12, color: "#888" }}>
                                Add {Math.ceil((90 - progress) / 7)} more fields to reach 90%
                            </p>
                        )}
                    </div>
                    <span style={{ fontSize: 22, fontWeight: 700, color: "#3b82f6" }}>{progress}%</span>
                </div>
                <div style={{ background: "#1C2333", borderRadius: 99, height: 8 }}>
                    <div style={{ width: `${progress}%`, background: "#3b82f6", borderRadius: 99, height: 8, transition: "width 0.3s" }} />
                </div>
            </div>

            {/* Personal Details */}
            <section style={sectionStyle}>
                <h2 style={sectionTitle}>Personal Details</h2>
                <div style={gridTwo}>
                    <div>
                        <label style={labelStyle}>Full Name *</label>
                        <input value={form.personalInfo.name} onChange={e => setPersonal("name", e.target.value)} style={inputStyle(!!errors.name)} placeholder="Seu nome completo" />
                        {errors.name && <span style={errorStyle}>{errors.name}</span>}
                    </div>
                    <div>
                        <label style={labelStyle}>Professional Headline *</label>
                        <input value={form.personalInfo.jobTitle} onChange={e => setPersonal("jobTitle", e.target.value)} style={inputStyle(!!errors.jobTitle)} placeholder="Ex: Senior Frontend Engineer" />
                        {errors.jobTitle && <span style={errorStyle}>{errors.jobTitle}</span>}
                    </div>
                    <div>
                        <label style={labelStyle}>Email Address *</label>
                        <input type="email" value={form.personalInfo.email} onChange={e => setPersonal("email", e.target.value)} style={inputStyle(!!errors.email)} placeholder="seu@email.com" />
                        {errors.email && <span style={errorStyle}>{errors.email}</span>}
                    </div>
                    <div>
                        <label style={labelStyle}>Phone Number *</label>
                        <input
                            value={form.personalInfo.contact}
                            onChange={e => setPersonal("contact", formatPhone(e.target.value))}
                            style={inputStyle(!!errors.contact)}
                            placeholder="(11) 99999-9999"
                        />
                        {errors.contact && <span style={errorStyle}>{errors.contact}</span>}
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                        <label style={labelStyle}>Endereço residencial</label>
                        <input value={form.personalInfo.address} onChange={e => setPersonal("address", e.target.value)} style={inputStyle()} placeholder="Rua, número, cidade - Estado" />
                    </div>
                    <div>
                        <label style={labelStyle}>Salário Desejado</label>
                        <input value={form.personalInfo.desiredSalary} onChange={e => setPersonal("desiredSalary", e.target.value)} style={inputStyle()} placeholder="Ex: R$ 8.000 / mês" />
                    </div>
                    <div>
                        <label style={labelStyle}>Nível de Senioridade atual</label>
                        <select value={form.personalInfo.seniority} onChange={e => setPersonal("seniority", e.target.value)} style={{ ...inputStyle(), appearance: "none" }}>
                            <option value="">Selecione...</option>
                            {["Estagiário", "Júnior", "Pleno", "Sênior", "Especialista", "Gerente", "Diretor"].map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>LinkedIn URL</label>
                        <input value={form.personalInfo.linkedinUrl} onChange={e => setPersonal("linkedinUrl", e.target.value)} style={inputStyle()} placeholder="linkedin.com/in/seuperfil" />
                    </div>
                    <div>
                        <label style={labelStyle}>Portfolio URL</label>
                        <input value={form.personalInfo.portfolio} onChange={e => setPersonal("portfolio", e.target.value)} style={inputStyle()} placeholder="https://seusite.com" />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                        <label style={labelStyle}>Professional Summary</label>
                        <textarea
                            value={form.personalInfo.professionalSummary}
                            onChange={e => setPersonal("professionalSummary", e.target.value)}
                            maxLength={500}
                            rows={4}
                            style={{ ...inputStyle(), resize: "vertical" }}
                            placeholder="Descreva sua experiência profissional resumidamente..."
                        />
                        <p style={{ textAlign: "right", fontSize: 12, color: "#666", margin: "4px 0 0" }}>
                            {form.personalInfo.professionalSummary.length}/500 characters
                        </p>
                    </div>
                </div>
            </section>

            {/* Work Experience */}
            <section style={sectionStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h2 style={{ ...sectionTitle, marginBottom: 0 }}>Work Experience</h2>
                    <button onClick={() => setForm(f => ({ ...f, experience: [...f.experience, { ...emptyExperience }] }))} style={addButtonStyle}>
                        + Add Position
                    </button>
                </div>
                {form.experience.length === 0 && (
                    <p style={{ color: "#555", fontSize: 14, textAlign: "center", padding: "24px 0" }}>Nenhuma experiência adicionada ainda.</p>
                )}
                {form.experience.map((exp, i) => (
                    <div key={i} style={{ background: "#1C2333", borderRadius: 8, padding: 16, marginBottom: 12 }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
                            <button onClick={() => setForm(f => ({ ...f, experience: f.experience.filter((_, idx) => idx !== i) }))} style={removeButtonStyle}>Remover</button>
                        </div>
                        <div style={gridTwo}>
                            <div>
                                <label style={labelStyle}>Empresa</label>
                                <input value={exp.companyName} onChange={e => setExp(i, "companyName", e.target.value)} style={inputStyle()} placeholder="Nome da empresa" />
                            </div>
                            <div>
                                <label style={labelStyle}>Área de atuação</label>
                                <input value={exp.jobArea} onChange={e => setExp(i, "jobArea", e.target.value)} style={inputStyle()} placeholder="Ex: Tecnologia" />
                            </div>
                            <div>
                                <label style={labelStyle}>Tipo de contrato</label>
                                <input value={exp.jobType} onChange={e => setExp(i, "jobType", e.target.value)} style={inputStyle()} placeholder="Ex: CLT, PJ" />
                            </div>
                            <div>
                                <label style={labelStyle}>Data de início</label>
                                <input type="month" value={exp.jobStartDate} onChange={e => setExp(i, "jobStartDate", e.target.value)} style={inputStyle()} />
                            </div>
                            <div>
                                <label style={labelStyle}>Data de término</label>
                                <input type="month" value={exp.jobEndDate} onChange={e => setExp(i, "jobEndDate", e.target.value)} disabled={exp.isActualJob} style={{ ...inputStyle(), opacity: exp.isActualJob ? 0.4 : 1 }} />
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 24 }}>
                                <input type="checkbox" id={`current-${i}`} checked={exp.isActualJob} onChange={e => setExp(i, "isActualJob", e.target.checked)} />
                                <label htmlFor={`current-${i}`} style={{ fontSize: 13, color: "#aaa", cursor: "pointer" }}>Emprego atual</label>
                            </div>
                            <div style={{ gridColumn: "1 / -1" }}>
                                <label style={labelStyle}>Descrição das atividades</label>
                                <textarea value={exp.description} onChange={e => setExp(i, "description", e.target.value)} rows={3} style={{ ...inputStyle(), resize: "vertical" }} placeholder="Descreva suas principais atividades..." />
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Skills */}
            <section style={sectionStyle}>
                <h2 style={sectionTitle}>Skills</h2>
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#1C2333", borderRadius: 8, padding: "8px 12px", marginBottom: 12 }}>
                    <span style={{ color: "#555" }}>🔍</span>
                    <input
                        value={skillInput}
                        onChange={e => setSkillInput(e.target.value)}
                        onKeyDown={addSkill}
                        placeholder="Type a skill and press Enter (e.g. JavaScript)"
                        style={{ background: "transparent", border: "none", outline: "none", color: "#fff", flex: 1, fontSize: 14 }}
                    />
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {form.skills.map(skill => (
                        <span key={skill} style={{ background: "#1C2B46", color: "#3B82F6", borderRadius: 99, padding: "4px 12px", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                            {skill}
                            <button onClick={() => removeSkill(skill)} style={{ background: "none", border: "none", color: "#60a5fa", cursor: "pointer", fontSize: 14, padding: 0, lineHeight: 1 }}>×</button>
                        </span>
                    ))}
                </div>
            </section>

            {/* Education */}
            <section style={sectionStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h2 style={{ ...sectionTitle, marginBottom: 0 }}>Education</h2>
                    <button onClick={() => setForm(f => ({ ...f, education: [...f.education, { ...emptyEducation }] }))} style={addButtonStyle}>
                        + Add Degree
                    </button>
                </div>
                {form.education.length === 0 && (
                    <p style={{ color: "#555", fontSize: 14, textAlign: "center", padding: "24px 0" }}>Nenhuma formação adicionada ainda.</p>
                )}
                {form.education.map((edu, i) => (
                    <div key={i} style={{ background: "#1C2333", borderRadius: 8, padding: 16, marginBottom: 12 }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
                            <button onClick={() => setForm(f => ({ ...f, education: f.education.filter((_, idx) => idx !== i) }))} style={removeButtonStyle}>Remover</button>
                        </div>
                        <div style={gridTwo}>
                            <div>
                                <label style={labelStyle}>Instituição</label>
                                <input value={edu.nameOfInstitution} onChange={e => setEdu(i, "nameOfInstitution", e.target.value)} style={inputStyle()} placeholder="Nome da instituição" />
                            </div>
                            <div>
                                <label style={labelStyle}>Curso</label>
                                <input value={edu.nameOfGraduation} onChange={e => setEdu(i, "nameOfGraduation", e.target.value)} style={inputStyle()} placeholder="Nome do curso" />
                            </div>
                            <div>
                                <label style={labelStyle}>Data de início</label>
                                <input type="month" value={edu.StartDateOfGraduation} onChange={e => setEdu(i, "StartDateOfGraduation", e.target.value)} style={inputStyle()} />
                            </div>
                            <div>
                                <label style={labelStyle}>Data de conclusão</label>
                                <input type="month" value={edu.EndDateOfGraduation} onChange={e => setEdu(i, "EndDateOfGraduation", e.target.value)} style={inputStyle()} />
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Idioms */}
            <section style={sectionStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h2 style={{ ...sectionTitle, marginBottom: 0 }}>Idiomas</h2>
                    <button onClick={() => setForm(f => ({ ...f, idioms: [...f.idioms, { ...emptyIdiom }] }))} style={addButtonStyle}>
                        + Add Idioma
                    </button>
                </div>
                {form.idioms.map((idiom, i) => (
                    <div key={i} style={{ background: "#1C2333", borderRadius: 8, padding: 16, marginBottom: 12 }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
                            <button onClick={() => setForm(f => ({ ...f, idioms: f.idioms.filter((_, idx) => idx !== i) }))} style={removeButtonStyle}>Remover</button>
                        </div>
                        <div style={gridTwo}>
                            <div>
                                <label style={labelStyle}>Idioma</label>
                                <input value={idiom.language} onChange={e => setIdiom(i, "language", e.target.value)} style={inputStyle()} placeholder="Ex: Inglês" />
                            </div>
                            <div>
                                <label style={labelStyle}>Nível</label>
                                <select value={idiom.level} onChange={e => setIdiom(i, "level", e.target.value)} style={{ ...inputStyle(), appearance: "none" }}>
                                    <option value="">Selecione...</option>
                                    {["Básico", "Intermediário", "Avançado", "Fluente", "Nativo"].map(l => (
                                        <option key={l} value={l}>{l}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Save Changes Bottom */}
            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 8, paddingBottom: 32 }}>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: 44,
                        background: "#2563EB",
                        color: "#fff",
                        border: "none",
                        borderRadius: 12,
                        padding: "0 20px",
                        fontWeight: 600,
                        fontSize: 14,
                        boxShadow: "0 10px 30px rgba(37,99,235,0.28)",
                        cursor: loading ? "not-allowed" : "pointer",
                        opacity: loading ? 0.7 : 1,
                        transition: "background 0.2s ease, opacity 0.2s ease",
                    }}
                >
                    {loading ? "Salvando..." : "Save Changes"}
                </button>
            </div>

            {/* Popup */}
            {popup && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
                    <div style={{ background: "#161C27", borderRadius: 12, padding: 32, maxWidth: 400, width: "90%", textAlign: "center", border: `1px solid ${popup.type === "success" ? "#22c55e" : "#ef4444"}` }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>{popup.type === "success" ? "✅" : "❌"}</div>
                        <h3 style={{ margin: "0 0 8px", fontSize: 18 }}>{popup.type === "success" ? "Sucesso!" : "Erro"}</h3>
                        <p style={{ color: "#aaa", margin: "0 0 24px", fontSize: 14 }}>{popup.message}</p>
                        <button onClick={handleClosePopup} style={{ background: popup.type === "success" ? "#22c55e" : "#ef4444", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 600, cursor: "pointer", width: "100%" }}>
                            {popup.type === "success" ? "Ver meus currículos" : "Fechar"}
                        </button>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const inputStyle = (hasError = false): React.CSSProperties => ({
    width: "100%",
    background: "#1C2333",
    border: `1px solid ${hasError ? "#ef4444" : "#1C2B46"}`,
    borderRadius: 8,
    padding: "10px 12px",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
});

const sectionStyle: React.CSSProperties = {
    background: "#161C27",
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
    border: "1px solid #1C2333",
};

const sectionTitle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 20,
    color: "#60a5fa",
};

const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    color: "#94a3b8",
    marginBottom: 8,
    fontWeight: 500,
    letterSpacing: "0.03em",
};

const gridTwo: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
};

const errorStyle: React.CSSProperties = {
    display: "block",
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
};

const addButtonStyle: React.CSSProperties = {
    background: "transparent",
    border: "1px solid #3b82f6",
    color: "#3b82f6",
    borderRadius: 8,
    padding: "6px 14px",
    fontSize: 13,
    cursor: "pointer",
    fontWeight: 600,
};

const removeButtonStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    color: "#ef4444",
    fontSize: 12,
    cursor: "pointer",
};
