import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { reportService } from "../../../../backend/modules/report/report.service"

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { message: "Usuário não autenticado" },
                { status: 401 }
            )
        }

        const { id } = await context.params

        if (!id) {
            return NextResponse.json(
                { message: "Parâmetro id é obrigatório" },
                { status: 400 }
            )
        }

        const result = await reportService.getReportById(userId, id)

        if (!result.success) {
            if (result.code === "NOT_FOUND") {
                return NextResponse.json({ message: result.message }, { status: 404 })
            }
            if (result.code === "FORBIDDEN") {
                return NextResponse.json({ message: result.message }, { status: 403 })
            }
            return NextResponse.json({ message: result.message }, { status: 400 })
        }

        return NextResponse.json({ data: result.data }, { status: 200 })

    } catch (error) {
        console.error("Erro na rota GET /api/reports/[id]", error)
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
    }
}
