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
