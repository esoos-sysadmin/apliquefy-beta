import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import localFont from "next/font/local"
import { Landing } from "./landing"
import { Funnel } from "./quiz"
import type { Screen, Segment } from "./funnel"
import "./lp.css"

// Fonte própria da marca (03_Tipografia/Web): títulos e textos curtos. Corpo em Inter, como pede o guia.
const display = localFont({
    src: [
        { path: "./fonts/ApliquefyDisplayR2-Regular.woff2", weight: "400" },
        { path: "./fonts/ApliquefyDisplay-Bold.woff2", weight: "700" },
    ],
    variable: "--font-ap-display",
    display: "swap",
})
const body = Inter({ subsets: ["latin"], variable: "--font-ap-body", display: "swap" })

export const metadata: Metadata = {
    title: "Apliquefy · Pare de se candidatar. Deixe o Apliquefy fazer isso por você.",
    description:
        "O Apliquefy se candidata às vagas certas no LinkedIn e no InfoJobs por você. Faça o diagnóstico gratuito e veja quanto tempo e alcance você está perdendo.",
}

export const viewport: Viewport = { themeColor: "#F6F4FA" }

const SEGMENTS: Segment[] = ["dev", "exec", "varejo"]

// ?a= vem do anúncio e adapta a manchete. ?q=1 abre o quiz e ?s= responde a pergunta 1:
// os dois chegam por link/form nativo quando a pessoa toca antes do JS hidratar.
export default async function LandingFunnelPage({ searchParams }: { searchParams: Promise<{ a?: string; s?: string; q?: string; checkout?: string; session_id?: string }> }) {
    const { a, s, q, checkout, session_id } = await searchParams
    const ad = SEGMENTS.find((x) => x === a)
    const start = SEGMENTS.find((x) => x === s)
    const screen: Screen | undefined = start ? undefined : q === "1" ? "segment" : undefined
    // Volta do Stripe (/api/checkout/onboarding → Checkout → /lp?checkout=…).
    const status = (["success", "cancel", "error", "active"] as const).find((x) => x === checkout)
    const ret = status ? { status, sessionId: session_id } : undefined
    return (
        <div className={`lp ${display.variable} ${body.variable}`}>
            <Funnel ad={ad} start={start} startScreen={screen} checkout={ret} landing={<Landing ad={ad} />} />
        </div>
    )
}
