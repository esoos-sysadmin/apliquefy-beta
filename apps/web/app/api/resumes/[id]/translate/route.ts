import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { resumeService, type IResumeDataInput } from "../../../../../backend/modules/resume/resume.service";
import { translateResume } from "../../../../../backend/modules/resume/resume-ai";
import { creditsService } from "../../../../../backend/modules/credits/credits.service";
import { RESUME_TRANSLATION_COST } from "../../../../lib/constants/credits";
import { resumeLanguages } from "../../../../lib/constants/resume-form";
import type { Resume } from "../../../../types/resume";

const bodySchema = z.object({ language: z.enum(resumeLanguages) });

/** Duplica o currículo traduzido pela IA. O original não é tocado. */
export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ message: "Usuário não autenticado" }, { status: 401 });
        }

        const parsedBody = bodySchema.safeParse(await request.json().catch(() => null));
        if (!parsedBody.success) {
            return NextResponse.json({ message: "Idioma inválido", errorDesc: parsedBody.error.format() }, { status: 400 });
        }
        const { language } = parsedBody.data;

        const { id } = await context.params;
        const found = await resumeService.SearchMyCVsById(userId, id);
        if (found.success != true || !found.data) {
            return NextResponse.json({ message: "Currículo não encontrado" }, { status: 404 });
        }
        const source = found.data as unknown as Resume;

        // 1) Fail-fast sem saldo (evita gastar chamada de IA).
        const balance = await creditsService.checkBalance(userId);
        // Falha ao ler o saldo conta como sem saldo: não gasta IA sem saber se dá para cobrar.
        const available = balance.success ? ((balance.data as { balance?: number } | undefined)?.balance ?? 0) : 0;
        if (available < RESUME_TRANSLATION_COST) {
            return NextResponse.json(
                {
                    message: `Créditos insuficientes: cada tradução custa ${RESUME_TRANSLATION_COST} créditos e você tem ${available}.`,
                    code: "INSUFFICIENT_BALANCE",
                },
                { status: 402 },
            );
        }

        // 2) Tradução. Se a IA falhar, NÃO debita e devolve a causa real.
        let translated;
        try {
            translated = await translateResume(source, language);
        } catch (error) {
            console.error("Falha na tradução de currículo com IA", error);
            return NextResponse.json(
                { message: error instanceof Error ? error.message : "Falha ao traduzir o currículo com a IA" },
                { status: 502 },
            );
        }

        // 3) Grava a cópia. Saída da IA que não passa no resumeSchema também não debita.
        const created = await resumeService.createResume(userId, {
            ...translated,
            title: `${translated.title} (${language.toUpperCase()})`,
            idioms: translated.idioms.filter((i) => i.language && i.level),
            template: source.template,
            language,
            isDefault: false,
            // validado em runtime pelo resumeSchema dentro do createResume
        } as IResumeDataInput);
        if (created.success != true) {
            console.error("Tradução reprovada no resumeSchema", JSON.stringify(created.errorDesc));
            return NextResponse.json({ message: "A IA devolveu um currículo inválido. Tente novamente." }, { status: 502 });
        }

        // 4) Débito só depois da cópia gravada.
        const debit = await creditsService.debitFixed(userId, {
            amount: RESUME_TRANSLATION_COST,
            reason: "Tradução de currículo com IA",
            referenceId: id,
            idempotencyKey: randomUUID(),
        });
        if (debit.success != true) {
            // Saldo gasto por uma requisição concorrente entre o checkBalance e aqui:
            // desfaz a cópia para não entregar tradução sem cobrança.
            await resumeService.deleteMyResume(userId, (created.data as { id: string }).id);
            return NextResponse.json({ message: debit.message ?? "Falha ao debitar créditos", code: debit.code }, { status: 402 });
        }

        return NextResponse.json({ success: true, data: created.data });
    } catch (error) {
        console.error("Erro na rota POST /api/resumes/[id]/translate", error);
        return NextResponse.json({ message: "Falha ao traduzir o currículo" }, { status: 500 });
    }
}
