import type { Resume } from "../../types/resume";

export function getResumeMeta(resume: Resume) {
    const personalInfo = resume.personalInfo ?? {};
    const role = personalInfo.jobTitle || "Cargo não informado";
    const location = personalInfo.location || personalInfo.address || "Localização não informada";
    const hasRequiredFields =
        Boolean(resume.title?.trim()) &&
        Boolean(personalInfo.name?.trim()) &&
        Boolean(personalInfo.jobTitle?.trim()) &&
        Boolean(personalInfo.email?.trim()) &&
        Boolean(personalInfo.contact?.trim() || personalInfo.phone?.trim()) &&
        Boolean(resume.skills?.length || resume.experience?.length || resume.education?.length);

    return {
        role,
        location,
        status: hasRequiredFields ? "synced" : "draft",
    };
}

export function formatPhone(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function calcResumeProgress(form: {
    personalInfo: {
        name: string; jobTitle: string; email: string; contact: string;
        address: string; desiredSalary: string; seniority: string;
        linkedinUrl: string; portfolio: string; professionalSummary: string;
    };
    experience: unknown[];
    education: unknown[];
    skills: unknown[];
}): number {
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
}
