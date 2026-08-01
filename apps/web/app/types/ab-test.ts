import type { CampaignPlatform, CampaignStatus, CampaignLinkedinConfig, CampaignInfojobsConfig } from "./campaign";
import type { ApplicationStatus } from "./job";

export type AbTestWinner = "A" | "B" | "tie" | null;

export interface AbTestVariantSummary {
    id: string;
    name: string;
    status: CampaignStatus;
    resume: { id: string; title: string } | null;
    _count: { jobApplications: number };
}

export interface AbTest {
    id: string;
    name: string;
    platform: CampaignPlatform;
    hypothesis: string | null;
    winner: AbTestWinner;
    createdAt: string;
    variantA: AbTestVariantSummary;
    variantB: AbTestVariantSummary;
}

export interface AbTestApplication {
    id: string;
    campaignId: string | null;
    platform: CampaignPlatform | null;
    companyName: string | null;
    jobTitle: string | null;
    jobUrl: string | null;
    status: ApplicationStatus | null;
    gotResponse: boolean;
    gotInterview: boolean;
    appliedAt: string | null;
    createdAt: string | null;
}

export interface AbTestVariantDetail {
    campaignId: string;
    name: string;
    status: CampaignStatus;
    resumeTitle: string | null;
    metrics: {
        total: number;
        sent: number;
        responses: number;
        interviews: number;
        responseRate: number;
        interviewRate: number;
    };
    applications: AbTestApplication[];
}

export interface AbTestDetail {
    id: string;
    name: string;
    platform: CampaignPlatform;
    hypothesis: string | null;
    winner: AbTestWinner;
    createdAt: string;
    variantA: AbTestVariantDetail;
    variantB: AbTestVariantDetail;
}

interface AbTestBaseInput {
    name: string;
    resumeAId: string;
    resumeBId: string;
    dailyLimit?: number;
    hypothesis?: string;
}

export type CreateAbTestInput =
    | (AbTestBaseInput & { platform: "linkedin"; linkedinConfig: CampaignLinkedinConfig })
    | (AbTestBaseInput & { platform: "infojobs"; infojobsConfig: CampaignInfojobsConfig });

export interface UpdateAbTestInput {
    winner?: AbTestWinner;
    hypothesis?: string;
}
