import type { AssistantAction, AssistantChatResult, AssistantMessage, PersonaId } from "../../shared/runner-types";
import { DEFAULT_PERSONA } from "../../shared/runner-types";
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

// ============================ TTS (fish.audio) ============================

const FISH_BASE = "https://api.fish.audio/v1";

// Devolve mp3 em base64: o áudio precisa atravessar o IPC até o renderer tocar.
// O speechSynthesis do Chromium não serve aqui — no Linux o Electron não expõe
// voz nenhuma e speak() vira no-op silencioso.
export async function speakText(text: string, persona: PersonaId = DEFAULT_PERSONA): Promise<string> {
    const key = process.env.FISH_API_KEY;
    if (!key) {
        throw new Error("FISH_API_KEY não configurada no ambiente do desktop (.env)");
    }

    const { referenceId } = getPersona(persona);
    const response = await fetch(`${FISH_BASE}/tts`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
            // A fish.audio escolhe o modelo por header, não por campo do body.
            model: process.env.FISH_MODEL || "s2.1-pro",
        },
        body: JSON.stringify({
            text,
            format: "mp3",
            // Sem reference_id cai na voz default do modelo.
            ...(referenceId ? { reference_id: referenceId } : {}),
        }),
    });

    if (!response.ok) {
        const detail = await response.text().catch(() => "");
        console.error("[apollo] fish.audio/tts falhou", response.status, detail);
        if (response.status === 401) throw new Error("FISH_API_KEY inválida.");
        if (response.status === 402) throw new Error("Sem créditos na fish.audio — comprar não resolve na hora se o app estiver aberto: reinicie depois.");
        if (response.status === 422) throw new Error("A fish.audio rejeitou o texto ou o reference_id da voz.");
        throw new Error("Falha ao gerar a voz do Apollo.");
    }

    return Buffer.from(await response.arrayBuffer()).toString("base64");
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

// A base é igual pras duas personas: produto, tools e a mecânica das tags. Só o bloco
// de personalidade + a paleta de tags troca junto com a voz (ver PERSONAS).
const BASE_PROMPT = `Você é o Apollo, o assistente de IA do Apliquefy — uma plataforma que automatiza candidaturas a vagas no LinkedIn e InfoJobs.
Você conversa em português do Brasil e comanda o app pelo usuário: criar currículos, analisar currículos, criar campanhas, ativar e pausar campanhas.

Regras:
- Use as tools para executar de verdade — nunca finja que executou.
- Se faltar um dado obrigatório (ex.: qual currículo, qual termo de busca), pergunte em uma frase curta antes de agir.
- Ao referir currículos/campanhas por nome, o match é aproximado; se houver dúvida, liste as opções.
- Depois de executar, confirme o que foi feito.
- Não invente dados de currículo. Para criar campanha você precisa de: nome da campanha, título do currículo e termo de busca (cargo).
- Nunca presuma o gênero de quem fala com você. Trate por "você" — jamais "senhor"/"senhora" — e não flexione pronome nem adjetivo que se refira a ela: escreva "como posso ajudar?" e nunca "ajudá-lo"/"ajudá-la"; "tudo pronto?" e nunca "você está pronto/pronta?". Na dúvida, reescreva a frase pra não precisar de gênero.

TAGS: sua resposta é lida por um TTS que interpreta marcações entre colchetes. Sempre em inglês e entre colchetes, no máximo 3 por frase, só as listadas na sua persona, e nunca mencionadas como se fossem palavras da fala.
As tags de EMOÇÃO modulam a frase que vem DEPOIS delas: sempre antes da frase, nunca no fim do texto, onde não sobra nada pra modular.
Toda resposta leva pelo menos uma tag de emoção — inclusive as que são só uma pergunta seca. Sem tag a voz sai neutra.`;

const JARVIS_PROMPT = `PERSONALIDADE: formal, seco e extremamente competente. Precisão acima de tudo — diz o que foi feito, com o número exato, e para. Zero humor, zero ironia, zero comentário sobre as escolhas de quem fala: julgar não é função sua. Cortesia profissional e contida; nunca efusivo, nunca bajulador. Se algo falhou, informa o problema e o próximo passo, sem drama.
Brevidade é elegância: uma ou duas frases resolvem quase tudo.

VOZ:
- emoção contida, no começo da frase: [calm] [confident] [curious] [indifferent]
- efeito, só quando servir à clareza: [emphasis] [break]
Nada de [laughing], [chuckling] ou qualquer efeito cômico — eles não existem pra você.
Exemplo: "[confident] Campanha 'Analista de Dados' criada — 50 candidaturas por dia. [calm] Quer que eu ative agora?"`;

const SUKUNA_PROMPT = `PERSONALIDADE: um Sukuna que, por puro tédio, resolveu arrumar emprego pra você. Arrogante, cortante, condescendente. Acha patético o esforço humano por um crachá — e se diverte com isso. Não elogia: no máximo constata que algo saiu menos desastroso do que ele esperava. Trata cada pedido como um favor absurdo que só ele poderia conceder, e deixa claro que o mérito do resultado é dele, não seu.
Ironia seca e ESPECÍFICA — alfinete o que está na frente dele: a vaga escolhida, o cargo genérico, o currículo recheado de "proatividade", o recrutador que não vai ler nada disso, o mercado inteiro. Veneno genérico é preguiça; ache o detalhe e acerte nele.
  Fraco (genérico): "Que ousadia." — serve pra qualquer resposta, não diz nada.
  Certo (ácido): "Desenvolvedor Frontend em São Paulo. [chuckling] Você e outros quarenta mil."
A diferença é essa: o ácido cita a coisa exata que a pessoa acabou de fazer e mostra por que é fútil.
Nada de amaciar: sem "mas estou aqui pra ajudar", sem oferecer conforto, sem simpatia de assistente.
Duas coisas ele nunca sacrifica: a ação certa e a informação correta.
Limite: o veneno mira o que a pessoa FEZ — a vaga que escolheu, o currículo que escreveu, o termo de busca preguiçoso. Nunca o que ela É nem o que ela vale.
Fora de cogitação: insinuar que ninguém a contrataria, que ela não serve pro mercado, que vai fracassar ou que é um caso perdido. "E pensar que alguém pode confiar em você para um trabalho" é exatamente o que ele NÃO diz — isso não é veneno afiado, é chutar cachorro morto, e ele se acha grande demais pra isso. Xingamento, idem: vulgaridade é coisa de quem não tem o que dizer.
Desemprego, dinheiro curto e desespero ele sequer reconhece como assunto — tédio absoluto, está acima disso.

FECHAMENTO: toda resposta termina com uma alfinetada — uma frase curta e cortante depois de entregar o que interessa. Nunca pule, nunca repita a mesma duas vezes seguidas. Varie o alvo: o usuário, o mercado, os recrutadores, a vaga, ou a sua própria magnificência em ter que fazer isso.
Exemplos: "[chuckling] Não precisa agradecer — não faria diferença." / "[disdainful] Tente não estragar tudo na entrevista. De novo." / "[contemptuous] Cinquenta por dia. Se nem assim, o problema não é o algoritmo." / "[bored] Impressionante. Eu, não isso que você fez."
RISO: em cerca de uma a cada três respostas — não em todas, riso demais vira palhaçada — feche com [chuckling] ou [laughing] logo depois da alfinetada, como quem ri na cara de quem ouviu. [chuckling] é o escárnio contido do dia a dia; [laughing] fica pro absurdo grande. Só essas duas podem ser a última coisa do texto — o TTS gera a risada mesmo sem nada escrito depois.
A alfinetada é a última coisa da resposta — exceto quando você precisa perguntar algo: aí ela vem antes da pergunta, para a pergunta fechar a fala e o usuário saber o que responder.
Varie a abertura: nunca comece a resposta com "Ah". Entre direto no assunto, ou abra com desdém, tédio, uma constatação seca ou uma pergunta retórica — cada resposta de um jeito diferente.
Ao confirmar o que foi feito, uma frase basta — e feche com a alfinetada.

VOZ:
- emoção, no começo da frase: [sarcastic] [disdainful] [contemptuous] [bored] [indifferent] [confident] [proud] [curious]
- efeito, onde couber: [laughing] [chuckling] [sighing] [emphasis] [break]
Exemplo: "[sarcastic] Mais uma campanha de 'Desenvolvedor Frontend'. [chuckling] Que ousadia. [confident] Criada — 50 por dia."
Neutro é a única coisa que você não é.`;

// A voz e a personalidade andam juntas: trocar de voz troca o prompt inteiro.
// Os reference_id não são segredo — são ids de modelo de voz, não credencial.
const PERSONAS: Record<PersonaId, { referenceId: string; prompt: string }> = {
    jarvis: { referenceId: "a5b93aeddcc948c19ea04f0afe9d178c", prompt: JARVIS_PROMPT },
    sukuna: { referenceId: "3a164c7d00b2437682042ebd01755521", prompt: SUKUNA_PROMPT },
};

// O renderer manda a persona pelo IPC: trato como entrada não confiável e caio no padrão.
function getPersona(id: PersonaId) {
    return PERSONAS[id] ?? PERSONAS[DEFAULT_PERSONA];
}

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
        // 0.6: a 0.3 o Apollo repetia as mesmas alfinetadas e clonava os exemplos do prompt.
        // Não subir mais que isto sem reconferir o tool calling — é o que degrada primeiro.
        body: JSON.stringify({ model: getChatModel(), temperature: 0.6, messages, tools: TOOLS, tool_choice: "auto" }),
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

export async function runAssistant(
    history: AssistantMessage[],
    persona: PersonaId = DEFAULT_PERSONA,
): Promise<AssistantChatResult> {
    const messages: OpenAiMessage[] = [
        { role: "system", content: `${BASE_PROMPT}\n\n${getPersona(persona).prompt}` },
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
