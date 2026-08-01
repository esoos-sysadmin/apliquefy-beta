import { createHash } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { app } from "electron";
import { apiFetch } from "./backend-api-service";

type RenderResumeResponse = {
    path: string;
    hash: string;
    cached: boolean;
};

/**
 * Baixa o PDF do currículo da API web e grava em `userData/resume-pdfs`.
 *
 * O engine Python tinha um segundo renderizador (reportlab) que lia nomes de campo
 * que o banco nunca gravou — o anexo saía sem empresa, sem cargo e sem formação.
 * Agora existe um gerador só (`apps/web/app/lib/resume-pdf.ts`), então o arquivo
 * anexado é idêntico ao que o usuário baixa no painel.
 */
export async function renderResumePdf(resumeId: string, styleId: string = "default"): Promise<RenderResumeResponse> {
    void styleId; // reservado para múltiplos templates

    const response = await apiFetch(`/api/resumes/${resumeId}/pdf`, { headers: { Accept: "application/pdf" } });
    if (!response.ok) {
        throw new Error(`Falha ao gerar o PDF do currículo (HTTP ${response.status})`);
    }

    const bytes = Buffer.from(await response.arrayBuffer());
    const dir = path.join(app.getPath("userData"), "resume-pdfs");
    await mkdir(dir, { recursive: true });

    // Nome por conteúdo: currículo editado gera arquivo novo, sem invalidação manual.
    const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 16);
    const target = path.join(dir, `${resumeId}-${hash}.pdf`);
    await writeFile(target, bytes);

    return { path: target, hash, cached: false };
}
