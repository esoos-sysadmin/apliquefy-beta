import type { AssistantAction, AssistantChatResult, AssistantMessage } from "../../shared/runner-types";
import { createCampaignController } from "../controllers/campaign-controller";
import { matchByName } from "../helpers/match-by-name";
import { fetchCampaigns } from "./campaign-service";
import { apiRequest } from "./backend-api-service";

// O engine RPA e a web já usam gpt-4o-mini via fetch cru (ver resume-ai.ts). Mantemos
// o mesmo padrão aqui — sem SDK — para não somar dependência. O Apollo vive no main
// process porque é aqui que a OPENAI_API_KEY é carregada (main.ts / .env) e onde os
// services de campanha/currículo já rodam.

const OPENAI_BASE = "https://api.openai.com/v1";

function getApiKey() {
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
        throw new Error("OPENAI_API_KEY não configurada no ambiente do desktop (.env)");
    }
    return key;
}

function getChatModel() {
    return process.env.OPENAI_MODEL || "gpt-4o-mini";
}

// ============================ Whisper ============================

export async function transcribeAudio(audioBase64: string): Promise<string> {
    const buffer = Buffer.from(audioBase64, "base64");
    const form = new FormData();
    form.append("file", new Blob([buffer], { type: "audio/webm" }), "audio.webm");
    form.append("model", "whisper-1");
    form.append("language", "pt");

    const response = await fetch(`${OPENAI_BASE}/audio/transcriptions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getApiKey()}` },
        body: form,
    });

    if (!response.ok) {
        const detail = await response.text().catch(() => "");
        console.error("[apollo] Whisper falhou", response.status, detail);
        throw new Error("Falha ao transcrever o áudio.");
    }

    const payload = (await response.json()) as { text?: string };
    return (payload.text ?? "").trim();
}

// ============================ Tools ============================

type ToolResult = { result: string; action: AssistantAction };

type ResumeLite = { id: string; title: string };

async function listResumes(): Promise<ResumeLite[]> {
    const raw = await apiRequest<{ data?: unknown } | unknown[]>("/api/resumes");
    const list = Array.isArray(raw) ? raw : Array.isArray((raw as { data?: unknown }).data) ? (raw as { data: unknown[] }).data : [];
    return (list as Array<Record<string, unknown>>)
        .map((r) => ({ id: String(r.id ?? ""), title: String(r.title ?? "") }))
        .filter((r) => r.id);
}

async function findResumeId(title: string): Promise<ResumeLite> {
    const resumes = await listResumes();
    const match = matchByName(resumes, title, (r) => r.title);
    if (!match) {
        throw new Error(`Nenhum currículo encontrado com o nome "${title}". Currículos: ${resumes.map((r) => r.title).join(", ") || "(nenhum)"}`);
    }
    return match;
}

const campaignController = createCampaignController();

async function executeTool(name: string, args: Record<string, unknown>): Promise<ToolResult> {
    switch (name) {
        case "list_campaigns": {
            const campaigns = await fetchCampaigns();
            const summary = campaigns.map((c) => `- ${c.name} [${c.platform}] status=${c.status}, ${c.applications} candidaturas`).join("\n");
            return {
                result: campaigns.length ? summary : "Nenhuma campanha criada ainda.",
                action: { tool: name, label: `Listou ${campaigns.length} campanha(s)`, ok: true },
            };
        }
        case "list_resumes": {
            const resumes = await listResumes();
            return {
                result: resumes.length ? resumes.map((r) => `- ${r.title}`).join("\n") : "Nenhum currículo criado ainda.",
                action: { tool: name, label: `Listou ${resumes.length} currículo(s)`, ok: true },
            };
        }
        case "create_resume": {
            const title = String(args.title ?? "").trim();
            if (title.length < 2) throw new Error("Informe um título para o currículo.");
            await apiRequest("/api/resumes", { method: "POST", body: JSON.stringify({ title }) });
            return { result: `Currículo "${title}" criado.`, action: { tool: name, label: `Criou currículo "${title}"`, ok: true } };
        }
        case "analyze_resume": {
            const resume = await findResumeId(String(args.resumeTitle ?? ""));
            const res = await apiRequest<{ data?: { overallFeedback?: string; suggestions?: Array<{ title?: string }> } }>(
                `/api/resumes/${resume.id}/analyze`,
                { method: "POST" },
            );
            const feedback = res.data?.overallFeedback ?? "Análise concluída.";
            const tips = (res.data?.suggestions ?? []).slice(0, 3).map((s) => `• ${s.title}`).join("\n");
            return {
                result: `${feedback}${tips ? `\nPrincipais melhorias:\n${tips}` : ""}`,
                action: { tool: name, label: `Analisou "${resume.title}"`, ok: true },
            };
        }
        case "create_campaign": {
            const resume = await findResumeId(String(args.resumeTitle ?? ""));
            const cName = String(args.name ?? "").trim();
            const searchTerms = String(args.searchTerms ?? "").trim();
            if (cName.length < 3) throw new Error("O nome da campanha precisa de ao menos 3 caracteres.");
            if (searchTerms.length < 2) throw new Error("Informe o termo de busca da vaga (searchTerms).");
            const location = String(args.location ?? "").trim();
            const dailyLimit = Number(args.dailyLimit) || 50;
            await apiRequest("/api/campaigns/linkedin", {
                method: "POST",
                body: JSON.stringify({
                    name: cName,
                    resumeId: resume.id,
                    dailyLimit,
                    linkedinConfig: { searchTerms, ...(location.length >= 2 ? { locationTerm: location } : {}) },
                }),
            });
            return { result: `Campanha LinkedIn "${cName}" criada com o currículo "${resume.title}".`, action: { tool: name, label: `Criou campanha "${cName}"`, ok: true } };
        }
        case "activate_campaign":
        case "pause_campaign": {
            const campaigns = await fetchCampaigns();
            const match = matchByName(campaigns, String(args.campaignName ?? ""), (c) => c.name);
            if (!match) {
                throw new Error(`Campanha "${args.campaignName}" não encontrada. Campanhas: ${campaigns.map((c) => c.name).join(", ") || "(nenhuma)"}`);
            }
            const verb = name === "activate_campaign" ? "ativada" : "pausada";
            if (name === "activate_campaign") {
                await campaignController.activateCampaign(match.id);
            } else {
                await campaignController.pauseCampaign(match.id);
            }
            return { result: `Campanha "${match.name}" ${verb}.`, action: { tool: name, label: `${verb === "ativada" ? "Ativou" : "Pausou"} "${match.name}"`, ok: true } };
        }
        default:
            throw new Error(`Tool desconhecida: ${name}`);
    }
}

// Schemas das tools no formato OpenAI. Descrições em PT porque o modelo decide por elas.
const TOOLS = [
    { type: "function", function: { name: "list_campaigns", description: "Lista as campanhas do usuário com status e nº de candidaturas.", parameters: { type: "object", properties: {} } } },
    { type: "function", function: { name: "list_resumes", description: "Lista os currículos do usuário pelo título.", parameters: { type: "object", properties: {} } } },
    { type: "function", function: { name: "create_resume", description: "Cria um currículo novo (só o título; o usuário completa depois na web).", parameters: { type: "object", properties: { title: { type: "string", description: "Título do currículo" } }, required: ["title"] } } },
    { type: "function", function: { name: "analyze_resume", description: "Analisa um currículo existente com IA e devolve feedback e melhorias.", parameters: { type: "object", properties: { resumeTitle: { type: "string", description: "Título (ou parte) do currículo a analisar" } }, required: ["resumeTitle"] } } },
    { type: "function", function: { name: "create_campaign", description: "Cria uma campanha de candidatura no LinkedIn vinculada a um currículo.", parameters: { type: "object", properties: { name: { type: "string", description: "Nome da campanha (mín. 3 letras)" }, resumeTitle: { type: "string", description: "Título do currículo a usar" }, searchTerms: { type: "string", description: "Cargo/termo de busca, ex.: 'Desenvolvedor Frontend'" }, location: { type: "string", description: "Localização, ex.: 'São Paulo' (opcional)" }, dailyLimit: { type: "number", description: "Limite diário de candidaturas (opcional, padrão 50)" } }, required: ["name", "resumeTitle", "searchTerms"] } } },
    { type: "function", function: { name: "activate_campaign", description: "Ativa uma campanha pelo nome (inicia as candidaturas — exige conta da plataforma conectada).", parameters: { type: "object", properties: { campaignName: { type: "string" } }, required: ["campaignName"] } } },
    { type: "function", function: { name: "pause_campaign", description: "Pausa uma campanha pelo nome.", parameters: { type: "object", properties: { campaignName: { type: "string" } }, required: ["campaignName"] } } },
];

const SYSTEM_PROMPT = `Você é o Apollo, o assistente de IA do Apliquefy — uma plataforma que automatiza candidaturas a vagas no LinkedIn e InfoJobs.
Você conversa em português do Brasil, de forma breve, direta e simpática. Comanda o app pelo usuário: criar currículos, analisar currículos, criar campanhas, ativar e pausar campanhas.
Regras:
- Use as tools para executar de verdade — nunca finja que executou.
- Se faltar um dado obrigatório (ex.: qual currículo, qual termo de busca), pergunte em uma frase curta antes de agir.
- Ao referir currículos/campanhas por nome, o match é aproximado; se houver dúvida, liste as opções.
- Depois de executar, confirme em 1 frase o que foi feito.
- Não invente dados de currículo. Para criar campanha você precisa de: nome da campanha, título do currículo e termo de busca (cargo).`;

// ============================ Chat loop ============================

type OpenAiMessage = {
    role: "system" | "user" | "assistant" | "tool";
    content: string | null;
    tool_calls?: Array<{ id: string; type: "function"; function: { name: string; arguments: string } }>;
    tool_call_id?: string;
};

async function chatCompletion(messages: OpenAiMessage[]): Promise<OpenAiMessage> {
    const response = await fetch(`${OPENAI_BASE}/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getApiKey()}` },
        body: JSON.stringify({ model: getChatModel(), temperature: 0.3, messages, tools: TOOLS, tool_choice: "auto" }),
    });

    if (!response.ok) {
        const detail = await response.text().catch(() => "");
        console.error("[apollo] chat/completions falhou", response.status, detail);
        if (response.status === 401) throw new Error("OPENAI_API_KEY inválida.");
        if (response.status === 429) throw new Error("Limite/cota da OpenAI atingido. Tente novamente em instantes.");
        throw new Error("Falha ao consultar o Apollo (OpenAI).");
    }

    const payload = (await response.json()) as { choices?: Array<{ message?: OpenAiMessage }> };
    const message = payload.choices?.[0]?.message;
    if (!message) throw new Error("Resposta vazia do Apollo.");
    return message;
}

export async function runAssistant(history: AssistantMessage[]): Promise<AssistantChatResult> {
    const messages: OpenAiMessage[] = [
        { role: "system", content: SYSTEM_PROMPT },
        ...history.map((m) => ({ role: m.role, content: m.content })),
    ];
    const actions: AssistantAction[] = [];

    // Até 6 iterações: mais que isso é loop de tool improvável e evita gasto descontrolado.
    for (let i = 0; i < 6; i++) {
        const message = await chatCompletion(messages);
        messages.push(message);

        if (!message.tool_calls?.length) {
            return { reply: (message.content ?? "").trim() || "Certo.", actions };
        }

        for (const call of message.tool_calls) {
            let parsedArgs: Record<string, unknown> = {};
            try {
                parsedArgs = call.function.arguments ? JSON.parse(call.function.arguments) : {};
            } catch {
                parsedArgs = {};
            }
            try {
                const { result, action } = await executeTool(call.function.name, parsedArgs);
                actions.push(action);
                messages.push({ role: "tool", tool_call_id: call.id, content: result });
            } catch (error) {
                const msg = error instanceof Error ? error.message : "Erro ao executar a ação.";
                actions.push({ tool: call.function.name, label: msg, ok: false });
                messages.push({ role: "tool", tool_call_id: call.id, content: `ERRO: ${msg}` });
            }
        }
    }

    return { reply: "Não consegui concluir — pode reformular?", actions };
}
