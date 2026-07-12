import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { creditsService } from "../../../../backend/modules/credits/credits.service"

export async function POST(request: Request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ message: "Usuário não autenticado" }, { status: 401 })
        }

        const body = await request.json()
        const result = await creditsService.debitFlat(userId, body)

        if (!result.success) {
            return NextResponse.json(
                { message: "Dados inválidos", errorDesc: result.errorDesc },
                { status: 400 }
            )
        }

        return NextResponse.json({ success: true, data: result.data }, { status: 200 })
    } catch (error) {
        console.error("Erro na rota POST /api/credits/debit-flat:", error)
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
    }
}
