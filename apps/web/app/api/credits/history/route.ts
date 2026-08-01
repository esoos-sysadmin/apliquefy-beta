import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { creditsService } from "../../../../backend/modules/credits/credits.service"

export async function GET(request: Request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ message: "Usuário não autenticado" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const query = {
            type: searchParams.get("type") ?? undefined,
            from: searchParams.get("from") ?? undefined,
            to: searchParams.get("to") ?? undefined,
            page: searchParams.get("page") ?? undefined,
            limit: searchParams.get("limit") ?? undefined,
        }

        const result = await creditsService.getCreditHistory(userId, query as never)

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
        console.error("Erro na rota GET /api/credits/history:", error)
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
    }
}
