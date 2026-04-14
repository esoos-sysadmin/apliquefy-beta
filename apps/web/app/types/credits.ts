export interface CreditBalance {
    balance: number
    canSend: boolean
    plan: string
    subscriptionStatus: string | null
    currentPeriodEnd: string | null
    hasNegativeBalance: boolean
}

export interface DebitCreditsPayload {
    questions: Array<{ question_id: string; used_fallback: boolean }>
    campaign_id: string
    job_application_id?: string
    idempotency_key: string
}

export interface DebitCreditsResult {
    newBalance: number
    creditsDebited: number
    rawCost: number
    blocked: boolean
}

export interface CreditTransaction {
    id: string
    userId: string
    amount: number
    type: string
    reference_id: string
    description: string | null
    idempotencyKey: string | null
    metadata: Record<string, unknown> | null
    created_at: string
}

export interface CreditWeightConfig {
    id: string
    stage: string
    weight: number
    label: string
}
