// Espinha dorsal do funil /lp: respostas tipadas → derivados puros.
// Diagnóstico, planos e upsells leem daqui; nenhum número exibido nasce fora
// destas funções (regra: todo número vem da resposta da pessoa ou de constante do produto).
import { PLANS, UPSELLS, type Plan } from "../lib/constants/plans"

export type Segment = "dev" | "exec" | "varejo"
export type Computer = "own" | "shared" | "phone_only"
export type Feeling = "cv" | "me" | "filled" | "numb"
export type English = "none" | "basic" | "intermediate" | "advanced"
export type Raise = "same" | "plus20" | "plus50" | "double" | "usd"
export type Deadline = "asap" | "1m" | "3m" | "no_rush"
export type ProfileItem = "role" | "results" | "updated" | "tailored" | "linkedin"

export type Answers = {
    segment?: Segment
    area?: string
    computer?: Computer
    searchWeeks?: number // piso da faixa escolhida, em semanas
    appsPerWeek?: number
    minutesPerApp?: number
    responsesLastMonth?: number
    feeling?: Feeling
    profile?: ProfileItem[] // o que o currículo/perfil já tem (autodeclarado)
    english?: English
    income?: number // piso da faixa em R$/mês; 0 = sem renda, 0.1 = faixa "até X" (sem piso)
    raise?: Raise
    deadline?: Deadline
    targetRole?: string
}

export type QuestionId = keyof Answers
export type BumpId = "cv" | "kit_tech" | "kit_gestao" | "kit_varejo" | "carta" | "lista_tech" | "lista_gestao" | "lista_varejo"
export type OtoId = "voice" | "text"

export type Contact = { name: string; email: string; whatsapp: string; marketing: boolean }

export type Screen =
    | "home"
    | QuestionId
    | "bridge"
    | "analysis"
    | "gate"
    | "report"
    | "pricing"
    | "bump_cv"
    | "bump_segment"
    | "bump_letter"
    | "bump_jobs"
    | "checkout"
    | "oto"
    | "downsell"
    | "done"

export type FunnelState = {
    screen: Screen
    answers: Answers
    contact?: Contact
    issuedAt?: number // quando o contato foi entregue; vira data e nº do laudo
    plan?: Plan["slug"]
    bumps: BumpId[]
    oto?: OtoId
    paidAt?: number
    stripeSessionId?: string // Checkout Session paga; o OTO cobra no mesmo cartão a partir dela
    checkoutError?: string // motivo de volta do checkout (cancelado, assinatura já ativa…)
}

export const initialState: FunnelState = { screen: "home", answers: {}, bumps: [] }

// ── Perguntas ────────────────────────────────────────────────────────────────

export type Option = { value: string | number; label: string; hint?: string }
export type Question =
    | { id: QuestionId; kind: "choice"; title: string; help?: string; options: Option[] }
    | { id: "profile"; kind: "multi"; title: string; help?: string; options: Option[] }
    | { id: QuestionId; kind: "number"; title: string; help?: string; quick: number[]; unit: string; min: number; max: number }
    | { id: "targetRole"; kind: "text"; title: string; help?: string; suggestions: string[] }

export const SEGMENT_OPTIONS: Option[] = [
    { value: "dev", label: "Tecnologia", hint: "Inclusive vagas remotas no exterior" },
    { value: "exec", label: "Gestão e liderança", hint: "Coordenação, gerência, diretoria" },
    { value: "varejo", label: "Comércio, atendimento e escritório", hint: "Caixa, vendas, estoque, recepção" },
]

const AREAS: Record<Segment, string[]> = {
    dev: ["Front-end", "Back-end", "Full-stack", "Mobile", "Dados / IA", "DevOps / Cloud", "QA / Testes"],
    exec: ["Comercial", "Operações", "Finanças", "Pessoas / RH", "Marketing", "Tecnologia", "Outra área"],
    varejo: ["Caixa / Atendimento", "Vendas", "Estoque / Reposição", "Recepção / Secretariado", "Administrativo", "Telemarketing", "Outra área"],
}

const ROLE_SUGGESTIONS: Record<string, string[]> = {
    "Front-end": ["Desenvolvedor Front-end", "Frontend Engineer"],
    "Back-end": ["Desenvolvedor Back-end", "Backend Engineer"],
    "Full-stack": ["Desenvolvedor Full-stack", "Full Stack Engineer"],
    Mobile: ["Desenvolvedor Mobile", "Mobile Engineer"],
    "Dados / IA": ["Engenheiro de Dados", "Cientista de Dados"],
    "DevOps / Cloud": ["Engenheiro DevOps", "SRE"],
    "QA / Testes": ["Analista de QA", "QA Engineer"],
    "Caixa / Atendimento": ["Operador de Caixa", "Atendente"],
    Vendas: ["Vendedor", "Consultor de Vendas"],
    "Estoque / Reposição": ["Repositor", "Auxiliar de Estoque"],
    "Recepção / Secretariado": ["Recepcionista", "Secretária"],
    Administrativo: ["Auxiliar Administrativo", "Assistente Administrativo"],
    Telemarketing: ["Operador de Telemarketing", "Atendente de SAC"],
    Comercial: ["Gerente Comercial", "Diretor Comercial"],
    Operações: ["Gerente de Operações", "Head de Operações"],
    Finanças: ["Gerente Financeiro", "Controller"],
    "Pessoas / RH": ["Gerente de RH", "Head de Pessoas"],
    Marketing: ["Gerente de Marketing", "Head de Marketing"],
    Tecnologia: ["Gerente de Tecnologia", "Head de Engenharia"],
}

// Faixas relativas ao segmento: "acima de R$ 4 mil" é sonho para um e insulto para outro.
const INCOME: Record<Segment, Option[]> = {
    varejo: [
        { value: 0, label: "Estou sem renda agora" },
        { value: 0.1, label: "Até R$ 1.800" },
        { value: 1800, label: "R$ 1.800 a R$ 2.500" },
        { value: 2500, label: "R$ 2.500 a R$ 3.500" },
        { value: 3500, label: "Mais de R$ 3.500" },
    ],
    dev: [
        { value: 0, label: "Estou sem renda agora" },
        { value: 0.1, label: "Até R$ 5 mil" },
        { value: 5000, label: "R$ 5 mil a R$ 10 mil" },
        { value: 10000, label: "R$ 10 mil a R$ 18 mil" },
        { value: 18000, label: "Mais de R$ 18 mil" },
    ],
    exec: [
        { value: 0, label: "Estou sem renda agora" },
        { value: 0.1, label: "Até R$ 15 mil" },
        { value: 15000, label: "R$ 15 mil a R$ 25 mil" },
        { value: 25000, label: "R$ 25 mil a R$ 40 mil" },
        { value: 40000, label: "Mais de R$ 40 mil" },
    ],
}

const RAISE_FACTOR: Record<Exclude<Raise, "usd">, number> = { same: 1, plus20: 1.2, plus50: 1.5, double: 2 }

/** Piso salarial desejado em R$, ou null quando a faixa atual não tem piso (sem renda / "até X") ou é dólar. */
export function targetSalary(a: Answers): number | null {
    if (!a.raise || a.raise === "usd" || !a.income || a.income < 1) return null
    return Math.round((a.income * RAISE_FACTOR[a.raise]) / 100) * 100
}

export const brl = (n: number) => `R$ ${Math.round(n).toLocaleString("pt-BR")}`

export const PROFILE_OPTIONS: Option[] = [
    { value: "role", label: "O nome do cargo que eu quero aparece no topo do currículo" },
    { value: "results", label: "Minhas experiências têm números (metas, vendas, clientes, projetos)" },
    { value: "updated", label: "Atualizei o currículo nos últimos 3 meses" },
    { value: "tailored", label: "Ajusto o currículo para cada vaga" },
    { value: "linkedin", label: "Meu LinkedIn está completo (foto, título e resumo)" },
]

/** Sequência de perguntas aplicável às respostas atuais (fácil → dor → desejo). */
export function questionsFor(a: Answers): Question[] {
    const seg = a.segment ?? "varejo"
    const applies = (a.appsPerWeek ?? 0) > 0
    const qs: (Question | false)[] = [
        { id: "segment", kind: "choice", title: "Que tipo de vaga você procura?", options: SEGMENT_OPTIONS },
        { id: "area", kind: "choice", title: "Em qual área?", options: AREAS[seg].map((v) => ({ value: v, label: v })) },
        {
            id: "computer",
            kind: "choice",
            title: "Você tem um computador que pode ficar ligado algumas horas por dia?",
            help: "Notebook ou PC. O Apliquefy roda no computador, não no celular.",
            options: [
                { value: "own", label: "Sim, tenho o meu" },
                { value: "shared", label: "Sim, mas divido com outras pessoas" },
                { value: "phone_only", label: "Não, só tenho celular" },
            ],
        },
        {
            id: "searchWeeks",
            kind: "choice",
            title: "Há quanto tempo você está procurando emprego?",
            options: [
                { value: 0, label: "Menos de 1 mês" },
                { value: 4, label: "1 a 3 meses" },
                { value: 13, label: "3 a 6 meses" },
                { value: 26, label: "6 meses a 1 ano" },
                { value: 52, label: "Mais de 1 ano" },
            ],
        },
        {
            id: "appsPerWeek",
            kind: "number",
            title: "Quantas candidaturas você envia por semana?",
            help: "Conte de cabeça. Zero também vale.",
            quick: [0, 5, 10, 20, 40],
            unit: "por semana",
            min: 0,
            max: 500,
        },
        applies && {
            id: "minutesPerApp",
            kind: "number",
            title: "Quantos minutos leva cada candidatura?",
            help: "Achar a vaga, ler, preencher, ajustar o currículo.",
            quick: [5, 10, 20, 30, 60],
            unit: "minutos",
            min: 1,
            max: 240,
        },
        applies && {
            id: "responsesLastMonth",
            kind: "number",
            title: "No último mês, quantas empresas te responderam?",
            help: "Qualquer contato conta: e-mail, mensagem, ligação, convite.",
            quick: [0, 1, 2, 5, 10],
            unit: "respostas",
            min: 0,
            max: 500,
        },
        {
            id: "feeling",
            kind: "choice",
            title: "Quando uma candidatura fica sem resposta, o que você pensa?",
            options: [
                { value: "cv", label: "Que meu currículo não é bom o suficiente" },
                { value: "me", label: "Que eu não sou bom o suficiente" },
                { value: "filled", label: "Que a vaga já tinha alguém escolhido" },
                { value: "numb", label: "Já nem penso mais, virou rotina" },
            ],
        },
        {
            id: "profile",
            kind: "multi",
            title: "O que o seu currículo e o seu perfil já têm hoje?",
            help: "Marque tudo que for verdade. Isso monta a parte de currículo do seu diagnóstico.",
            options: PROFILE_OPTIONS,
        },
        // Inglês não personaliza nada para o varejo: removido para quem não usa.
        seg !== "varejo" && {
            id: "english",
            kind: "choice",
            title: "Qual é o seu nível de inglês?",
            options: [
                { value: "none", label: "Não falo" },
                { value: "basic", label: "Básico — leio com ajuda" },
                { value: "intermediate", label: "Intermediário — me viro numa conversa" },
                { value: "advanced", label: "Avançado ou fluente" },
            ],
        },
        { id: "income", kind: "choice", title: "Quanto você ganha hoje (ou ganhava no último emprego)?", help: "Por mês. Só usamos para calibrar o filtro de salário.", options: INCOME[seg] },
        {
            id: "raise",
            kind: "choice",
            title: "Na próxima vaga, quanto você quer ganhar?",
            options: [
                ...(Object.keys(RAISE_FACTOR) as Exclude<Raise, "usd">[]).map((r) => {
                    const t = targetSalary({ ...a, raise: r })
                    const label = { same: "Pelo menos o mesmo", plus20: "Uns 20% a mais", plus50: "Uns 50% a mais", double: "O dobro ou mais" }[r]
                    return { value: r, label, hint: t ? `a partir de ${brl(t)}` : undefined }
                }),
                ...(seg === "dev" ? [{ value: "usd", label: "Quero receber em dólar" }] : []),
            ],
        },
        {
            id: "deadline",
            kind: "choice",
            title: "Em quanto tempo você quer resolver isso?",
            options: [
                { value: "asap", label: "O quanto antes" },
                { value: "1m", label: "Em até 1 mês" },
                { value: "3m", label: "Em até 3 meses" },
                { value: "no_rush", label: "Sem prazo definido" },
            ],
        },
        {
            id: "targetRole",
            kind: "text",
            title: "Qual cargo você quer?",
            help: "Do jeito que aparece nos anúncios de vaga.",
            suggestions: ROLE_SUGGESTIONS[a.area ?? ""] ?? [],
        },
    ]
    return qs.filter((q): q is Question => Boolean(q))
}

const SHORT: Record<QuestionId, string> = {
    segment: "Busca",
    area: "Área",
    computer: "Computador",
    searchWeeks: "Procurando há",
    appsPerWeek: "Candidaturas/semana",
    minutesPerApp: "Minutos por candidatura",
    responsesLastMonth: "Respostas no último mês",
    feeling: "Quando não respondem",
    profile: "Currículo e perfil",
    english: "Inglês",
    income: "Renda atual",
    raise: "Quer ganhar",
    deadline: "Prazo",
    targetRole: "Cargo-alvo",
}

/** As respostas como pares rótulo/valor (resumo do quiz). */
export function describeAnswers(a: Answers): { id: QuestionId; label: string; value: string }[] {
    return questionsFor(a).flatMap((q) => {
        const v = a[q.id]
        if (v === undefined) return []
        let value: string
        if (q.kind === "choice") value = q.options.find((o) => o.value === v)?.label ?? String(v)
        else if (q.kind === "multi") value = `${(v as ProfileItem[]).length} de ${q.options.length} itens`
        else value = String(v)
        return [{ id: q.id, label: SHORT[q.id], value }]
    })
}

/** Próxima tela do quiz; a ponte (epifania) entra logo depois da pergunta emocional. */
export function nextQuizScreen(a: Answers, current: Screen): Screen {
    if (current === "feeling") return "bridge"
    const qs = questionsFor(a)
    const from = current === "bridge" ? qs.findIndex((q) => q.id === "feeling") : qs.findIndex((q) => q.id === current)
    return qs[from + 1]?.id ?? "analysis"
}

// ── Diagnóstico (só a partir das respostas) ──────────────────────────────────

/** Abaixo disso, o volume semanal conta como problema no índice. */
export const VOLUME_TARGET = 20

export type Criterion = { id: ProfileItem | "volume"; label: string; weight: number; pass: boolean; problem: string; why: string }
export type Diagnosis = { score: number; criteria: Criterion[]; problems: Criterion[] }

const PROFILE_CRITERIA: Record<ProfileItem, { weight: number; label: string; problem: string; why: string }> = {
    role: { weight: 20, label: "Cargo-alvo no topo", problem: "Cargo-alvo fora do topo do currículo", why: "Recrutador e filtro buscam pelo nome do cargo." },
    results: { weight: 15, label: "Resultados com números", problem: "Experiências sem números", why: "Sem resultado, ninguém consegue comparar você." },
    updated: { weight: 10, label: "Currículo atualizado", problem: "Currículo desatualizado", why: "Mais de 3 meses sem revisão." },
    tailored: { weight: 15, label: "Ajustado para cada vaga", problem: "Mesmo currículo para toda vaga", why: "As palavras da vaga não aparecem no seu." },
    linkedin: { weight: 15, label: "LinkedIn completo", problem: "LinkedIn incompleto", why: "É onde o recrutador confere o currículo." },
}

/** Índice de visibilidade: soma de critérios explícitos, todos exibidos. Não é nota de nenhuma empresa. */
export function diagnose(a: Answers): Diagnosis {
    const has = new Set(a.profile ?? [])
    const apps = a.appsPerWeek ?? 0
    const criteria: Criterion[] = [
        {
            id: "volume",
            weight: 25,
            label: `Volume semanal (meta: ${VOLUME_TARGET}+)`,
            pass: apps >= VOLUME_TARGET,
            problem: "Volume baixo de candidaturas",
            why: apps ? `${apps} por semana: poucas tentativas contra o filtro.` : "Você ainda não envia candidaturas toda semana.",
        },
        ...(Object.keys(PROFILE_CRITERIA) as ProfileItem[]).map((id) => ({ id, ...PROFILE_CRITERIA[id], pass: has.has(id) })),
    ]
    const earned = criteria.reduce((s, c) => s + (c.pass ? c.weight : 0), 0)
    const total = criteria.reduce((s, c) => s + c.weight, 0)
    const problems = criteria
        .filter((c) => !c.pass)
        .sort((x, y) => y.weight - x.weight)
        .slice(0, 3)
    return { score: Math.round((100 * earned) / total), criteria, problems }
}

export const scoreLabel = (score: number) => (score < 40 ? "Baixa visibilidade" : score < 70 ? "Visibilidade média" : "Boa visibilidade")

// ── Tempo e projeção ─────────────────────────────────────────────────────────

export const WEEKS_PER_MONTH = 52 / 12

// Espelha o default de COST_PER_APPLICATION (credits.service.ts / robots config.py).
// ponytail: constante no cliente; expor via API se o custo por candidatura mudar.
export const COST_PER_APPLICATION = 1

/** Destino de referência quando a pessoa ainda não tem ritmo próprio para projetar. */
export const REFERENCE_DESTINATION = 200

export function hoursPerMonth(a: Answers): number | null {
    if (!a.appsPerWeek || !a.minutesPerApp) return null
    return (a.appsPerWeek * a.minutesPerApp * WEEKS_PER_MONTH) / 60
}

/** Piso: semanas de busca (piso da faixa) × ritmo semanal declarado. */
export function hoursSoFar(a: Answers): number | null {
    if (!a.appsPerWeek || !a.minutesPerApp || !a.searchWeeks) return null
    return (a.searchWeeks * a.appsPerWeek * a.minutesPerApp) / 60
}

export function appsSoFar(a: Answers): number | null {
    if (!a.appsPerWeek || !a.searchWeeks) return null
    return a.searchWeeks * a.appsPerWeek
}

/** Respostas ÷ candidaturas do último mês; null se não houve candidatura para medir. */
export function responseRate(a: Answers): number | null {
    if (!a.appsPerWeek || a.responsesLastMonth === undefined) return null
    return Math.min(1, a.responsesLastMonth / (a.appsPerWeek * WEEKS_PER_MONTH))
}

/** "Mesmo destino, velocidades diferentes": o que ela enviaria em 1 ano no ritmo de hoje. */
export function destination(a: Answers): { apps: number; own: boolean } {
    const yearly = Math.round((a.appsPerWeek ?? 0) * 52)
    return yearly >= 100 ? { apps: yearly, own: true } : { apps: REFERENCE_DESTINATION, own: false }
}

export function planAppsPerWeek(plan: Plan): number {
    return (plan.credits / COST_PER_APPLICATION) * (12 / 52)
}

/** Limite diário da campanha que o ritmo do plano exige (o padrão é 50, o máximo 200 por campanha). */
export function dailyLimitFor(plan: Plan): number {
    return Math.min(200, Math.ceil(plan.credits / COST_PER_APPLICATION / 30))
}

export function weeksTo(apps: number, perWeek: number): number {
    return perWeek > 0 ? apps / perWeek : Infinity
}

/** "4 dias", "3 semanas", "1 ano"… sempre arredondando para cima (nunca promete antes). */
export function formatDuration(weeks: number): string {
    if (!Number.isFinite(weeks)) return "não chega"
    if (weeks < 1) {
        const d = Math.max(1, Math.ceil(weeks * 7))
        return `${d} ${d === 1 ? "dia" : "dias"}`
    }
    if (weeks >= 52 && weeks < 53) return "1 ano"
    if (weeks > 60) return `${Math.ceil(weeks / WEEKS_PER_MONTH)} meses`
    const w = Math.ceil(weeks)
    return `${w} ${w === 1 ? "semana" : "semanas"}`
}

export function horizonWeeks(a: Answers): number {
    return a.deadline === "3m" || a.deadline === "no_rush" ? 13 : 4
}

export const canRunDesktop = (a: Answers) => a.computer !== "phone_only"

export const fmt1 = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 1 })

// ── Ofertas ──────────────────────────────────────────────────────────────────

// Nome e preço vêm de UPSELLS (lib/constants/plans.ts, espelho do Stripe); aqui só a copy da oferta.
export const BUMPS: Record<BumpId, { title: string; priceInCents: number; deliverables: string[] }> = {
    cv: {
        title: UPSELLS.cv.name,
        priceInCents: UPSELLS.cv.priceInCents,
        deliverables: ["Cargo-alvo no topo, título e resumo reescritos", "Tarefas viram resultados (você confirma cada número)", "Uma versão ajustada para cada tipo de vaga"],
    },
    kit_tech: {
        title: UPSELLS.kit_tech.name,
        priceInCents: UPSELLS.kit_tech.priceInCents,
        deliverables: ["Currículo adaptado para vagas em inglês", "Título e resumo do LinkedIn em inglês", "Campanha separada para vagas remotas no exterior"],
    },
    kit_gestao: {
        title: UPSELLS.kit_gestao.name,
        priceInCents: UPSELLS.kit_gestao.priceInCents,
        deliverables: ["Título e “Sobre” reescritos para o cargo-alvo", "Experiências com foco em escopo e resultado", "Palavras-chave que recrutadores usam na sua área"],
    },
    kit_varejo: {
        title: UPSELLS.kit_varejo.name,
        priceInCents: UPSELLS.kit_varejo.priceInCents,
        deliverables: ["Perguntas mais comuns da sua área, com respostas-modelo", "Como falar de salário e disponibilidade de horário", "Checklist do dia: documentos, roupa, chegada"],
    },
    carta: {
        title: UPSELLS.carta.name,
        priceInCents: UPSELLS.carta.priceInCents,
        deliverables: [
            "Carta de apresentação para o seu cargo-alvo, a partir do seu currículo",
            "Versão curta para o campo de mensagem ao recrutador no LinkedIn e no InfoJobs",
            "Você revisa e edita antes de usar",
        ],
    },
    lista_tech: {
        title: UPSELLS.lista_tech.name,
        priceInCents: UPSELLS.lista_tech.priceInCents,
        deliverables: [
            "Cargos de tecnologia com mais vagas abertas no momento",
            "O que essas vagas mais pedem: linguagens, ferramentas e nível de inglês",
            "Quais aceitam trabalho remoto, inclusive para o exterior",
        ],
    },
    lista_gestao: {
        title: UPSELLS.lista_gestao.name,
        priceInCents: UPSELLS.lista_gestao.priceInCents,
        deliverables: [
            "Cargos de liderança com mais vagas abertas no momento",
            "Setores que mais estão contratando gestores",
            "O que essas vagas mais pedem de experiência e formação",
        ],
    },
    lista_varejo: {
        title: UPSELLS.lista_varejo.name,
        priceInCents: UPSELLS.lista_varejo.priceInCents,
        deliverables: [
            "Cargos de comércio, atendimento e escritório com mais vagas abertas no momento",
            "Os que mais contratam sem exigir experiência",
            "O que essas vagas mais pedem: escala, horário e requisitos",
        ],
    },
}

export const OTOS: Record<OtoId, { title: string; priceInCents: number; pitch: string }> = {
    voice: {
        title: UPSELLS.voice.name,
        priceInCents: UPSELLS.voice.priceInCents,
        pitch: "Você fala, a IA entrevista como um recrutador da sua área e devolve o que melhorar em cada resposta.",
    },
    text: {
        title: UPSELLS.text.name,
        priceInCents: UPSELLS.text.priceInCents,
        pitch: "As mesmas perguntas e o mesmo retorno, respondendo por escrito, no seu ritmo.",
    },
}

export const segmentBump = (s: Segment | undefined): BumpId => (s === "dev" ? "kit_tech" : s === "exec" ? "kit_gestao" : "kit_varejo")
export const segmentList = (s: Segment | undefined): BumpId => (s === "dev" ? "lista_tech" : s === "exec" ? "lista_gestao" : "lista_varejo")

export function cartTotal(s: FunnelState): { monthly: number; once: number } {
    const plan = PLANS.find((p) => p.slug === s.plan)
    const once = s.bumps.reduce((t, b) => t + BUMPS[b].priceInCents, 0) + (s.oto ? OTOS[s.oto].priceInCents : 0)
    return { monthly: plan?.priceInCents ?? 0, once }
}
