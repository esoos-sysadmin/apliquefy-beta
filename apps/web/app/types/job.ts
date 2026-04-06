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
