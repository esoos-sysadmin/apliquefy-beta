import { ApiClient } from "../lib/api-client"
import type { ApiSuccessResponse, PaginatedResponse } from "../types/api"
import type {
    CreditBalance,
    DebitCreditsPayload,
    DebitCreditsResult,
    CreditTransaction,
    CreditWeightConfig,
} from "../types/credits"

export async function getBalance(api: ApiClient): Promise<CreditBalance> {
    const response = await api.get<ApiSuccessResponse<CreditBalance>>("/credits/balance")
    return response.data!
}

export async function debitCredits(api: ApiClient, payload: DebitCreditsPayload): Promise<DebitCreditsResult> {
    const response = await api.post<ApiSuccessResponse<DebitCreditsResult>>("/credits/debit", payload)
    return response.data!
}

export async function getCreditHistory(
    api: ApiClient,
    params?: Record<string, string>
): Promise<PaginatedResponse<CreditTransaction>> {
    const query = params ? "?" + new URLSearchParams(params).toString() : ""
    return api.get<PaginatedResponse<CreditTransaction>>(`/credits/history${query}`)
}

export async function getWeightsConfig(api: ApiClient): Promise<CreditWeightConfig[]> {
    const response = await api.get<ApiSuccessResponse<CreditWeightConfig[]>>("/credits/weights")
    return response.data!
}
