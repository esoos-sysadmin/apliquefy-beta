export type CheckBalanceData = {
    balance: number
    canSend: boolean
    plan: string
    subscriptionStatus: string | null
    currentPeriodEnd: string | null
    hasNegativeBalance: boolean
}

export type DebitCreditsData = {
    newBalance: number
    creditsDebited: number
    rawCost: number
    blocked: boolean
}

export type CreditsPagination = {
    page: number
    limit: number
    total: number
    total_pages: number
}

export type CreditsResponseError = {
    success: false
    errorDesc?: unknown
    message?: string
    code?: "NOT_FOUND" | "FORBIDDEN" | "CONFLICT" | "INSUFFICIENT_BALANCE"
}

export type CreditsResponseSuccess = {
    success: true
    data?: unknown
    pagination?: CreditsPagination
    message?: string
}

export type CreditsServiceResponse = CreditsResponseError | CreditsResponseSuccess
