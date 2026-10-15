import type { ResumeFormData, ResumeFormExperience, ResumeFormEducation, ResumeFormIdiom } from "../../types/resume-form";

export const emptyExperience: ResumeFormExperience = {
    companyName: "",
    jobType: "",
    description: "",
    jobArea: "",
    jobStartDate: "",
    jobEndDate: "",
    isActualJob: false,
};

export const emptyEducation: ResumeFormEducation = {
    nameOfInstitution: "",
    nameOfGraduation: "",
    StartDateOfGraduation: "",
    EndDateOfGraduation: "",
};

export const emptyIdiom: ResumeFormIdiom = { language: "", level: "" };

export const emptyResumeForm: ResumeFormData = {
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
};

// handoff do PDF importado (/curriculos) para o formulário (/curriculos/novo)
export const RESUME_IMPORT_STORAGE_KEY = "resume-import-draft";

export const seniorityOptions = ["Estagiário", "Júnior", "Pleno", "Sênior", "Especialista", "Gerente", "Diretor"] as const;

export const idiomLevelOptions = ["Básico", "Intermediário", "Avançado", "Fluente", "Nativo"] as const;

export const resumeTemplates = ["harvard", "two-column"] as const;
export const resumeTemplateLabels: Record<(typeof resumeTemplates)[number], string> = {
    harvard: "Harvard (recomendado p/ ATS)",
    "two-column": "Duas colunas",
};

// Idioma do PDF: rótulos de seção, meses e níveis. O conteúdo em si é o que o usuário digitou.
export const resumeLanguages = ["pt", "en", "es"] as const;
export const resumeLanguageLabels: Record<(typeof resumeLanguages)[number], string> = {
    pt: "Português",
    en: "Inglês",
    es: "Espanhol",
};
