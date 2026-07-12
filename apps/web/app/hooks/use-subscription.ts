"use client"

import { useAuth } from "@clerk/nextjs"
import { createApiClient } from "../lib/api-client"
import { getClerkToken } from "../lib/auth/client/clerk"
import { createCheckoutSession } from "../client/stripe.service"
import { handleClientError } from "../lib/handle-client-error"
import { toast } from "../lib/toast"
import { useCredits } from "./use-credits"

export function useSubscription() {
    const { getToken } = useAuth()
    const { balance, refetch } = useCredits()

    async function withClient<T>(callback: (api: ReturnType<typeof createApiClient>) => Promise<T>) {
        const token = await getClerkToken(getToken)

        if (!token) {
            throw new Error("Missing token")
        }

        return callback(createApiClient({ token }))
    }

    async function subscribeToPlan(planSlug: string) {
        try {
            const result = await withClient((api) => createCheckoutSession(api, { planSlug }))

            if (result.url) {
                window.location.href = result.url
            }
        } catch (error) {
            handleClientError(error, "Erro ao iniciar checkout. Tente novamente.")
        }
    }

    async function purchaseCreditPackage(packageSlug: string) {
        try {
            const result = await withClient((api) => createCheckoutSession(api, { packageSlug }))

            if (result.url) {
                window.location.href = result.url
            }
        } catch (error) {
            handleClientError(error, "Erro ao iniciar checkout. Tente novamente.")
        }
    }

    function openBillingPortal() {
        window.location.href = "/api/stripe"
    }

    return {
        balance,
        subscribeToPlan,
        purchaseCreditPackage,
        openBillingPortal,
        refetch,
    }
}
