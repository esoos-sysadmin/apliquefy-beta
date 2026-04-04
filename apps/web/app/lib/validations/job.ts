import { z } from "zod"

export const createJobSchema = z.object({
    campaign_id: z.string().uuid("campaign_id deve ser um UUID válido"),
    link: z.string().url("link deve ser uma URL válida"),
    company_name: z.string().optional(),
    position: z.string().min(1, "position é obrigatório"),
    expiration_date: z.string().datetime({ offset: true }).optional().nullable(),
    number_of_applications: z.number().int().min(0).default(0).optional(),
})

export const listJobsQuerySchema = z.object({
    campaign_id: z.string().uuid().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sort: z.enum(["created_at_asc", "created_at_desc"]).default("created_at_desc"),
})

export type CreateJobInput = z.infer<typeof createJobSchema>
export type ListJobsQuery = z.infer<typeof listJobsQuerySchema>
