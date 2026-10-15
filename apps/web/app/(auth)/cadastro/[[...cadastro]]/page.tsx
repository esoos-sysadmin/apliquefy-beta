"use client"

import { SignUp } from "@clerk/nextjs"
import { useSearchParams } from "next/navigation"
import { useState } from "react"

/** Nome e e-mail que a pessoa já deu no funil /lp (sessionStorage da aba), para não digitar de novo. */
function lpContact(): { emailAddress?: string; firstName?: string } {
    try {
        const c = JSON.parse(sessionStorage.getItem("apliquefy-lp-v2") ?? "null")?.contact
        return c ? { emailAddress: c.email, firstName: String(c.name ?? "").trim().split(/\s+/)[0] } : {}
    } catch {
        return {}
    }
}

export default function Cadastro() {
    const searchParams = useSearchParams()
    // Mesmos parâmetros de volta para o checkout: /planos manda ?plan=, a /lp manda ?from=lp&plan=&bumps=.
    const [checkoutQuery] = useState(() => {
        const q = new URLSearchParams()
        for (const k of ["plan", "from", "bumps"]) {
            const v = searchParams.get(k)
            if (v) q.set(k, v)
        }
        return q.toString()
    })
    const [initialValues] = useState(() => (searchParams.get("from") === "lp" ? lpContact() : {}))

    const afterSignUpUrl = checkoutQuery ? `/api/checkout/onboarding?${checkoutQuery}` : "/desktop?tab=como-funciona"

    return (
        <div className="cadastro flex justify-center mt-4">
            <SignUp forceRedirectUrl={afterSignUpUrl} signInForceRedirectUrl={afterSignUpUrl} initialValues={initialValues} />
        </div>
    )
}
