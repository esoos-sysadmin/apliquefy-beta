import { prisma } from "@repo/database"
import { jobPostingInputSchema, upsertBoardsSchema, upsertPostingsSchema } from "../../../app/lib/validations/internal"

type Result<T> = { success: true; data: T } | { success: false; errorDesc: unknown }

const STOP = new Set("a o as os de da do das dos e em para com of the and for in at to".split(" "))

/**
 * Pré-filtro de título no banco: algum termo com todas as palavras de conteúdo no título.
 * Sem ele, o `limit` cortava as vagas mais novas do MUNDO antes de olhar os termos e uma
 * campanha "engenheiro de dados" não via nenhuma. O worker refaz o casamento exato.
 * ponytail: ILIKE não ignora acento ("análise" ≠ "analise"); unaccent se doer.
 */
function termsFilter(terms?: string) {
    const groups = (terms ?? "")
        .split(/[,;|]/)
        .map((t) => t.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((w) => w.length > 1 && !STOP.has(w)))
        .filter((words) => words.length)
    if (!groups.length) return {}
    return {
        OR: groups.map((words) => ({ AND: words.map((w) => ({ title: { contains: w, mode: "insensitive" as const } })) })),
    }
}

export class JobPostingService {
    /**
     * Upsert em lote por URL canônica (catálogo global, compartilhado entre usuários).
     * `lastSeenAt` sempre avança; `closedAt` liga quando a fonte diz que fechou e desliga
     * se a vaga reaparecer aberta.
     * ponytail: um upsert por vaga numa transação (≤500, uma vez por dia); INSERT … ON
     * CONFLICT em lote via SQL bruto se a descoberta ficar lenta.
     */
    async upsertPostings(raw: unknown): Promise<Result<{ upserted: number; created: number; rejected: number }>> {
        const parsed = upsertPostingsSchema.safeParse(raw)
        if (!parsed.success) return { success: false, errorDesc: parsed.error.format() }

        const valid = parsed.data.postings.flatMap((item) => {
            const one = jobPostingInputSchema.safeParse(item)
            return one.success ? [one.data] : []
        })
        const rejected = parsed.data.postings.length - valid.length
        if (!valid.length) return { success: true, data: { upserted: 0, created: 0, rejected } }

        // A mesma URL duas vezes no lote: fica a última.
        const postings = [...new Map(valid.map((p) => [p.canonicalUrl, p])).values()]
        const urls = postings.map((p) => p.canonicalUrl)
        const existing = await prisma.jobPosting.count({ where: { canonicalUrl: { in: urls } } })
        const now = new Date()

        await prisma.$transaction(
            postings.map(({ closed, postedAt, ...p }) => {
                const fields = {
                    ...p,
                    postedAt: postedAt ? new Date(postedAt) : null,
                    closedAt: closed ? now : null,
                    lastSeenAt: now,
                }
                return prisma.jobPosting.upsert({ where: { canonicalUrl: p.canonicalUrl }, create: fields, update: fields })
            }),
        )

        return { success: true, data: { upserted: postings.length, created: postings.length - existing, rejected } }
    }

    /**
     * Vagas para o matching do worker (§7.3): vistas nas últimas 48 h, abertas, de um ATS
     * que o worker envia, e que o usuário ainda não tem (de nenhuma fonte, pela URL
     * canônica). Sem descrição: o fit gate por texto (Fase 5) busca a de cada aprovada.
     * ponytail: corta em `limit` mais recentes; paginar se o catálogo crescer.
     */
    async listCandidates(userId: string, ats: string[], limit: number, terms?: string) {
        const postings = await prisma.jobPosting.findMany({
            where: {
                ats: { in: ats }, closedAt: null, lastSeenAt: { gte: new Date(Date.now() - 48 * 3600_000) },
                ...termsFilter(terms),
            },
            select: {
                id: true, canonicalUrl: true, ats: true, title: true, companyName: true,
                location: true, isRemote: true, externalId: true, postedAt: true,
            },
            orderBy: [{ postedAt: { sort: "desc", nulls: "last" } }, { lastSeenAt: "desc" }],
            take: limit,
        })
        if (!postings.length) return []
        const taken = await prisma.jobApplication.findMany({
            where: { userId, jobUrl: { in: postings.map((p) => p.canonicalUrl) } },
            select: { jobUrl: true },
        })
        const takenUrls = new Set(taken.map((t) => t.jobUrl))
        return postings.filter((p) => !takenUrls.has(p.canonicalUrl))
    }

    async listBoards(ats?: string) {
        return prisma.atsBoard.findMany({
            where: { active: true, ...(ats && { ats }) },
            select: { ats: true, token: true, companyName: true, lastFetchedAt: true },
            orderBy: [{ ats: "asc" }, { token: "asc" }],
        })
    }

    async upsertBoards(raw: unknown): Promise<Result<{ created: number }>> {
        const parsed = upsertBoardsSchema.safeParse(raw)
        if (!parsed.success) return { success: false, errorDesc: parsed.error.format() }
        const { count } = await prisma.atsBoard.createMany({
            data: parsed.data.boards.map((b) => ({ ats: b.ats, token: b.token, companyName: b.companyName ?? null })),
            skipDuplicates: true,
        })
        return { success: true, data: { created: count } }
    }
}

export const jobPostingService = new JobPostingService()
