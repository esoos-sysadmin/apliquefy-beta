import { NextResponse } from "next/server"
import { workerRoute } from "../../../../lib/auth/server/worker"
import { userIdSchema } from "../../../../lib/validations/internal"
import { jobApplicationService } from "../../../../../backend/modules/job-application/job-application.service"

const STATUS: Record<string, number> = { DUPLICATE: 409, FORBIDDEN: 403, NOT_FOUND: 404 }

export const POST = workerRoute(async (request) => {
    const { userId, ...body } = await request.json()
    const user = userIdSchema.safeParse(userId)
    if (!user.success) return NextResponse.json({ message: "userId inválido" }, { status: 400 })

    const result = await jobApplicationService.enqueueCloud(user.data, body)
    if (!result.success) {
        return NextResponse.json(
            { message: result.message ?? "Dados inválidos", errorDesc: result.errorDesc },
            { status: STATUS[result.code ?? ""] ?? 400 },
        )
    }
    return NextResponse.json({ success: true, data: result.data }, { status: 201 })
})
