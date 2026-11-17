import { NextResponse } from "next/server"
import { workerRoute } from "../../../../lib/auth/server/worker"
import { userIdSchema } from "../../../../lib/validations/internal"
import { creditsService } from "../../../../../backend/modules/credits/credits.service"

// O canal é fixado aqui, não lido do corpo: o worker não escolhe preço (ADR-08).
export const POST = workerRoute(async (request) => {
    const { userId, ...body } = await request.json()
    const user = userIdSchema.safeParse(userId)
    if (!user.success) return NextResponse.json({ message: "userId inválido" }, { status: 400 })

    const result = await creditsService.debitFlat(user.data, { ...body, channel: "cloud" })
    if (!result.success) {
        return NextResponse.json({ message: result.message ?? "Dados inválidos", errorDesc: result.errorDesc, code: result.code }, { status: 400 })
    }
    return NextResponse.json({ success: true, data: result.data })
})
