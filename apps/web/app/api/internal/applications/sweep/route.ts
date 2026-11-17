import { NextResponse } from "next/server"
import { workerRoute } from "../../../../lib/auth/server/worker"
import { jobApplicationService } from "../../../../../backend/modules/job-application/job-application.service"

// Varredor (§7.6): o worker só chama; as regras ficam aqui, junto do PATCH.
export const POST = workerRoute(async () => {
    const failed = await jobApplicationService.sweepCloud()
    return NextResponse.json({ success: true, data: { failed } })
})
