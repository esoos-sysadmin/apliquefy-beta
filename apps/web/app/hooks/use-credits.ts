"use client"

import useSWR from "swr"
import { useAuth } from "@clerk/nextjs"
import { createApiClient } from "../lib/api-client"
import { getClerkToken } from "../lib/auth/client/clerk"
import { getBalance as getBalanceRequest } from "../client/credits.service"
import type { CreditBalance } from "../types/credits"

export function useCredits() {
    const { getToken } = useAuth()

    const { data, error, isLoading, mutate } = useSWR<CreditBalance>(
        "credits-balance",
        async () => {
            const token = await getClerkToken(getToken)

            if (!token) {
                throw new Error("Missing token")
            }

            return getBalanceRequest(createApiClient({ token }))
        },
        {
            refreshInterval: 30_000,
            revalidateOnFocus: true,
        }
    )

    return {
        balance: data ?? null,
        error,
        isLoading,
        refetch: () => mutate(),
        updateBalance(newBalance: number) {
            mutate(
                (current) =>
                    current
                        ? { ...current, balance: newBalance, canSend: newBalance >= 1, hasNegativeBalance: newBalance < 0 }
                        : current,
                false
            )
        },
    }
}
