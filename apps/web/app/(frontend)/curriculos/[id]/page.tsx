"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useResume, useResumes } from "../../../hooks/use-resumes";
import { emptyResumeForm, emptyExperience, emptyEducation, emptyIdiom } from "../../../lib/constants/resume-form";
import { formatPhone } from "../../../lib/helpers/resume";
import { ResumeFormPopup } from "../../../components/molecules/ResumeFormPopup";
import { ResumePersonalDetailsSection } from "../../../components/organisms/ResumePersonalDetailsSection";
import { ResumeWorkExperienceSection } from "../../../components/organisms/ResumeWorkExperienceSection";
import { ResumeSkillsSection } from "../../../components/organisms/ResumeSkillsSection";
import { ResumeEducationSection } from "../../../components/organisms/ResumeEducationSection";
import { ResumeIdiomsSection } from "../../../components/organisms/ResumeIdiomsSection";
import { inputStyle, errorStyle } from "../../../lib/constants/resume-styles";
import type { ResumeFormData } from "../../../types/resume-form";

const unlockButtonStyle: React.CSSProperties = {
    height: 40,
    background: "transparent",
    border: "1px solid #3b82f6",
    color: "#3b82f6",
    borderRadius: 10,
    padding: "0 16px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
};

export default function EditResumePage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { data: resume, isLoading: resumeLoading, error: resumeError } = useResume(id);
    const { updateResume } = useResumes();

    const [form, setForm] = useState<ResumeFormData>(emptyResumeForm);

    function toMonthInput(value: unknown): string {
        if (!value) return "";
        const str = typeof value === "string" ? value : String(value);
        // já está no formato yyyy-MM
        if (/^\d{4}-\d{2}$/.test(str)) return str;
        // ISO string ou yyyy-MM-dd → pega só yyyy-MM
        const match = str.match(/^(\d{4}-\d{2})/);
        return match ? match[1] : "";
    }
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [popup, setPopup] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!resume) return;

        const experience = (resume.experience ?? []).map((item) => ({
            companyName: item.companyName ?? item.company ?? "",
            jobType: item.jobType ?? item.position ?? "",
            description: item.description ?? "",
            jobArea: item.jobArea ?? "",
            jobStartDate: toMonthInput(item.jobStartDate ?? item.startDate),
            jobEndDate: toMonthInput(item.jobEndDate ?? item.endDate),
            isActualJob: item.isActualJob ?? item.current ?? false,
        }));

        const education = (resume.education ?? []).map((item) => ({
            nameOfInstitution: item.nameOfInstitution ?? item.institution ?? "",
            nameOfGraduation: item.nameOfGraduation ?? item.degree ?? "",
            StartDateOfGraduation: toMonthInput(item.StartDateOfGraduation ?? item.startDate),
            EndDateOfGraduation: toMonthInput(item.EndDateOfGraduation ?? item.endDate),
        }));

        const idioms = (resume.idioms ?? []).map((item) => ({
            language: item.language ?? "",
            level: item.level ?? "" as ResumeFormData["idioms"][number]["level"],
        }));

        setForm({
            title: resume.title ?? "",
            personalInfo: {
                name: resume.personalInfo?.name ?? "",
                jobTitle: resume.personalInfo?.jobTitle ?? "",
                email: resume.personalInfo?.email ?? "",
                contact: resume.personalInfo?.contact ?? resume.personalInfo?.phone ?? "",
                address: resume.personalInfo?.address ?? resume.personalInfo?.location ?? "",
                desiredSalary: resume.personalInfo?.desiredSalary ?? "",
                seniority: resume.personalInfo?.seniority ?? "",
                linkedinUrl: resume.personalInfo?.linkedinUrl ?? resume.personalInfo?.linkedin ?? "",
                portfolio: resume.personalInfo?.portfolio ?? "",
                github: resume.personalInfo?.github ?? "",
                professionalSummary: resume.personalInfo?.professionalSummary ?? resume.personalInfo?.summary ?? "",
            },
            experience,
            skills: resume.skills ?? [],
            education,
            idioms,
        });
        setFetching(false);
    }, [resume]);

    useEffect(() => {
        if (resumeError) {
            setPopup({ type: "error", message: "Erro ao carregar currículo" });
            setFetching(false);
        }
    }, [resumeError]);

    useEffect(() => {
        setFetching(resumeLoading);
    }, [resumeLoading]);

    const unlock = () => { if (!isEditing) setIsEditing(true); };

    function setPersonal(field: string, value: string) {
        setForm((f) => ({
            ...f,
            personalInfo: {
                ...f.personalInfo,
                [field]: field === "contact" ? formatPhone(value) : value,
            },
        }));
    }

    function setExp(index: number, field: string, value: string | boolean) {
        setForm((f) => {
            const exp = [...f.experience];
            exp[index] = { ...exp[index], [field]: value } as typeof exp[number];
            return { ...f, experience: exp };
        });
    }

    function setEdu(index: number, field: string, value: string) {
        setForm((f) => {
            const edu = [...f.education];
            edu[index] = { ...edu[index], [field]: value } as typeof edu[number];
            return { ...f, education: edu };
        });
    }

    function setIdiom(index: number, field: string, value: string) {
        setForm((f) => {
            const idioms = [...f.idioms];
            idioms[index] = { ...idioms[index], [field]: value } as typeof idioms[number];
            return { ...f, idioms };
        });
    }

    function validate() {
        const errs: Record<string, string> = {};
        if (!form.title.trim()) errs.title = "O título do currículo é obrigatório";
        if (!form.personalInfo.name || form.personalInfo.name.length < 3) errs.name = "O nome deve ter ao menos 3 letras";
        if (!form.personalInfo.jobTitle || form.personalInfo.jobTitle.length < 3) errs.jobTitle = "O cargo deve ter ao menos 3 letras";
        if (!form.personalInfo.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.personalInfo.email)) errs.email = "Formato de e-mail inválido";
        if (!form.personalInfo.contact || form.personalInfo.contact.replace(/\D/g, "").length < 8) errs.contact = "Digite um número de contato válido com DDD";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    }

    async function handleSubmit() {
        if (!validate()) return;

        setLoading(true);
        try {
            await updateResume(id, {
                title: form.title,
                personalInfo: form.personalInfo,
                experience: form.experience,
                skills: form.skills,
                education: form.education,
                idioms: form.idioms.filter((i) => i.language && i.level),
            });
            setIsEditing(false);
            setPopup({ type: "success", message: "Currículo atualizado com sucesso!" });
        } catch {
            setPopup({ type: "error", message: "Falha de comunicação com o servidor" });
        } finally {
            setLoading(false);
        }
    }

    function handleClosePopup() {
        if (popup?.type === "success") router.push("/curriculos");
        setPopup(null);
    }

    if (fetching) {
        return (
            <div style={{ minHeight: "100vh", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
                <p style={{ color: "#888" }}>Carregando currículo...</p>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", color: "#fff", fontFamily: "sans-serif" }}>
            <div style={{ maxWidth: 1152, margin: "0 auto" }}>
                <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                        <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>Editar Currículo</h1>
                        <p style={{ color: "#64748b", marginTop: 6, fontSize: 15 }}>
                            {isEditing ? "Modo edição ativo — altere os campos e salve." : "Clique em qualquer campo para começar a editar."}
                        </p>
                    </div>

                    {!isEditing && (
                        <button onClick={() => setIsEditing(true)} style={unlockButtonStyle}>
                            Editar currículo
                        </button>
                    )}
                </div>

                {isEditing && (
                    <div style={{ background: "#1C2B46", border: "1px solid #3b82f6", borderRadius: 10, padding: "10px 16px", marginBottom: 20, fontSize: 13, color: "#93c5fd" }}>
                        Modo edição ativo — as alterações ainda não foram salvas.
                    </div>
                )}

                <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 6 }}>Título do Currículo *</label>
                    <input
                        value={form.title}
                        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                        onClick={unlock}
                        readOnly={!isEditing}
                        placeholder="Ex: Currículo Dev Full Stack"
                        style={inputStyle(!!errors.title, !isEditing)}
                    />
                    {errors.title && <span style={errorStyle}>{errors.title}</span>}
                </div>

                <ResumePersonalDetailsSection
                    personalInfo={form.personalInfo}
                    errors={errors}
                    isEditing={isEditing}
                    onChange={setPersonal}
                    onUnlock={unlock}
                />

                <ResumeWorkExperienceSection
                    experience={form.experience}
                    isEditing={isEditing}
                    onChange={setExp}
                    onAdd={() => setForm((f) => ({ ...f, experience: [...f.experience, { ...emptyExperience }] }))}
                    onRemove={(i) => setForm((f) => ({ ...f, experience: f.experience.filter((_, idx) => idx !== i) }))}
                    onUnlock={unlock}
                />

                <ResumeSkillsSection
                    skills={form.skills}
                    isEditing={isEditing}
                    onAdd={(skill) => { if (!form.skills.includes(skill)) setForm((f) => ({ ...f, skills: [...f.skills, skill] })); }}
                    onRemove={(skill) => setForm((f) => ({ ...f, skills: f.skills.filter((s) => s !== skill) }))}
                />

                <ResumeEducationSection
                    education={form.education}
                    isEditing={isEditing}
                    onChange={setEdu}
                    onAdd={() => setForm((f) => ({ ...f, education: [...f.education, { ...emptyEducation }] }))}
                    onRemove={(i) => setForm((f) => ({ ...f, education: f.education.filter((_, idx) => idx !== i) }))}
                    onUnlock={unlock}
                />

                <ResumeIdiomsSection
                    idioms={form.idioms}
                    isEditing={isEditing}
                    onChange={setIdiom}
                    onAdd={() => setForm((f) => ({ ...f, idioms: [...f.idioms, { ...emptyIdiom }] }))}
                    onRemove={(i) => setForm((f) => ({ ...f, idioms: f.idioms.filter((_, idx) => idx !== i) }))}
                    onUnlock={unlock}
                />

                {isEditing && (
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, paddingTop: 8, paddingBottom: 32 }}>
                        <button
                            onClick={() => setIsEditing(false)}
                            style={{ height: 44, background: "transparent", color: "#888", border: "1px solid #2A3445", borderRadius: 12, padding: "0 20px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            style={{
                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                height: 44, background: "#2563EB", color: "#fff", border: "none",
                                borderRadius: 12, padding: "0 20px", fontWeight: 600, fontSize: 14,
                                boxShadow: "0 10px 30px rgba(37,99,235,0.28)",
                                cursor: loading ? "not-allowed" : "pointer",
                                opacity: loading ? 0.7 : 1, transition: "background 0.2s ease, opacity 0.2s ease",
                            }}
                        >
                            {loading ? "Salvando..." : "Salvar alterações"}
                        </button>
                    </div>
                )}

                <ResumeFormPopup popup={popup} onClose={handleClosePopup} />
            </div>
        </div>
    );
}
