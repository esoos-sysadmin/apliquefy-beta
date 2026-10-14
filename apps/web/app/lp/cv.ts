// Leitura e análise do currículo no próprio aparelho.
// A nota é a soma de critérios explícitos e verificáveis (exibidos no laudo), não um número opaco.
// ponytail: heurística determinística no cliente; quando a análise por LLM entrar, ela devolve
// este mesmo CvAnalysis e a UI não muda.
import type { English, Segment } from "./funnel"

export type Criterion = {
    id: "role" | "results" | "sections" | "contact" | "length" | "cliches" | "link" | "english"
    label: string
    weight: number
    pass: boolean
    evidence: string // o que foi encontrado no texto, sempre concreto
    problem: string // por que importa, para quando reprova
}

export type CvAnalysis = { score: number; words: number; criteria: Criterion[] }

export const MIN_WORDS = 40

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()

const STOP = new Set(["de", "da", "do", "das", "dos", "e", "em", "para", "com", "a", "o", "of", "and"])

// "vendedora" acha "vendedor" e vice-versa; "secretaria" acha "secretariado".
const stem = (t: string) => (t.length > 4 ? t.replace(/[ao]s?$/, "") : t)

const CLICHES = [
    "proativo",
    "proativa",
    "dinamico",
    "dinamica",
    "comunicativo",
    "comunicativa",
    "trabalho em equipe",
    "focado em resultados",
    "focada em resultados",
    "facilidade de aprendizado",
    "bom relacionamento interpessoal",
    "perfeccionista",
    "pontual",
    "responsavel",
]

const RESULT_RE =
    /\d+(?:[.,]\d+)?\s?%|r\$\s?\d|\b\d+(?:[.,]\d+)?\s?(?:mil|k|clientes|vendas|pessoas|projetos|usuarios|lojas|colaboradores|pedidos|atendimentos|funcionarios|membros|reais|unidades|contratos)\b/g

const SECTIONS: [string, RegExp][] = [
    ["Experiência", /experiencia|historico profissional|atuacao profissional/],
    ["Formação", /formacao|escolaridade|educacao|academic/],
    ["Habilidades", /habilidades|competencias|conhecimentos|skills|qualificacoes/],
]

export function analyzeCv(text: string, ctx: { targetRole: string; segment: Segment; english?: English }): CvAnalysis | null {
    const t = norm(text)
    const words = text.split(/\s+/).filter(Boolean).length
    if (words < MIN_WORDS) return null

    const tokens = norm(ctx.targetRole)
        .split(/[^a-z0-9+#]+/)
        .filter((w) => w.length >= 2 && !STOP.has(w))
    const missingRole = tokens.filter((w) => !t.includes(stem(w)))

    const results = t.match(RESULT_RE) ?? []
    const sections = SECTIONS.map(([name, re]) => ({ name, found: re.test(t) }))
    const missingSections = sections.filter((s) => !s.found).map((s) => s.name)
    const hasEmail = /[\w.+-]+@[\w-]+\.[\w.]+/.test(t)
    const hasPhone = /(?:\+?55\s?)?\(?\d{2}\)?[\s-]?(?:9\s?)?\d{4}[\s.-]?\d{4}/.test(t)
    const cliches = CLICHES.filter((c) => t.includes(c))

    const link = {
        dev: { re: /github\.com|gitlab\.com|linkedin\.com|https?:\/\//, label: "Link para GitHub, LinkedIn ou portfólio", what: "link de GitHub, LinkedIn ou portfólio" },
        exec: { re: /linkedin\.com/, label: "Link do LinkedIn", what: "link do seu LinkedIn" },
        varejo: { re: /disponibilidade|horario|escala|turno/, label: "Disponibilidade de horário", what: "disponibilidade de horário ou escala" },
    }[ctx.segment]
    const hasLink = link.re.test(t)

    const criteria: Criterion[] = [
        {
            id: "role",
            label: "Cargo-alvo aparece no currículo",
            weight: 20,
            pass: tokens.length > 0 && missingRole.length === 0,
            evidence:
                missingRole.length === 0
                    ? `“${ctx.targetRole}” aparece no texto.`
                    : `Não encontrei “${missingRole.join("”, “")}” em nenhum lugar do texto.`,
            problem: "Recrutadores e filtros das plataformas buscam pelo nome do cargo. Sem ele, seu currículo não aparece na busca.",
        },
        {
            id: "results",
            label: "Resultados com números",
            weight: 15,
            pass: results.length >= 2,
            evidence:
                results.length === 0
                    ? "Nenhum número de resultado (%, R$, quantidade de clientes, vendas…)."
                    : `${results.length} ${results.length === 1 ? "trecho" : "trechos"} com número, como “${results[0]}”.`,
            problem: "O currículo descreve tarefas, não resultados. Quem lê não consegue comparar você com outro candidato.",
        },
        {
            id: "sections",
            label: "Seções essenciais",
            weight: 15,
            pass: missingSections.length === 0,
            evidence: missingSections.length === 0 ? "Experiência, Formação e Habilidades presentes." : `Faltou: ${missingSections.join(", ")}.`,
            problem: "Sistemas de candidatura leem o currículo por seção. Seção que falta vira campo vazio.",
        },
        {
            id: "contact",
            label: "E-mail e telefone",
            weight: 10,
            pass: hasEmail && hasPhone,
            evidence: hasEmail && hasPhone ? "E-mail e telefone encontrados." : `Faltou: ${[!hasEmail && "e-mail", !hasPhone && "telefone com DDD"].filter(Boolean).join(" e ")}.`,
            problem: "Se a empresa se interessar, ela precisa conseguir te chamar sem abrir a plataforma.",
        },
        {
            id: "length",
            label: "Tamanho adequado",
            weight: 10,
            pass: words >= 150 && words <= 1000,
            evidence: `${words} palavras.`,
            problem: words < 150 ? "Curto demais para mostrar o que você já fez." : "Longo demais: a primeira leitura de um currículo é rápida.",
        },
        {
            id: "cliches",
            label: "Poucos clichês",
            weight: 10,
            pass: cliches.length < 3,
            evidence: cliches.length === 0 ? "Nenhum clichê da lista." : `Encontrei: ${cliches.map((c) => `“${c}”`).join(", ")}.`,
            problem: "Adjetivos que todo currículo usa ocupam o espaço de fatos sobre você.",
        },
        {
            id: "link",
            label: link.label,
            weight: 10,
            pass: hasLink,
            evidence: hasLink ? "Encontrado." : `Não encontrei ${link.what}.`,
            problem:
                ctx.segment === "varejo"
                    ? "No comércio, horário e escala costumam ser o primeiro filtro. Dizer de cara economiza uma rodada."
                    : "É onde o recrutador confere o que o currículo diz.",
        },
    ]

    if (ctx.segment !== "varejo" && (ctx.english === "intermediate" || ctx.english === "advanced")) {
        const has = /ingles|english/.test(t)
        criteria.push({
            id: "english",
            label: "Inglês declarado no currículo",
            weight: 10,
            pass: has,
            evidence: has ? "Inglês aparece no texto." : "Você disse que tem inglês, mas ele não aparece no currículo.",
            problem: "Vagas que pedem inglês filtram por isso. Você tem e não está mostrando.",
        })
    }

    const total = criteria.reduce((s, c) => s + c.weight, 0)
    const earned = criteria.reduce((s, c) => s + (c.pass ? c.weight : 0), 0)
    return { score: Math.round((100 * earned) / total), words, criteria }
}

/** Os 3 problemas de maior peso. */
export const findings = (a: CvAnalysis) =>
    a.criteria
        .filter((c) => !c.pass)
        .sort((x, y) => y.weight - x.weight)
        .slice(0, 3)

// ── Extração de texto ────────────────────────────────────────────────────────

// ponytail: pdf.js via CDN, carregado só quando alguém envia PDF (não entra no bundle nem no LCP).
// Vira dependência (pdfjs-dist) se a CSP proibir CDN ou a leitura migrar para o servidor.
const PDFJS = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/"

export async function extractText(file: File): Promise<{ text: string; pages?: number }> {
    const name = file.name.toLowerCase()
    if (file.type === "application/pdf" || name.endsWith(".pdf")) return extractPdf(file)
    if (name.endsWith(".docx")) return { text: await extractDocx(file) }
    if (file.type.startsWith("text/") || name.endsWith(".txt")) return { text: await file.text() }
    throw new Error("Formato não suportado. Envie PDF, Word (.docx) ou cole o texto.")
}

type PdfJs = {
    GlobalWorkerOptions: { workerSrc: string }
    getDocument(src: { data: Uint8Array }): {
        promise: Promise<{
            numPages: number
            getPage(n: number): Promise<{ getTextContent(): Promise<{ items: { str?: string; hasEOL?: boolean }[] }> }>
        }>
    }
}

async function extractPdf(file: File) {
    const url = PDFJS + "pdf.min.mjs"
    const pdfjs: PdfJs = await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ url)
    pdfjs.GlobalWorkerOptions.workerSrc = PDFJS + "pdf.worker.min.mjs"
    const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise
    let text = ""
    for (let i = 1; i <= doc.numPages; i++) {
        const content = await (await doc.getPage(i)).getTextContent()
        for (const it of content.items) text += (it.str ?? "") + (it.hasEOL ? "\n" : " ")
    }
    return { text, pages: doc.numPages }
}

/** .docx é um zip: acha word/document.xml pelo diretório central e infla com DecompressionStream. */
async function extractDocx(file: File): Promise<string> {
    const buf = new Uint8Array(await file.arrayBuffer())
    const v = new DataView(buf.buffer)
    let eocd = -1
    for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
        if (v.getUint32(i, true) === 0x06054b50) {
            eocd = i
            break
        }
    }
    if (eocd < 0) throw new Error("Não consegui abrir este arquivo Word.")
    let p = v.getUint32(eocd + 16, true)
    for (let n = v.getUint16(eocd + 10, true); n > 0; n--) {
        const nameLen = v.getUint16(p + 28, true)
        const name = new TextDecoder().decode(buf.subarray(p + 46, p + 46 + nameLen))
        if (name === "word/document.xml") {
            const local = v.getUint32(p + 42, true)
            const start = local + 30 + v.getUint16(local + 26, true) + v.getUint16(local + 28, true)
            const raw = buf.slice(start, start + v.getUint32(p + 20, true))
            const xml =
                v.getUint16(p + 10, true) === 0
                    ? new TextDecoder().decode(raw)
                    : await new Response(new Blob([raw]).stream().pipeThrough(new DecompressionStream("deflate-raw"))).text()
            return xml
                .replace(/<\/w:p>/g, "\n")
                .replace(/<w:tab\/>/g, " ")
                .replace(/<[^>]+>/g, "")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, '"')
                .replace(/&apos;/g, "'")
                .replace(/&amp;/g, "&")
        }
        p += 46 + nameLen + v.getUint16(p + 30, true) + v.getUint16(p + 32, true)
    }
    throw new Error("Não encontrei texto neste arquivo Word.")
}
