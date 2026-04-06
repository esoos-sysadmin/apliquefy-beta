export interface Report {
    id: string;
    campaignId: string | null;
    totalJobsApplications: number;
    successApplications: number;
    failApplications: number;
    creditsUsed: number;
    creditsRefund: number;
    createdAt: string;
    campaign_name?: string;
    campaign_platform?: string;
}

export interface CreateReportInput {
    campaignId: string;
    totalJobsApplications: number;
    successApplications: number;
    failApplications: number;
    creditsUsed: number;
    creditsRefund: number;
}

export interface CampaignMetrics {
    totalApplications: number;
    successCount: number;
    failCount: number;
    creditsUsed: number;
    creditsRefunded: number;
    lastSyncedAt: string;
    reportCount: number;
}
