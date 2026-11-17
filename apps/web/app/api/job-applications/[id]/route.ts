import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { jobApplicationService } from "../../../../backend/modules/job-application/job-application.service"

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ message: "Usuário não autenticado" }, { status: 401 })
    const { id } = await context.params
    // id inválido daria erro de uuid no Postgres (500); para o usuário é só "não existe"
    if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ message: "Candidatura não encontrada" }, { status: 404 })
    const application = await jobApplicationService.getOwnApplication(userId, id)
    if (!application) return NextResponse.json({ message: "Candidatura não encontrada" }, { status: 404 })
    return NextResponse.json({ data: application }, { status: 200 })
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ message: "Usuário não autenticado" }, { status: 401 })
        }

        const { id } = await context.params
        const body = await request.json()
        const result = await jobApplicationService.updateApplication(userId, id, body)

        if (!result.success) {
            const status = result.code === "NOT_FOUND" ? 404 : 400
            return NextResponse.json(
                { message: result.message ?? "Dados inválidos", errorDesc: result.errorDesc },
                { status }
            )
        }

        return NextResponse.json({ success: true, data: result.data }, { status: 200 })
    } catch (error) {
        console.error("Erro na rota PATCH /api/job-applications/[id]:", error)
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
    }
}
