import { ApiClient } from "../lib/api-client";
import type { ApiSuccessResponse } from "../types/api";
import type { CreateJobInput, Job } from "../types/job";

export async function createJob(api: ApiClient, body: CreateJobInput) {
    const response = await api.post<ApiSuccessResponse<Job>>("/jobs", body);
    return response.data as Job;
}
