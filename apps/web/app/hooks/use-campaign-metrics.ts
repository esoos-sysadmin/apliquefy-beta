"use client";

import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";
import { createApiClient } from "../lib/api-client";
import { getClerkToken } from "../lib/auth/client/clerk";
import { handleClientError } from "../lib/handle-client-error";
import type { CampaignMetrics, Report } from "../types/report";
import { getReport as getReportRequest, getReports as getReportsRequest } from "../client/report.service";

export function aggregateReports(reports: Report[]): CampaignMetrics {
    return reports.reduce(
        (acc, report) => ({
            totalApplications: acc.totalApplications + report.totalJobsApplications,
            successCount: acc.successCount + report.successApplications,
            failCount: acc.failCount + report.failApplications,
            creditsUsed: acc.creditsUsed + report.creditsUsed,
            creditsRefunded: acc.creditsRefunded + report.creditsRefund,
            lastSyncedAt: acc.lastSyncedAt || report.createdAt,
            reportCount: acc.reportCount + 1,
        }),
        {
            totalApplications: 0,
            successCount: 0,
            failCount: 0,
            creditsUsed: 0,
            creditsRefunded: 0,
            lastSyncedAt: "",
            reportCount: 0,
        },
    );
}

export function useCampaignMetrics(campaignId: string | null) {
    const { getToken } = useAuth();

    const swr = useSWR<{ reports: Report[]; metrics: CampaignMetrics }>(
        campaignId ? `reports:${campaignId}` : null,
        async () => {
            const token = await getClerkToken(getToken);

            if (!token || !campaignId) {
                throw new Error("Missing token");
            }

            const response = await getReportsRequest(createApiClient({ token }), campaignId);
            const reports = response.data ?? [];

            return {
                reports,
                metrics: aggregateReports(reports),
            };
        },
    );

    async function getReportById(reportId: string) {
        try {
            const token = await getClerkToken(getToken);

            if (!token) {
                throw new Error("Missing token");
            }

            return await getReportRequest(createApiClient({ token }), reportId);
        } catch (error) {
            handleClientError(error);
            throw error;
        }
    }

    return {
        reports: swr.data?.reports ?? [],
        metrics: swr.data?.metrics ?? {
            totalApplications: 0,
            successCount: 0,
            failCount: 0,
            creditsUsed: 0,
            creditsRefunded: 0,
            lastSyncedAt: "",
            reportCount: 0,
        },
        getReportById,
        ...swr,
    };
}
