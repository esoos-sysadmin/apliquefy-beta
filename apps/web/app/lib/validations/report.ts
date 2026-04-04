import { z } from "zod"

export const createReportSchema = z.object({
    campaign_id: z.string().uuid("campaign_id deve ser um UUID válido"),
    total_jobs_applications: z.number().int().min(0).default(0).optional(),
    success_applications: z.number().int().min(0).default(0).optional(),
    fail_applications: z.number().int().min(0).default(0).optional(),
    credits_used: z.number().int().min(0).default(0).optional(),
    credits_refund: z.number().int().min(0).default(0).optional(),
}).refine(
    (data) => {
        const total = data.total_jobs_applications ?? 0
        const success = data.success_applications ?? 0
        const fail = data.fail_applications ?? 0
        return success + fail <= total
    },
    {
        message: "success_applications + fail_applications não pode exceder total_jobs_applications",
        path: ["fail_applications"],
    }
)

export const listReportsQuerySchema = z.object({
    campaign_id: z.string().uuid().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sort: z.enum(["created_at_asc", "created_at_desc"]).default("created_at_desc"),
})

export type CreateReportInput = z.infer<typeof createReportSchema>
export type ListReportsQuery = z.infer<typeof listReportsQuerySchema>
