"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useResumes } from "../../../hooks/use-resumes";
import {
    emptyResumeForm,
    emptyExperience,
    emptyEducation,
    emptyIdiom,
    RESUME_IMPORT_STORAGE_KEY,
} from "../../../lib/constants/resume-form";
import { formatPhone, calcResumeProgress } from "../../../lib/helpers/resume";
import { ResumeProgressBar } from "../../../components/molecules/ResumeProgressBar";
import { ResumeFormPopup } from "../../../components/molecules/ResumeFormPopup";
import { ConfirmDialog } from "../../../components/molecules/ConfirmDialog";
import { FormErrorBanner } from "../../../components/molecules/FormErrorBanner";
import { ApiError } from "../../../lib/api-client";
import { flattenZodErrorTree, type FieldError } from "../../../lib/format-field-errors";
import { ResumePersonalDetailsSection } from "../../../components/organisms/ResumePersonalDetailsSection";
import { ResumeWorkExperienceSection } from "../../../components/organisms/ResumeWorkExperienceSection";
import { ResumeSkillsSection } from "../../../components/organisms/ResumeSkillsSection";
import { ResumeEducationSection } from "../../../components/organisms/ResumeEducationSection";
import { ResumeIdiomsSection } from "../../../components/organisms/ResumeIdiomsSection";
import { inputStyle, errorStyle } from "../../../lib/constants/resume-styles";
import type { ResumeFormData } from "../../../types/resume-form";

export default function NovoResumePage() {
    const router = useRouter();
    const { createResume } = useResumes();

    const [form, setForm] = useState<ResumeFormData>(emptyResumeForm);
    const [loading, setLoading] = useState(false);
    const [popup, setPopup] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [apiErrors, setApiErrors] = useState<FieldError[]>([]);

    const [importedFromPdf, setImportedFromPdf] = useState(false);
    const [confirmDiscard, setConfirmDiscard] = useState(false);

    // Currículo importado de PDF: consome o rascunho uma única vez. Fica no efeito
    // (não no useState inicial) porque sessionStorage não existe no render do servidor.
    useEffect(() => {
        const draft = sessionStorage.getItem(RESUME_IMPORT_STORAGE_KEY);
        if (!draft) return;
        sessionStorage.removeItem(RESUME_IMPORT_STORAGE_KEY);
        try {
            setForm({ ...emptyResumeForm, ...(JSON.parse(draft) as ResumeFormData) });
            setImportedFromPdf(true);
        } catch {
            // rascunho corrompido: segue com o formulário vazio
        }
    }, []);

    const progress = calcResumeProgress(form);

    function setPersonal(field: string, value: string) {
        setForm((f) => ({ ...f, personalInfo: { ...f.personalInfo, [field]: field === "contact" ? formatPhone(value) : value } }));
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

    function addSkill(skill: string) {
        if (!form.skills.includes(skill)) {
            setForm((f) => ({ ...f, skills: [...f.skills, skill] }));
        }
    }

    function removeSkill(skill: string) {
        setForm((f) => ({ ...f, skills: f.skills.filter((s) => s !== skill) }));
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
        setApiErrors([]);
        if (!validate()) return;

        setLoading(true);
        try {
            await createResume({
                title: form.title,
                personalInfo: form.personalInfo,
                experience: form.experience,
                skills: form.skills,
                education: form.education,
                idioms: form.idioms.filter((i) => i.language && i.level),
                isDefault: false,
            });
            setPopup({ type: "success", message: "Currículo criado com sucesso!" });
        } catch (error) {
            if (error instanceof ApiError && error.status === 400 && error.details) {
                const fieldErrors = flattenZodErrorTree(error.details);
                if (fieldErrors.length > 0) {
                    setApiErrors(fieldErrors);
                    if (typeof window !== "undefined") {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                    return;
                }
            }
            setPopup({ type: "error", message: "Falha de comunicação com o servidor" });
        } finally {
            setLoading(false);
        }
    }

    function handleCancel() {
        // só pergunta se há algo a perder — descartar uma extração de PDF sem aviso
        // custaria ao usuário refazer o upload e a chamada de IA
        if (JSON.stringify(form) === JSON.stringify(emptyResumeForm)) {
            router.push("/curriculos");
            return;
        }
        setConfirmDiscard(true);
    }

    function handleClosePopup() {
        if (popup?.type === "success") router.push("/curriculos");
        setPopup(null);
    }

    return (
        <div style={{ minHeight: "100vh", color: "#fff", fontFamily: "sans-serif" }}>
            <div style={{ maxWidth: 1152, margin: "0 auto" }}>
                <div style={{ marginBottom: 24 }}>
                    <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>Perfil do currículo</h1>
                    <p style={{ color: "#64748b", marginTop: 6, fontSize: 15 }}>Gerencie seus dados estruturados para as candidaturas automáticas.</p>
                </div>

                {importedFromPdf && (
                    <div style={{ marginBottom: 20, padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(56,189,248,0.3)", background: "rgba(56,189,248,0.1)", color: "#7dd3fc", fontSize: 14 }}>
                        Dados preenchidos a partir do seu PDF pela IA. Revise tudo antes de salvar — datas e contatos costumam precisar de ajuste.
                    </div>
                )}

                <FormErrorBanner errors={apiErrors} />

                <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", fontSize: 13, color: "#94a3b8", marginBottom: 8, fontWeight: 500 }}>Título do Currículo *</label>
                    <input
                        value={form.title}
                        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                        placeholder="Ex: Currículo Dev Full Stack"
                        style={inputStyle(!!errors.title)}
                    />
                    {errors.title && <span style={errorStyle}>{errors.title}</span>}
                </div>

                <ResumeProgressBar progress={progress} />

                <ResumePersonalDetailsSection
                    personalInfo={form.personalInfo}
                    errors={errors}
                    onChange={setPersonal}
                />

                <ResumeWorkExperienceSection
                    experience={form.experience}
                    onChange={setExp}
                    onAdd={() => setForm((f) => ({ ...f, experience: [...f.experience, { ...emptyExperience }] }))}
                    onRemove={(i) => setForm((f) => ({ ...f, experience: f.experience.filter((_, idx) => idx !== i) }))}
                />

                <ResumeSkillsSection
                    skills={form.skills}
                    onAdd={addSkill}
                    onRemove={removeSkill}
                />

                <ResumeEducationSection
                    education={form.education}
                    onChange={setEdu}
                    onAdd={() => setForm((f) => ({ ...f, education: [...f.education, { ...emptyEducation }] }))}
                    onRemove={(i) => setForm((f) => ({ ...f, education: f.education.filter((_, idx) => idx !== i) }))}
                />

                <ResumeIdiomsSection
                    idioms={form.idioms}
                    onChange={setIdiom}
                    onAdd={() => setForm((f) => ({ ...f, idioms: [...f.idioms, { ...emptyIdiom }] }))}
                    onRemove={(i) => setForm((f) => ({ ...f, idioms: f.idioms.filter((_, idx) => idx !== i) }))}
                />

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, paddingTop: 8, paddingBottom: 32 }}>
                    <button
                        onClick={handleCancel}
                        disabled={loading}
                        style={{ height: 44, background: "transparent", color: "#888", border: "1px solid #2A3445", borderRadius: 12, padding: "0 20px", fontWeight: 600, fontSize: 14, cursor: loading ? "not-allowed" : "pointer" }}
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
                        {loading ? "Salvando..." : "Salvar currículo"}
                    </button>
                </div>

                <ConfirmDialog
                    open={confirmDiscard}
                    title="Descartar currículo"
                    description={
                        importedFromPdf
                            ? "Os dados extraídos do seu PDF serão perdidos e você precisará importar o arquivo de novo."
                            : "Tudo que você preencheu será perdido."
                    }
                    confirmLabel="Descartar"
                    cancelLabel="Continuar editando"
                    danger
                    onCancel={() => setConfirmDiscard(false)}
                    onConfirm={() => router.push("/curriculos")}
                />

                <ResumeFormPopup popup={popup} onClose={handleClosePopup} />
            </div>
        </div>
    );
}
