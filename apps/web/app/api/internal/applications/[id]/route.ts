import { NextResponse } from "next/server"
import { workerRoute } from "../../../../lib/auth/server/worker"
import { userIdSchema } from "../../../../lib/validations/internal"
import { jobApplicationService } from "../../../../../backend/modules/job-application/job-application.service"

export const PATCH = workerRoute(async (request, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params
    const { userId, ...body } = await request.json()
    const user = userIdSchema.safeParse(userId)
    if (!user.success) return NextResponse.json({ message: "userId inválido" }, { status: 400 })

    const result = await jobApplicationService.patchCloud(user.data, id, body)
    if (!result.success) {
        const status = result.code === "NOT_FOUND" ? 404 : result.code === "CONFLICT" ? 409 : 400
        return NextResponse.json({ message: result.message ?? "Dados inválidos", errorDesc: result.errorDesc }, { status })
    }
    return NextResponse.json({ success: true, data: result.data })
})
