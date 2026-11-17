import { NextResponse } from "next/server"
import { workerRoute } from "../../../lib/auth/server/worker"
import { jobPostingService } from "../../../../backend/modules/job-posting/job-posting.service"

export const GET = workerRoute(async (request) => {
    const ats = new URL(request.url).searchParams.get("ats") ?? undefined
    return NextResponse.json({ success: true, data: await jobPostingService.listBoards(ats) })
})

export const POST = workerRoute(async (request) => {
    const result = await jobPostingService.upsertBoards(await request.json())
    if (!result.success) return NextResponse.json({ message: "Dados inválidos", errorDesc: result.errorDesc }, { status: 400 })
    return NextResponse.json({ success: true, data: result.data })
})
