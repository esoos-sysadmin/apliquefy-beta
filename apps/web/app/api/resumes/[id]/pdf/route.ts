import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@repo/database";
import type { Resume } from "../../../../types/resume";
import { buildResumePdf, resumeFileName } from "../../../../lib/resume-pdf";

// Serve o MESMO PDF que o botão de download do painel gera — o runner baixa daqui
// para anexar na candidatura, em vez de ter um segundo renderizador em Python.
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ message: "Usuário não autenticado" }, { status: 401 });
        }

        const { id } = await context.params;
        const resume = await prisma.resume.findFirst({ where: { id, userId } });

        if (!resume) {
            return NextResponse.json({ message: "Currículo não encontrado", code: "NOT_FOUND" }, { status: 404 });
        }

        const payload = resume as unknown as Resume;

        return new NextResponse(buildResumePdf(payload) as unknown as BodyInit, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename="${encodeURIComponent(resumeFileName(payload))}"`,
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        console.error("Erro na rota GET /api/resumes/[id]/pdf:", error);
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
    }
}
