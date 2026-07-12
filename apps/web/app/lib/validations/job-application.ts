import { z } from "zod"

const platformEnum = z.enum(["linkedin", "infojobs"])
const statusEnum = z.enum(["pending", "applied", "failed", "skipped"])

export const createJobApplicationSchema = z.preprocess((value) => {
    if (!value || typeof value !== "object") return value
    const p = value as Record<string, unknown>
    return {
        campaign_id: p.campaign_id ?? p.campaignId,
        platform: p.platform,
        company_name: p.company_name ?? p.companyName,
        job_title: p.job_title ?? p.jobTitle,
        job_url: p.job_url ?? p.jobUrl,
    }
}, z.object({
    campaign_id: z.string().uuid(),
    platform: platformEnum,
    company_name: z.string().optional().nullable(),
    job_title: z.string().optional().nullable(),
    job_url: z.string().url().optional().nullable(),
}))

export const updateJobApplicationSchema = z.preprocess((value) => {
    if (!value || typeof value !== "object") return value
    const p = value as Record<string, unknown>
    return {
        status: p.status,
        error_log: p.error_log ?? p.errorLog,
        applied_at: p.applied_at ?? p.appliedAt,
        company_name: p.company_name ?? p.companyName,
        job_title: p.job_title ?? p.jobTitle,
        job_url: p.job_url ?? p.jobUrl,
    }
}, z.object({
    status: statusEnum.optional(),
    error_log: z.string().optional().nullable(),
    applied_at: z.string().datetime({ offset: true }).optional().nullable(),
    company_name: z.string().optional().nullable(),
    job_title: z.string().optional().nullable(),
    job_url: z.string().url().optional().nullable(),
}))

export type CreateJobApplicationInput = z.infer<typeof createJobApplicationSchema>
export type UpdateJobApplicationInput = z.infer<typeof updateJobApplicationSchema>
