import { NextResponse } from "next/server"
import { workerRoute } from "../../../../lib/auth/server/worker"
import { jobPostingService } from "../../../../../backend/modules/job-posting/job-posting.service"

// Descrição de uma vaga para o fit gate (ADR-07). Catálogo público de vagas: sem dado de usuário.
export const GET = workerRoute(async (_request, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params
    const posting = await jobPostingService.getDescription(id)
    if (!posting) return NextResponse.json({ message: "Vaga não encontrada" }, { status: 404 })
    return NextResponse.json({ success: true, data: posting })
})
