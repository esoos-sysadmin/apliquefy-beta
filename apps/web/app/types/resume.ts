export interface ResumePersonalInfo {
    name?: string;
    email?: string;
    phone?: string;
    contact?: string;
    location?: string;
    address?: string;
    jobTitle?: string;
    linkedin?: string;
    linkedinUrl?: string;
    summary?: string;
    professionalSummary?: string;
    desiredSalary?: string;
    seniority?: string;
    portfolio?: string;
    github?: string;
}

export interface ResumeEducation {
    institution?: string;
    degree?: string;
    startDate?: string;
    endDate?: string | null;
    nameOfInstitution?: string;
    nameOfGraduation?: string;
    StartDateOfGraduation?: string;
    EndDateOfGraduation?: string;
}

export interface ResumeExperience {
    company?: string;
    position?: string;
    startDate?: string;
    endDate?: string | null;
    current?: boolean;
    description?: string;
    companyName?: string;
    jobType?: string;
    jobArea?: string;
    jobStartDate?: string;
    jobEndDate?: string;
    isActualJob?: boolean;
}

export interface ResumeIdiom {
    language: string;
    level: "Básico" | "Intermediário" | "Avançado" | "Fluente" | "Nativo" | "";
}

export interface Resume {
    id: string;
    userId?: string;
    title: string;
    personalInfo: ResumePersonalInfo | null;
    education: ResumeEducation[] | null;
    experience: ResumeExperience[] | null;
    skills: string[] | null;
    idioms?: ResumeIdiom[] | null;
    isDefault?: boolean;
    createdAt: string;
}

export interface CreateResumeInput {
    title: string;
    personalInfo: ResumePersonalInfo;
    education?: ResumeEducation[];
    experience?: ResumeExperience[];
    skills?: string[];
    idioms?: ResumeIdiom[];
    isDefault?: boolean;
}

export type UpdateResumeInput = CreateResumeInput;

export interface ResumeSuggestion {
    id: string;
    section: string;
    title: string;
    rationale: string;
    path: string;
    currentValue: string;
    suggestedValue: string | string[];
}

export interface ResumeAnalysis {
    overallFeedback: string;
    suggestions: ResumeSuggestion[];
    creditsDebited?: number;
    newBalance?: number;
}
