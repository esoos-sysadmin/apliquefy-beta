"use client"

import { createContext, useContext, useCallback, useState } from "react"
import { useCredits } from "../../hooks/use-credits"
import { UpsellModal } from "../organisms/UpsellModal"

type CreditGateContextType = {
    canSend: boolean
    creditBalance: number
    isLoading: boolean
    showUpsell: () => void
    refetch: () => void
}

const CreditGateContext = createContext<CreditGateContextType>({
    canSend: false,
    creditBalance: 0,
    isLoading: true,
    showUpsell: () => {},
    refetch: () => {},
})

export function CreditGateProvider({ children }: { children: React.ReactNode }) {
    const { balance, isLoading, refetch } = useCredits()
    const [upsellOpen, setUpsellOpen] = useState(false)

    const canSend = balance?.canSend ?? false
    const creditBalance = balance?.balance ?? 0
    const currentPlan = balance?.plan ?? "free"

    const showUpsell = useCallback(() => {
        setUpsellOpen(true)
    }, [])

    const handleCloseUpsell = () => {
        setUpsellOpen(false)
    }

    return (
        <CreditGateContext.Provider
            value={{
                canSend,
                creditBalance,
                isLoading,
                showUpsell,
                refetch,
            }}
        >
            {children}
            <UpsellModal
                open={upsellOpen}
                currentPlanSlug={currentPlan}
                onClose={handleCloseUpsell}
            />
        </CreditGateContext.Provider>
    )
}

export function useCreditGate() {
    return useContext(CreditGateContext)
}
