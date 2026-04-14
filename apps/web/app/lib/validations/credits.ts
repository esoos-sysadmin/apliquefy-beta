import { z } from "zod"

export const debitCreditsSchema = z.preprocess((value) => {
    if (!value || typeof value !== "object") {
        return value
    }

    const payload = value as Record<string, unknown>

    return {
        questions: payload.questions,
        campaign_id: payload.campaign_id ?? payload.campaignId,
        job_application_id: payload.job_application_id ?? payload.jobApplicationId,
        idempotency_key: payload.idempotency_key ?? payload.idempotencyKey,
    }
}, z.object({
    questions: z.array(z.object({
        question_id: z.string().min(1, "question_id é obrigatório"),
        used_fallback: z.boolean(),
    })).min(1, "Pelo menos uma pergunta é obrigatória"),
    campaign_id: z.string().uuid("campaign_id deve ser um UUID válido"),
    job_application_id: z.string().uuid("job_application_id deve ser um UUID válido").optional(),
    idempotency_key: z.string().min(1, "idempotency_key é obrigatório"),
}))

export const creditHistoryFiltersSchema = z.object({
    type: z.enum(["PURCHASE", "USAGE", "BONUS", "REFUND", "SUBSCRIPTION_CREDIT", "RESET"]).optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
})

export type DebitCreditsInput = z.infer<typeof debitCreditsSchema>
export type CreditHistoryFilters = z.infer<typeof creditHistoryFiltersSchema>
