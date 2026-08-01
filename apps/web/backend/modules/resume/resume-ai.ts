import { z } from "zod";
import type { ResumeAnalysis } from "../../../app/types/resume";
import type { ResumeFormData } from "../../../app/types/resume-form";
import { emptyResumeForm, idiomLevelOptions, seniorityOptions } from "../../../app/lib/constants/resume-form";

// Paths que a IA pode sugerir alterar. Bate 1:1 com o shape do Resume.
const ALLOWED_ROOTS = new Set(["title", "personalInfo", "skills", "experience", "education", "idioms"]);
const DANGEROUS = new Set(["__proto__", "prototype", "constructor"]);

function isSafePath(path: string): boolean {
    const segs = path.split(".");
    const root = segs[0];
    if (!root || !ALLOWED_ROOTS.has(root)) return false;
    return segs.every((s) => s.length > 0 && !DANGEROUS.has(s));
}

export function currentValueToText(value: unknown): string {
    if (typeof value === "string") return value;
    if (Array.isArray(value)) return value.filter((v) => typeof v === "string" || typeof v === "number").join(", ");
    if (value == null) return "";
    return typeof value === "object" ? "" : String(value);
}

const aiSuggestionSchema = z.object({
    section: z.string().min(1),
    title: z.string().min(1),
    rationale: z.string().min(1),
    path: z.string().min(1),
    // Só vira texto riscado na UI. O modelo manda array aqui (path "skills", cuja lista
    // atual é uma lista), e um z.string() estrito derrubava a análise inteira por isso.
    currentValue: z.unknown().transform(currentValueToText),
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

async function chatJson(messages: unknown[], temperature: number): Promise<string> {
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
            temperature,
            response_format: { type: "json_object" },
            messages,
        }),
    });

    if (!response.ok) {
        const detail = await response.text().catch(() => "");
        console.error("Falha na chamada à OpenAI", response.status, detail);

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
        throw new Error("Falha ao falar com a IA (OpenAI).");
    }

    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content;

    if (typeof content !== "string") {
        throw new Error("Resposta da IA sem conteúdo");
    }

    return content;
}

export async function analyzeResume(resume: unknown): Promise<ResumeAnalysis> {
    const content = await chatJson(
        [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: `Currículo (JSON):\n${JSON.stringify(resume)}` },
        ],
        0.4,
    );

    const parsed = aiAnalysisSchema.safeParse(JSON.parse(content));
    if (!parsed.success) {
        // JSON.stringify e não o objeto cru: o console trunca em profundidade 2 e some
        // justamente com a mensagem do campo que falhou.
        console.error("Saída da IA em formato inesperado", JSON.stringify(parsed.error.format()));
        throw new Error("A IA retornou um formato inesperado");
    }

    // descarta paths fora do allowlist antes de devolver ao cliente
    const suggestions = parsed.data.suggestions
        .filter((s) => isSafePath(s.path))
        .map((s, i) => ({ ...s, id: `s${i}` }));

    return { overallFeedback: parsed.data.overallFeedback, suggestions };
}

// ---------------------------------------------------------------------------
// Importação de currículo a partir de um PDF
// ---------------------------------------------------------------------------

// Campo ausente/nulo vira "": PDF de currículo não tem padrão e um campo faltando
// não pode derrubar a extração inteira. O usuário revisa/completa no formulário.
// (`.nullish()` já torna a chave opcional — nada de `.partial()`, que traria
// `undefined` de volta e sobrescreveria o default no spread.)
const optStr = z.string().nullish().transform((v) => v ?? "");
const optEnum = <T extends readonly [string, ...string[]]>(values: T) =>
    z.enum(values).nullish().catch(null).transform((v) => v ?? "");

const extractedResumeSchema = z.object({
    title: optStr,
    personalInfo: z
        .object({
            name: optStr,
            jobTitle: optStr,
            email: optStr,
            contact: optStr,
            address: optStr,
            desiredSalary: optStr,
            seniority: optEnum(seniorityOptions),
            linkedinUrl: optStr,
            portfolio: optStr,
            github: optStr,
            professionalSummary: optStr,
        })
        .nullish(),
    experience: z
        .array(
            z.object({
                companyName: optStr,
                jobType: optStr,
                description: optStr,
                jobArea: optStr,
                jobStartDate: optStr,
                jobEndDate: optStr,
                isActualJob: z.boolean().nullish().transform((v) => v ?? false),
            }),
        )
        .nullish(),
    education: z
        .array(
            z.object({
                nameOfInstitution: optStr,
                nameOfGraduation: optStr,
                StartDateOfGraduation: optStr,
                EndDateOfGraduation: optStr,
            }),
        )
        .nullish(),
    skills: z.array(z.string()).nullish(),
    idioms: z
        .array(z.object({ language: optStr, level: optEnum(idiomLevelOptions) }))
        .nullish(),
});

const EXTRACT_PROMPT = `Você extrai dados estruturados de currículos em PDF (qualquer layout, qualquer idioma).

Responda SOMENTE com um objeto JSON nesta forma (use "" para o que não achar, nunca invente):
{
  "title": "título curto do currículo, ex: 'Currículo Dev Full Stack'",
  "personalInfo": {
    "name": "", "jobTitle": "cargo alvo/atual", "email": "", "contact": "telefone com DDD",
    "address": "cidade/estado", "desiredSalary": "", "seniority": "${seniorityOptions.join(" | ")}",
    "linkedinUrl": "URL completa", "portfolio": "URL completa", "github": "URL completa",
    "professionalSummary": "resumo profissional, no máximo 500 caracteres"
  },
  "experience": [{ "companyName": "", "jobType": "ex: CLT, PJ, Estágio", "description": "atividades e resultados",
                   "jobArea": "área de atuação", "jobStartDate": "YYYY-MM", "jobEndDate": "YYYY-MM ou '' se atual",
                   "isActualJob": false }],
  "education": [{ "nameOfInstitution": "", "nameOfGraduation": "", "StartDateOfGraduation": "YYYY-MM", "EndDateOfGraduation": "YYYY-MM" }],
  "skills": ["habilidade", "..."],
  "idioms": [{ "language": "", "level": "${idiomLevelOptions.join(" | ")}" }]
}

Regras:
- Datas SEMPRE no formato YYYY-MM. Se só houver o ano, use YYYY-01.
- "seniority" e "level" devem ser exatamente um dos valores listados, ou "" se não der para inferir.
- Não invente empresas, datas, tecnologias ou contatos que não estejam no PDF.
- Experiências da mais recente para a mais antiga.
- Traduza rótulos para português, mas preserve nomes próprios e tecnologias como estão.`;

export function normalizeExtractedResume(raw: unknown): ResumeFormData {
    const parsed = extractedResumeSchema.safeParse(raw);
    if (!parsed.success) {
        console.error("Extração de PDF em formato inesperado", JSON.stringify(parsed.error.format()));
        throw new Error("A IA retornou um formato inesperado ao ler o PDF");
    }

    const data = parsed.data;
    return {
        title: data.title || "Currículo importado",
        personalInfo: { ...emptyResumeForm.personalInfo, ...data.personalInfo },
        experience: data.experience ?? [],
        education: data.education ?? [],
        // o form rejeita habilidade com menos de 2 letras; corta lixo de OCR aqui
        skills: (data.skills ?? []).map((s) => s.trim()).filter((s) => s.length > 1),
        idioms: (data.idioms ?? []).filter((i) => i.language),
    };
}

export async function extractResumeFromPdf(base64: string, filename: string): Promise<ResumeFormData> {
    const content = await chatJson(
        [
            { role: "system", content: EXTRACT_PROMPT },
            {
                role: "user",
                content: [
                    { type: "file", file: { filename, file_data: `data:application/pdf;base64,${base64}` } },
                    { type: "text", text: "Extraia os dados deste currículo no JSON especificado." },
                ],
            },
        ],
        0.1,
    );

    return normalizeExtractedResume(JSON.parse(content));
}
