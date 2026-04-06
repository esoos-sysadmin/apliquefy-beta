export type ResumeFormExperience = {
    companyName: string;
    jobType: string;
    description: string;
    jobArea: string;
    jobStartDate: string;
    jobEndDate: string;
    isActualJob: boolean;
};

export type ResumeFormEducation = {
    nameOfInstitution: string;
    nameOfGraduation: string;
    StartDateOfGraduation: string;
    EndDateOfGraduation: string;
};

export type ResumeFormIdiom = {
    language: string;
    level: "Básico" | "Intermediário" | "Avançado" | "Fluente" | "Nativo" | "";
};

export type ResumeFormPersonalInfo = {
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

export type ResumeFormData = {
    title: string;
    personalInfo: ResumeFormPersonalInfo;
    experience: ResumeFormExperience[];
    skills: string[];
    education: ResumeFormEducation[];
    idioms: ResumeFormIdiom[];
};
