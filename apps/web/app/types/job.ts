export interface Job {
    id: string;
    campaignId: string | null;
    link: string | null;
    companyName: string | null;
    position: string | null;
    expirationDate: string | null;
    numberOfApplications: number | null;
    createdAt: string;
}

export interface CreateJobInput {
    campaignId: string;
    link: string;
    companyName?: string;
    position: string;
    expirationDate?: string | null;
    numberOfApplications?: number;
}

export type ApplicationStatus = "pending" | "applied" | "failed" | "skipped";

export interface ApplicationHistoryItem {
    id: string;
    platform: "linkedin" | "infojobs" | null;
    companyName: string | null;
    jobTitle: string | null;
    jobUrl: string | null;
    status: ApplicationStatus | null;
    reason: string | null;
    appliedAt: string | null;
    createdAt: string | null;
    campaignName: string | null;
    resumeTitle: string | null;
}

export interface ApplicationMetrics {
    summary: { total: number; applied: number; failed: number; pending: number; skipped: number };
    byResume: Array<{ resumeId: string; resumeTitle: string; total: number; applied: number }>;
    history: ApplicationHistoryItem[];
    failureReasons: Array<{ reason: string; count: number }>;
    creditsUsed: number;
    creditsRefunded: number;
    costPerApplication: number;
    dailyUsage: Array<{ campaignId: string; campaignName: string; used: number; limit: number }>;
    timeline: Array<{ date: string; count: number }>;
}
