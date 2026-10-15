import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { z } from "zod"

// TTS da fish.audio para o assistente do desktop: a FISH_API_KEY fica só no servidor.
const FISH_BASE = "https://api.fish.audio/v1"

const ttsSchema = z.object({
    text: z.string().min(1).max(2000),
    referenceId: z.string().max(64).optional(),
})

export async function POST(request: Request) {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ message: "Usuário não autenticado" }, { status: 401 })
    }

    const apiKey = process.env.FISH_API_KEY
    if (!apiKey) {
        return NextResponse.json({ message: "FISH_API_KEY não configurada no ambiente do web" }, { status: 500 })
    }

    const parsed = ttsSchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) {
        return NextResponse.json({ message: "Dados inválidos", errorDesc: parsed.error.issues }, { status: 400 })
    }
    const { text, referenceId } = parsed.data

    const upstream = await fetch(`${FISH_BASE}/tts`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            // A fish.audio escolhe o modelo por header, não por campo do body.
            model: process.env.FISH_MODEL || "s2.1-pro",
        },
        body: JSON.stringify({
            text,
            format: "mp3",
            // Sem reference_id cai na voz default do modelo.
            ...(referenceId ? { reference_id: referenceId } : {}),
        }),
    })

    if (!upstream.ok) {
        console.error("[ai/tts] fish.audio falhou", upstream.status, await upstream.text().catch(() => ""))
        return NextResponse.json({ message: "Falha ao gerar a voz.", upstreamStatus: upstream.status }, { status: 502 })
    }

    return new Response(upstream.body, { headers: { "Content-Type": "audio/mpeg" } })
}
