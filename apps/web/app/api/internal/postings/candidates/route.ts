import { NextResponse } from "next/server"
import { workerRoute } from "../../../../lib/auth/server/worker"
import { candidatesQuerySchema } from "../../../../lib/validations/internal"
import { jobPostingService } from "../../../../../backend/modules/job-posting/job-posting.service"

export const GET = workerRoute(async (request) => {
    const parsed = candidatesQuerySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams))
    if (!parsed.success) return NextResponse.json({ message: "Dados inválidos", errorDesc: parsed.error.format() }, { status: 400 })
    const { userId, ats, limit } = parsed.data
    return NextResponse.json({ success: true, data: await jobPostingService.listCandidates(userId, ats, limit) })
})
