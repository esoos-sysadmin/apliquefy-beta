import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { z } from "zod"
import { prisma } from "@repo/database"

// Assinatura de web push do PWA (§6.5). Upsert pelo endpoint: o mesmo navegador trocando
// de conta passa a avisar só a conta nova.
const subscribeSchema = z.object({
    endpoint: z.string().url().startsWith("https://").max(2000),
    keys: z.object({ p256dh: z.string().min(1).max(500), auth: z.string().min(1).max(500) }),
})

export async function POST(request: Request) {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ message: "Usuário não autenticado" }, { status: 401 })
    const parsed = subscribeSchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) return NextResponse.json({ message: "Assinatura inválida", errorDesc: parsed.error.format() }, { status: 400 })
    const { endpoint, keys } = parsed.data
    await prisma.pushSubscription.upsert({
        where: { endpoint },
        create: { userId, endpoint, p256dh: keys.p256dh, auth: keys.auth },
        update: { userId, p256dh: keys.p256dh, auth: keys.auth },
    })
    return NextResponse.json({ success: true }, { status: 201 })
}
