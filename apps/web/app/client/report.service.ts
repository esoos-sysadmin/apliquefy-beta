import { ApiClient } from "../lib/api-client";
import type { PaginatedResponse } from "../types/api";
import type { CreateReportInput, Report } from "../types/report";

export async function createReport(api: ApiClient, body: CreateReportInput) {
    const response = await api.post<{ data: Report; success: boolean }>("/reports", body);
    return response.data;
}

export async function getReports(api: ApiClient, campaignId: string) {
    return api.get<PaginatedResponse<Report>>(`/reports?campaign_id=${campaignId}`);
}

export async function getReport(api: ApiClient, id: string) {
    const response = await api.get<{ data: Report }>(`/reports/${id}`);
    return response.data;
}
