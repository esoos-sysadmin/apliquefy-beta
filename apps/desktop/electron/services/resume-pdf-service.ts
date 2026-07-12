import { apiRequest } from "./backend-api-service";
import { rpaApiRequest } from "./rpa-process-service";

type ResumeApiPayload = {
    success: true;
    data: {
        id: string;
        title: string;
        personalInfo: unknown;
        education: unknown;
        experience: unknown;
        skills: unknown;
    };
};

type RenderResumeResponse = {
    path: string;
    hash: string;
    cached: boolean;
};

/**
 * Fetches a Resume from the web backend and asks the RPA engine to
 * render it as PDF (cached on disk by content hash).
 */
export async function renderResumePdf(resumeId: string, styleId: string = "default"): Promise<RenderResumeResponse> {
    const resume = await apiRequest<ResumeApiPayload>(`/api/resumes/${resumeId}`);

    return rpaApiRequest<RenderResumeResponse>("/resumes/render", {
        method: "POST",
        body: JSON.stringify({
            resumeId,
            styleId,
            payload: resume.data,
        }),
    });
}
