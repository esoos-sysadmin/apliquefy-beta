import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { creditsService } from "../../../../backend/modules/credits/credits.service"

export async function GET() {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ message: "Usuário não autenticado" }, { status: 401 })
        }

        const result = await creditsService.getWeightsConfig()

        if (!result.success) {
            return NextResponse.json({ message: result.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, data: result.data }, { status: 200 })
    } catch (error) {
        console.error("Erro na rota GET /api/credits/weights:", error)
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
    }
}
