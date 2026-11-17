import { NextResponse } from "next/server"
import { workerRoute } from "../../../../lib/auth/server/worker"
import { claimSchema } from "../../../../lib/validations/internal"
import { jobApplicationService } from "../../../../../backend/modules/job-application/job-application.service"

export const POST = workerRoute(async (request) => {
    const parsed = claimSchema.safeParse(await request.json())
    if (!parsed.success) return NextResponse.json({ message: "Dados inválidos", errorDesc: parsed.error.format() }, { status: 400 })
    const items = await jobApplicationService.claimCloud(parsed.data.workerId, parsed.data.limit, parsed.data.ats)
    return NextResponse.json({ success: true, data: items })
})
