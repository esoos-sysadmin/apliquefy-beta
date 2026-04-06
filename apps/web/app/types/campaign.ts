export type CampaignPlatform = "linkedin" | "infojobs";
export type CampaignStatus = "active" | "paused" | "inactive";

export interface CampaignLinkedinConfig {
    id?: string;
    searchTerms?: string | null;
    locationTerm?: string | null;
    sortBy?: "recent" | "relevant" | null;
    datePosted?: "any" | "past_month" | "past_week" | "past_24h" | null;
    expLevel?: Array<"internship" | "entry" | "associate" | "mid_senior" | "director" | "executive">;
    jobType?: Array<"full_time" | "part_time" | "contract" | "temporary" | "volunteer" | "internship" | "other">;
    remoteFilter?: Array<"remote" | "hybrid" | "on_site">;
}

export interface CampaignInfojobsConfig {
    id?: string;
    searchTerms?: string | null;
    locationState?: string | null;
    kmDeVoce?: string | null;
    salaryFilter?: string | null;
    datePosted?: string | null;
    workModels?: string[];
    jobAreas?: string[];
    contractTypes?: string[];
    workSchedules?: string[];
    seniorityLevels?: string[];
    pcdTypes?: string[];
}

export interface Campaign {
    id: string;
    name: string;
    resumeId: string;
    userId?: string;
    platform: CampaignPlatform;
    status: CampaignStatus;
    dailyLimit: number | null;
    createdAt: string;
    resume?: {
        id: string;
        title: string;
    } | null;
    linkedinConfig?: CampaignLinkedinConfig | null;
    infojobsConfig?: CampaignInfojobsConfig | null;
    _count?: {
        jobApplications: number;
        reports?: number;
        jobs?: number;
    };
}

export interface CreateLinkedinCampaignInput {
    name: string;
    resumeId: string;
    platform?: "linkedin";
    dailyLimit?: number;
    linkedinConfig: CampaignLinkedinConfig;
}

export interface CreateInfojobsCampaignInput {
    name: string;
    resumeId: string;
    platform?: "infojobs";
    dailyLimit?: number;
    infojobsConfig: CampaignInfojobsConfig;
}

export interface UpdateCampaignInput {
    name?: string;
    resumeId?: string;
    dailyLimit?: number;
}
