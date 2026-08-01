import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { resumeService } from "../../../../../backend/modules/resume/resume.service";
import { analyzeResume } from "../../../../../backend/modules/resume/resume-ai";
import { creditsService } from "../../../../../backend/modules/credits/credits.service";
import { RESUME_ANALYSIS_COST } from "../../../../lib/constants/credits";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ message: "Usuário não autenticado" }, { status: 401 });
        }

        const { id } = await context.params;
        if (!id) {
            return NextResponse.json({ message: "ID do currículo ausente" }, { status: 400 });
        }

        const found = await resumeService.SearchMyCVsById(userId, id);
        if (found.success != true || !found.data) {
            return NextResponse.json({ message: "Currículo não encontrado" }, { status: 404 });
        }

        // 1) Fail-fast se claramente não há saldo (evita gastar chamada de IA).
        const balance = await creditsService.checkBalance(userId);
        if (balance.success && balance.data && (balance.data as { balance: number }).balance < RESUME_ANALYSIS_COST) {
            return NextResponse.json(
                {
                    message: `Créditos insuficientes: cada análise custa ${RESUME_ANALYSIS_COST} créditos e você tem ${(balance.data as { balance: number }).balance}.`,
                    code: "INSUFFICIENT_BALANCE",
                },
                { status: 402 },
            );
        }

        // 2) Análise. Se a IA falhar, NÃO debita e devolve a causa real.
        let analysis;
        try {
            analysis = await analyzeResume(found.data);
        } catch (error) {
            console.error("Falha na análise de currículo com IA", error);
            return NextResponse.json(
                { message: error instanceof Error ? error.message : "Falha ao analisar o currículo com a IA" },
                { status: 502 },
            );
        }

        // 3) Débito só após a análise dar certo.
        const debit = await creditsService.debitFixed(userId, {
            amount: RESUME_ANALYSIS_COST,
            reason: "Análise de currículo com IA",
            referenceId: id,
            idempotencyKey: randomUUID(),
        });
        if (debit.success != true) {
            return NextResponse.json(
                { message: debit.message ?? "Falha ao debitar créditos", code: debit.code },
                { status: 402 },
            );
        }

        const newBalance = (debit.data as { newBalance?: number } | undefined)?.newBalance;
        return NextResponse.json({
            success: true,
            data: { ...analysis, creditsDebited: RESUME_ANALYSIS_COST, newBalance },
        });
    } catch (error) {
        console.error("Erro na rota POST /api/resumes/[id]/analyze", error);
        return NextResponse.json({ message: "Falha ao analisar o currículo com a IA" }, { status: 500 });
    }
}
