import { ApiClient } from "../lib/api-client";
import type { ApiSuccessResponse, PaginatedResponse } from "../types/api";
import type { ApplicationMetrics, CreateJobInput, Job } from "../types/job";

export async function createJob(api: ApiClient, body: CreateJobInput) {
    const response = await api.post<ApiSuccessResponse<Job>>("/jobs", body);
    return response.data as Job;
}

export async function getApplicationMetrics(
    api: ApiClient,
    params: { campaignId?: string; page?: number; limit?: number } = {},
) {
    const search = new URLSearchParams();
    if (params.campaignId) search.set("campaign_id", params.campaignId);
    if (params.page) search.set("page", String(params.page));
    if (params.limit) search.set("limit", String(params.limit));
    const query = search.toString();

    return api.get<Pick<PaginatedResponse<never>, "pagination"> & { data: ApplicationMetrics }>(
        `/job-applications${query ? `?${query}` : ""}`,
    );
}
