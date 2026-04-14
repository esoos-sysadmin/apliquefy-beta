"use client"

import { SignUp } from "@clerk/nextjs"
import { useSearchParams } from "next/navigation"
import { useState } from "react"

export default function Cadastro() {
    const searchParams = useSearchParams()
    const [plan] = useState(() => searchParams.get("plan"))

    const afterSignUpUrl = plan
        ? `/api/checkout/onboarding?plan=${encodeURIComponent(plan)}`
        : "/desktop?tab=como-funciona"

    return (
        <div className="cadastro flex justify-center mt-4">
            <SignUp forceRedirectUrl={afterSignUpUrl} />
        </div>
    )
}
