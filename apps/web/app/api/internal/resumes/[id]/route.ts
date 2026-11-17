import { NextResponse } from "next/server"
import { prisma } from "@repo/database"
import { workerRoute } from "../../../../lib/auth/server/worker"
import { userIdSchema } from "../../../../lib/validations/internal"

// Currículo do usuário para o worker (mesma checagem de dono: id + userId).
export const GET = workerRoute(async (request, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params
    const user = userIdSchema.safeParse(new URL(request.url).searchParams.get("userId"))
    if (!user.success) return NextResponse.json({ message: "userId inválido" }, { status: 400 })

    const resume = await prisma.resume.findFirst({ where: { id, userId: user.data } })
    if (!resume) return NextResponse.json({ message: "Currículo não encontrado", code: "NOT_FOUND" }, { status: 404 })
    return NextResponse.json({ success: true, data: resume })
})
