import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { jobApplicationService } from "../../../../../backend/modules/job-application/job-application.service"

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ message: "Usuário não autenticado" }, { status: 401 })
        }

        const { id } = await context.params
        const status = await jobApplicationService.countTodayByCampaign(userId, id)

        if (!status) {
            return NextResponse.json(
                { message: "Campanha não encontrada", code: "NOT_FOUND" },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true, data: status }, { status: 200 })
    } catch (error) {
        console.error("Erro na rota GET /api/campaigns/[id]/daily-status:", error)
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
    }
}
