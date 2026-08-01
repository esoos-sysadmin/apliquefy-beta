import { ApiClient } from "../lib/api-client";
import type { Resume, CreateResumeInput, UpdateResumeInput, ResumeAnalysis } from "../types/resume";
import type { ResumeFormData } from "../types/resume-form";
import type { ApiSuccessResponse } from "../types/api";

function unwrapResumePayload(payload: unknown) {
    if (payload && typeof payload === "object" && "data" in payload) {
        const nested = payload.data;

        if (nested && typeof nested === "object" && "data" in nested) {
            return nested.data;
        }

        return nested;
    }

    return payload;
}

export async function getResumes(api: ApiClient) {
    const response = await api.get<ApiSuccessResponse<Resume[]>>("/resumes");
    return (unwrapResumePayload(response) as Resume[] | undefined) ?? [];
}

export async function getResume(api: ApiClient, id: string) {
    const response = await api.get<ApiSuccessResponse<Resume>>(`/resumes/${id}`);
    return unwrapResumePayload(response) as Resume;
}

export async function createResume(api: ApiClient, body: CreateResumeInput) {
    const response = await api.post<ApiSuccessResponse<Resume>>("/resumes", body);
    return unwrapResumePayload(response) as Resume;
}

export async function updateResume(api: ApiClient, id: string, body: UpdateResumeInput) {
    const response = await api.put<ApiSuccessResponse<Resume>>(`/resumes/${id}`, body);
    return unwrapResumePayload(response) as Resume;
}

export async function deleteResume(api: ApiClient, id: string) {
    return api.delete<ApiSuccessResponse<null>>(`/resumes/${id}`);
}

export async function importResumePdf(api: ApiClient, file: File) {
    const form = new FormData();
    form.append("file", file);
    const response = await api.postForm<ApiSuccessResponse<ResumeFormData>>("/resumes/import", form);
    return unwrapResumePayload(response) as ResumeFormData;
}

export async function analyzeResume(api: ApiClient, id: string) {
    const response = await api.post<ApiSuccessResponse<ResumeAnalysis>>(`/resumes/${id}/analyze`, {});
    return unwrapResumePayload(response) as ResumeAnalysis;
}
