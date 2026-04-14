import { ApiClient } from "../lib/api-client"

export async function createCheckoutSession(
    api: ApiClient,
    body: { planSlug?: string; packageSlug?: string }
): Promise<{ url: string }> {
    const response = await api.post<{ data: { url: string } }>("/stripe/checkout", body)
    return response.data
}

export async function createPortalSession(api: ApiClient): Promise<{ url: string }> {
    return api.get<{ url: string }>("/stripe")
}
