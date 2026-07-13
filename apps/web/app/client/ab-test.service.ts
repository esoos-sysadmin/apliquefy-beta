import { ApiClient } from "../lib/api-client";
import type { AbTest, AbTestDetail, CreateAbTestInput, UpdateAbTestInput } from "../types/ab-test";
import type { ApiSuccessResponse } from "../types/api";

function unwrap<T>(payload: unknown): T {
    if (payload && typeof payload === "object" && "data" in payload) {
        return (payload as { data: T }).data;
    }
    return payload as T;
}

export async function getAbTests(api: ApiClient) {
    const response = await api.get<ApiSuccessResponse<AbTest[]>>("/ab-tests");
    return unwrap<AbTest[]>(response) ?? [];
}

export async function getAbTest(api: ApiClient, id: string) {
    const response = await api.get<ApiSuccessResponse<AbTestDetail>>(`/ab-tests/${id}`);
    return unwrap<AbTestDetail>(response);
}

export async function createAbTest(api: ApiClient, body: CreateAbTestInput) {
    const response = await api.post<ApiSuccessResponse<AbTest>>("/ab-tests", body);
    return unwrap<AbTest>(response);
}

export async function updateAbTest(api: ApiClient, id: string, body: UpdateAbTestInput) {
    const response = await api.patch<ApiSuccessResponse<AbTest>>(`/ab-tests/${id}`, body);
    return unwrap<AbTest>(response);
}

export async function deleteAbTest(api: ApiClient, id: string) {
    return api.delete<ApiSuccessResponse<null>>(`/ab-tests/${id}`);
}

/** Tracking manual do resultado de uma candidatura (resposta / entrevista). */
export async function setApplicationOutcome(
    api: ApiClient,
    applicationId: string,
    outcome: { gotResponse?: boolean; gotInterview?: boolean },
) {
    return api.patch<ApiSuccessResponse<unknown>>(`/job-applications/${applicationId}`, outcome);
}
