import { z } from "zod"

export const debitFlatSchema = z.preprocess((value) => {
    if (!value || typeof value !== "object") {
        return value
    }

    const payload = value as Record<string, unknown>

    return {
        campaign_id: payload.campaign_id ?? payload.campaignId,
        job_application_id: payload.job_application_id ?? payload.jobApplicationId,
        idempotency_key: payload.idempotency_key ?? payload.idempotencyKey,
        questions: payload.questions,
        steps: payload.steps,
    }
}, z.object({
    campaign_id: z.string().uuid("campaign_id deve ser um UUID válido"),
    job_application_id: z.string().uuid("job_application_id deve ser um UUID válido"),
    idempotency_key: z.string().min(1, "idempotency_key é obrigatório"),
    // Esforço medido pelo agente (perguntas dinâmicas respondidas / passos).
    // Opcionais p/ compat: cliente antigo sem esses campos cai em 0.
    questions: z.coerce.number().int().min(0).default(0),
    steps: z.coerce.number().int().min(0).default(0),
}))

export type DebitFlatInput = z.infer<typeof debitFlatSchema>

export const creditHistoryFiltersSchema = z.object({
    type: z.enum(["PURCHASE", "USAGE", "BONUS", "REFUND", "SUBSCRIPTION_CREDIT", "RESET"]).optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
})

export type CreditHistoryFilters = z.infer<typeof creditHistoryFiltersSchema>

