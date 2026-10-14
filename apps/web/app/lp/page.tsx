import type { Metadata, Viewport } from "next"
import { IBM_Plex_Mono, IBM_Plex_Sans, Newsreader } from "next/font/google"
import { Funnel } from "./quiz"
import type { Segment } from "./funnel"
import "./lp.css"

const serif = Newsreader({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-lp-serif", display: "swap" })
const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-lp-sans", display: "swap" })
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-lp-mono", display: "swap" })

export const metadata: Metadata = {
    title: "Laudo de candidatura · Apliquefy",
    description: "Responda algumas perguntas, envie seu currículo e receba um laudo com nota, problemas encontrados e quanto tempo você gasta se candidatando.",
}

export const viewport: Viewport = { themeColor: "#f5f1e8" }

const SEGMENTS: Segment[] = ["dev", "exec", "varejo"]

// ?a=dev|exec|varejo vem do anúncio e só adapta a manchete; a pessoa ainda escolhe na pergunta 1.
export default async function LandingFunnelPage({ searchParams }: { searchParams: Promise<{ a?: string; s?: string }> }) {
    const { a, s } = await searchParams
    const ad = SEGMENTS.find((x) => x === a)
    // ?s= chega quando a pessoa toca na pergunta 1 antes do JS hidratar (form GET nativo).
    const start = SEGMENTS.find((x) => x === s)
    return (
        <div className={`lp ${serif.variable} ${sans.variable} ${mono.variable}`}>
            <Funnel ad={ad} start={start} />
        </div>
    )
}
