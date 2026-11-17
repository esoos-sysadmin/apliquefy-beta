import { NextResponse } from "next/server"
import { prisma } from "@repo/database"
import type { Resume } from "../../../../../types/resume"
import { buildResumePdf } from "../../../../../lib/resume-pdf"
import { workerRoute } from "../../../../../lib/auth/server/worker"
import { userIdSchema } from "../../../../../lib/validations/internal"

// O MESMO PDF do painel e do desktop (GET /api/resumes/[id]/pdf): o empregador recebe
// o que o usuário vê, sem um segundo renderizador em Python.
export const GET = workerRoute(async (request, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params
    const user = userIdSchema.safeParse(new URL(request.url).searchParams.get("userId"))
    if (!user.success) return NextResponse.json({ message: "userId inválido" }, { status: 400 })

    const resume = await prisma.resume.findFirst({ where: { id, userId: user.data } })
    if (!resume) return NextResponse.json({ message: "Currículo não encontrado", code: "NOT_FOUND" }, { status: 404 })

    return new NextResponse(buildResumePdf(resume as unknown as Resume) as unknown as BodyInit, {
        status: 200,
        headers: { "Content-Type": "application/pdf", "Cache-Control": "no-store" },
    })
})
