import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { jobApplicationService } from "../../../backend/modules/job-application/job-application.service"

export async function POST(request: Request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ message: "Usuário não autenticado" }, { status: 401 })
        }

        const body = await request.json()
        const result = await jobApplicationService.createApplication(userId, body)

        if (!result.success) {
            const status = result.code === "FORBIDDEN" ? 403 : 400
            return NextResponse.json(
                { message: result.message ?? "Dados inválidos", errorDesc: result.errorDesc },
                { status }
            )
        }

        return NextResponse.json({ success: true, data: result.data }, { status: 201 })
    } catch (error) {
        console.error("Erro na rota POST /api/job-applications:", error)
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
    }
}

export async function GET(request: Request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ message: "Usuário não autenticado" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const query = {
            campaign_id: searchParams.get("campaign_id") ?? undefined,
            status: searchParams.get("status") ?? undefined,
            page: searchParams.get("page") ?? undefined,
            limit: searchParams.get("limit") ?? undefined,
        }

        const result = await jobApplicationService.getCampaignMetrics(userId, query as never)

        if (!result.success) {
            return NextResponse.json(
                { message: "Parâmetros inválidos", errorDesc: result.errorDesc },
                { status: 400 }
            )
        }

        return NextResponse.json({ data: result.data, pagination: result.pagination }, { status: 200 })
    } catch (error) {
        console.error("Erro na rota GET /api/job-applications:", error)
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
    }
}
