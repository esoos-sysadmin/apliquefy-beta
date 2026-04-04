import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { jobService } from "../../../backend/modules/job/job.service"

export async function POST(request: Request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { message: "Usuário não autenticado" },
                { status: 401 }
            )
        }

        const body = await request.json()

        const result = await jobService.createJob(userId, body)

        if (!result.success) {
            if (result.code === "CONFLICT") {
                return NextResponse.json({ message: result.message }, { status: 409 })
            }
            if (result.code === "FORBIDDEN") {
                return NextResponse.json({ message: result.message }, { status: 403 })
            }
            return NextResponse.json(
                { message: "Dados inválidos", errorDesc: result.errorDesc },
                { status: 400 }
            )
        }

        return NextResponse.json({ success: true, data: result.data }, { status: 201 })

    } catch (error) {
        console.error("Erro na rota POST /api/jobs", error)
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
    }
}

export async function GET(request: Request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { message: "Usuário não autenticado" },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(request.url)
        const query = {
            campaign_id: searchParams.get("campaign_id") ?? undefined,
            page: searchParams.get("page") ?? undefined,
            limit: searchParams.get("limit") ?? undefined,
            sort: searchParams.get("sort") ?? undefined,
        }

        const result = await jobService.listJobs(userId, query as never)

        if (!result.success) {
            return NextResponse.json(
                { message: "Parâmetros inválidos", errorDesc: result.errorDesc },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { data: result.data, pagination: result.pagination },
            { status: 200 }
        )

    } catch (error) {
        console.error("Erro na rota GET /api/jobs", error)
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
    }
}
