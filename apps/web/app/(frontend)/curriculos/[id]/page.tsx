"use client";

import { useParams } from "next/navigation";
import { useResume } from "../../../hooks/use-resumes";
import { ResumeEditor } from "../../../components/organisms/ResumeEditor";
import type { ResumeFormData } from "../../../types/resume-form";
import type { Resume } from "../../../types/resume";

function toMonthInput(value: unknown): string {
    if (!value) return "";
    const str = typeof value === "string" ? value : String(value);
    // ISO string, yyyy-MM-dd ou yyyy-MM → pega só yyyy-MM
    return str.match(/^(\d{4}-\d{2})/)?.[1] ?? "";
}

function toForm(resume: Resume): ResumeFormData {
    return {
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
        experience: (resume.experience ?? []).map((item) => ({
            companyName: item.companyName ?? item.company ?? "",
            jobType: item.jobType ?? item.position ?? "",
            description: item.description ?? "",
            jobArea: item.jobArea ?? "",
            jobStartDate: toMonthInput(item.jobStartDate ?? item.startDate),
            jobEndDate: toMonthInput(item.jobEndDate ?? item.endDate),
            isActualJob: item.isActualJob ?? item.current ?? false,
        })),
        skills: resume.skills ?? [],
        education: (resume.education ?? []).map((item) => ({
            nameOfInstitution: item.nameOfInstitution ?? item.institution ?? "",
            nameOfGraduation: item.nameOfGraduation ?? item.degree ?? "",
            StartDateOfGraduation: toMonthInput(item.StartDateOfGraduation ?? item.startDate),
            EndDateOfGraduation: toMonthInput(item.EndDateOfGraduation ?? item.endDate),
        })),
        idioms: (resume.idioms ?? []).map((item) => ({ language: item.language ?? "", level: item.level ?? "" })),
    };
}

export default function EditResumePage() {
    const { id } = useParams<{ id: string }>();
    const { data: resume, error } = useResume(id);

    if (error) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "rgb(var(--c-rose-400))" }}>Erro ao carregar currículo.</p>
            </div>
        );
    }

    if (!resume) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "rgb(var(--c-muted))" }}>Carregando currículo...</p>
            </div>
        );
    }

    // key: duplicar/traduzir navega para outro id e o editor precisa nascer de novo com ele.
    return (
        <ResumeEditor
            key={id}
            resumeId={id}
            initial={{ form: toForm(resume), template: resume.template ?? "harvard", language: resume.language ?? "pt" }}
        />
    );
}
