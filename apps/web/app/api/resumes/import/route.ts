import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { extractResumeFromPdf } from "../../../../backend/modules/resume/resume-ai";

const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ message: "Usuário não autenticado" }, { status: 401 });
        }

        const form = await request.formData();
        const file = form.get("file");

        if (!(file instanceof File)) {
            return NextResponse.json({ message: "Envie o PDF no campo 'file'" }, { status: 400 });
        }
        // valida o tipo antes de ler o corpo: PDF errado só queimaria chamada de IA
        if (file.type !== "application/pdf") {
            return NextResponse.json({ message: "O arquivo precisa ser um PDF" }, { status: 400 });
        }
        if (file.size === 0 || file.size > MAX_BYTES) {
            return NextResponse.json({ message: "O PDF deve ter entre 1 byte e 10 MB" }, { status: 400 });
        }

        const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");

        try {
            const data = await extractResumeFromPdf(base64, file.name || "curriculo.pdf");
            return NextResponse.json({ success: true, data });
        } catch (error) {
            console.error("Falha ao extrair currículo do PDF", error);
            return NextResponse.json(
                { message: error instanceof Error ? error.message : "Falha ao ler o PDF com a IA" },
                { status: 502 },
            );
        }
    } catch (error) {
        console.error("Erro na rota POST /api/resumes/import", error);
        return NextResponse.json({ message: "Falha ao importar o currículo" }, { status: 500 });
    }
}
