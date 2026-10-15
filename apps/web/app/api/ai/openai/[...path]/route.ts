import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

// Proxy da OpenAI para o desktop e o engine RPA: a chave fica só no servidor e o
// cliente se autentica com o token Clerk que já usa no resto da API. O engine usa
// o SDK da OpenAI com base_url apontando para cá, por isso o path espelha o /v1.
// Allowlist de path e modelo: sem ela, qualquer usuário logado gastaria a chave
// em qualquer endpoint/modelo da OpenAI.
// ponytail: sem rate limit por usuário — adicionar se aparecer abuso.

const OPENAI_BASE = "https://api.openai.com/v1"
const ALLOWED_PATHS = new Set(["chat/completions", "audio/transcriptions"])
const ALLOWED_CHAT_MODELS = new Set(["gpt-4o-mini", "gpt-4.1-mini"])

// Uma chamada de visão do agente leva 10–30s; 60 dá folga sem prender a função.
export const maxDuration = 60

export async function POST(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ message: "Usuário não autenticado" }, { status: 401 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
        return NextResponse.json({ message: "OPENAI_API_KEY não configurada no ambiente do web" }, { status: 500 })
    }

    const path = (await params).path.join("/")
    if (!ALLOWED_PATHS.has(path)) {
        return NextResponse.json({ message: `Endpoint não permitido: ${path}` }, { status: 403 })
    }

    let body: BodyInit
    let contentType = request.headers.get("content-type") ?? "application/json"

    if (path === "audio/transcriptions") {
        // Refaz o form para fixar o modelo; o fetch gera o boundary do multipart sozinho.
        const form = await request.formData()
        form.set("model", "whisper-1")
        body = form
        contentType = ""
    } else {
        const json = await request.json().catch(() => null)
        if (!json || !ALLOWED_CHAT_MODELS.has(json.model)) {
            return NextResponse.json({ message: `Modelo não permitido: ${json?.model}` }, { status: 403 })
        }
        body = JSON.stringify(json)
    }

    const upstream = await fetch(`${OPENAI_BASE}/${path}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            ...(contentType ? { "Content-Type": contentType } : {}),
        },
        body,
    })

    if (!upstream.ok) {
        console.error(`[ai/openai] ${path} falhou`, upstream.status, await upstream.clone().text().catch(() => ""))
    }

    return new Response(upstream.body, {
        status: upstream.status,
        headers: { "Content-Type": upstream.headers.get("content-type") ?? "application/json" },
    })
}
