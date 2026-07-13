"use client";

import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";
import { createApiClient } from "../lib/api-client";
import { getClerkToken } from "../lib/auth/client/clerk";
import { getApplicationMetrics } from "../client/job.service";
import type { ApplicationMetrics } from "../types/job";

const EMPTY: ApplicationMetrics = {
    summary: { total: 0, applied: 0, failed: 0, pending: 0, skipped: 0 },
    byResume: [],
    history: [],
    failureReasons: [],
    creditsUsed: 0,
    creditsRefunded: 0,
    costPerApplication: 0,
    dailyUsage: [],
    timeline: [],
};

export function useApplicationMetrics(campaignId: string | "all", page: number) {
    const { getToken } = useAuth();
    const scope = campaignId === "all" ? undefined : campaignId;

    const swr = useSWR(
        ["application-metrics", campaignId, page],
        async () => {
            const token = await getClerkToken(getToken);

            if (!token) {
                throw new Error("Missing token");
            }

            return getApplicationMetrics(createApiClient({ token }), { campaignId: scope, page, limit: 20 });
        },
    );

    return {
        metrics: swr.data?.data ?? EMPTY,
        pagination: swr.data?.pagination,
        isLoading: swr.isLoading,
        error: swr.error,
        refetch: () => swr.mutate(),
    };
}
