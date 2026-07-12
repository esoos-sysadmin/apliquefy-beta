import { ApiClient } from "../lib/api-client"
import type { ApiSuccessResponse, PaginatedResponse } from "../types/api"
import type {
    CreditBalance,
    CreditTransaction,
} from "../types/credits"

export async function getBalance(api: ApiClient): Promise<CreditBalance> {
    const response = await api.get<ApiSuccessResponse<CreditBalance>>("/credits/balance")
    return response.data!
}

export async function getCreditHistory(
    api: ApiClient,
    params?: Record<string, string>
): Promise<PaginatedResponse<CreditTransaction>> {
    const query = params ? "?" + new URLSearchParams(params).toString() : ""
    return api.get<PaginatedResponse<CreditTransaction>>(`/credits/history${query}`)
}
