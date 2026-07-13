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
        got_response: p.got_response ?? p.gotResponse,
        got_interview: p.got_interview ?? p.gotInterview,
    }
}, z.object({
    status: statusEnum.optional(),
    error_log: z.string().optional().nullable(),
    applied_at: z.string().datetime({ offset: true }).optional().nullable(),
    company_name: z.string().optional().nullable(),
    job_title: z.string().optional().nullable(),
    job_url: z.string().url().optional().nullable(),
    got_response: z.boolean().optional(),
    got_interview: z.boolean().optional(),
}))

export const listJobApplicationsQuerySchema = z.object({
    campaign_id: z.string().uuid().optional(),
    status: statusEnum.optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
})

export type CreateJobApplicationInput = z.infer<typeof createJobApplicationSchema>
export type UpdateJobApplicationInput = z.infer<typeof updateJobApplicationSchema>
export type ListJobApplicationsQuery = z.infer<typeof listJobApplicationsQuerySchema>
