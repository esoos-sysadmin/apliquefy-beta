export interface CreditBalance {
    balance: number
    canSend: boolean
    plan: string
    subscriptionStatus: string | null
    currentPeriodEnd: string | null
    hasNegativeBalance: boolean
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

