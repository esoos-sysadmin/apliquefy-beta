import { z } from "zod";
import type { ResumeAnalysis } from "../../../app/types/resume";

// Paths que a IA pode sugerir alterar. Bate 1:1 com o shape do Resume.
const ALLOWED_ROOTS = new Set(["title", "personalInfo", "skills", "experience", "education", "idioms"]);
const DANGEROUS = new Set(["__proto__", "prototype", "constructor"]);

function isSafePath(path: string): boolean {
    const segs = path.split(".");
    const root = segs[0];
    if (!root || !ALLOWED_ROOTS.has(root)) return false;
    return segs.every((s) => s.length > 0 && !DANGEROUS.has(s));
}

const aiSuggestionSchema = z.object({
    section: z.string().min(1),
    title: z.string().min(1),
    rationale: z.string().min(1),
    path: z.string().min(1),
    currentValue: z.string().default(""),
    suggestedValue: z.union([z.string(), z.array(z.string())]),
});

const aiAnalysisSchema = z.object({
    overallFeedback: z.string(),
    suggestions: z.array(aiSuggestionSchema),
});

const SYSTEM_PROMPT = `Você é um especialista sênior em recrutamento e revisão de currículos no Brasil.
Recebe um currículo em JSON e devolve uma análise construtiva do que pode melhorar.

Responda SOMENTE com um objeto JSON com esta forma:
{
  "overallFeedback": "parágrafo curto em português com a avaliação geral e prioridades",
  "suggestions": [
    {
      "section": "rótulo curto da seção (ex: 'Resumo profissional', 'Experiência 1', 'Habilidades')",
      "title": "resumo curto do ajuste",
      "rationale": "por que esse ajuste melhora o currículo",
      "path": "caminho do campo a alterar",
      "currentValue": "valor atual (string, use '' se vazio)",
      "suggestedValue": "novo valor sugerido, já pronto para substituir o campo"
    }
  ]
}

Regras dos "path" (use exatamente estes formatos, nada além):
- "title" — título do currículo
- "personalInfo.professionalSummary" — resumo profissional
- "personalInfo.jobTitle" — cargo alvo
- "experience.<i>.description" — descrição da experiência de índice i (0-based)
- "experience.<i>.jobArea" — área de atuação da experiência i
- "education.<i>.nameOfGraduation" — nome do curso da formação i
- "skills" — lista completa de habilidades; nesse caso suggestedValue DEVE ser um array de strings

Regras de conteúdo:
- Escreva tudo em português.
- Não invente fatos, datas, empresas ou tecnologias que não estejam no currículo. Reescreva/melhore o que já existe.
- Cada sugestão deve ser independente e aplicável isoladamente.
- suggestedValue é sempre o valor final do campo (não um diff). Para "skills" é um array; para o resto é uma string.
- Gere entre 3 e 8 sugestões, priorizando impacto.`;

export async function analyzeResume(resume: unknown): Promise<ResumeAnalysis> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OPENAI_API_KEY não configurada no ambiente do web");
    }

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model,
            temperature: 0.4,
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `Currículo (JSON):\n${JSON.stringify(resume)}` },
            ],
        }),
    });

    if (!response.ok) {
        const detail = await response.text().catch(() => "");
        console.error("Falha na chamada à OpenAI para análise de currículo", response.status, detail);

        let code = "";
        try {
            code = JSON.parse(detail)?.error?.code ?? "";
        } catch {
            // corpo não-JSON: mantém code vazio e cai no genérico
        }

        if (response.status === 429 && code === "insufficient_quota") {
            throw new Error(
                "A conta OpenAI configurada está sem cota/créditos. Ative o billing em platform.openai.com/account/billing e tente novamente.",
            );
        }
        if (response.status === 429) {
            throw new Error("Limite de requisições da OpenAI atingido. Tente novamente em alguns instantes.");
        }
        if (response.status === 401) {
            throw new Error("OPENAI_API_KEY inválida ou sem permissão para este modelo.");
        }
        throw new Error("Falha ao gerar a análise do currículo (OpenAI).");
    }

    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content;

    if (typeof content !== "string") {
        throw new Error("Resposta da IA sem conteúdo");
    }

    const parsed = aiAnalysisSchema.safeParse(JSON.parse(content));
    if (!parsed.success) {
        console.error("Saída da IA em formato inesperado", parsed.error.format());
        throw new Error("A IA retornou um formato inesperado");
    }

    // descarta paths fora do allowlist antes de devolver ao cliente
    const suggestions = parsed.data.suggestions
        .filter((s) => isSafePath(s.path))
        .map((s, i) => ({ ...s, id: `s${i}` }));

    return { overallFeedback: parsed.data.overallFeedback, suggestions };
}
