import { z } from "zod";
import {
    createLinkedinCampaignSchema,
    createInfojobsCampaignSchema,
    updateCampaignSchema,
} from "../validations/campaign";
import { Campaign, CampaignLinkedin, CampaignInfojobs } from "@prisma/client";

// ======================= INFERRED INPUT TYPES =======================

export type CreateLinkedinCampaignInput = z.infer<typeof createLinkedinCampaignSchema>;
export type CreateInfojobsCampaignInput = z.infer<typeof createInfojobsCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;

// ======================= RESPONSE TYPES =======================

export type CampaignWithLinkedin = Campaign & { linkedinConfig: CampaignLinkedin | null };
export type CampaignWithInfojobs = Campaign & { infojobsConfig: CampaignInfojobs | null };

export type CampaignResponseError = {
    success: false;
    errorDesc?: z.ZodFormattedError<unknown> | string;
    message?: string;
};

export type CampaignResponseSuccess = {
    success: true;
    data?: Campaign | CampaignWithLinkedin | CampaignWithInfojobs;
    message?: string;
};

export type CampaignResponse = CampaignResponseError | CampaignResponseSuccess;
