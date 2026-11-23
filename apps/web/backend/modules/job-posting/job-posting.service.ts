import { prisma, Prisma } from "@repo/database"
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
     * Um INSERT … ON CONFLICT só (≤500 linhas): upsert por vaga numa $transaction estourava
     * os 5 s do Prisma no Neon. `created` vem do RETURNING (xmax = 0).
     * ponytail: campo opcional ausente/null NÃO apaga o valor já gravado (COALESCE); limpar
     * de propósito pede UPDATE à parte. Lote fixo em 500 ⇒ ~8 mil parâmetros, longe do teto do Postgres.
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
        const now = new Date().toISOString()
        // timestamptz → AT TIME ZONE 'UTC': as colunas são `timestamp` sem fuso e guardam UTC.
        const ts = (iso: string | null) => Prisma.sql`${iso}::timestamptz AT TIME ZONE 'UTC'`
        const rows = postings.map((p) => Prisma.sql`(
            ${p.canonicalUrl}::varchar, ${p.applyUrl}::varchar, ${p.ats}::varchar, ${p.boardToken ?? null}::varchar,
            ${p.externalId ?? null}::varchar, ${p.title}::varchar, ${p.companyName ?? null}::varchar,
            ${p.location ?? null}::varchar, ${p.isRemote ?? null}::boolean, ${p.workplaceType ?? null}::varchar, ${p.description ?? null}::text,
            ${ts(p.postedAt ? new Date(p.postedAt).toISOString() : null)}, ${ts(p.closed ? now : null)},
            ${p.source}::varchar, ${p.sourceRef ?? null}::varchar, ${ts(now)}, ${ts(now)}
        )`)
        const result = await prisma.$queryRaw<{ inserted: boolean }[]>`
            INSERT INTO job_postings (
                canonical_url, apply_url, ats, board_token, external_id, title, company_name, location,
                is_remote, workplace_type, description, posted_at, closed_at, source, source_ref, first_seen_at, last_seen_at
            ) VALUES ${Prisma.join(rows)}
            ON CONFLICT (canonical_url) DO UPDATE SET
                apply_url = EXCLUDED.apply_url, ats = EXCLUDED.ats,
                board_token = COALESCE(EXCLUDED.board_token, job_postings.board_token),
                external_id = COALESCE(EXCLUDED.external_id, job_postings.external_id),
                title = EXCLUDED.title,
                company_name = COALESCE(EXCLUDED.company_name, job_postings.company_name),
                location = COALESCE(EXCLUDED.location, job_postings.location),
                is_remote = COALESCE(EXCLUDED.is_remote, job_postings.is_remote),
                workplace_type = COALESCE(EXCLUDED.workplace_type, job_postings.workplace_type),
                description = COALESCE(EXCLUDED.description, job_postings.description),
                posted_at = EXCLUDED.posted_at, closed_at = EXCLUDED.closed_at,
                source = EXCLUDED.source,
                source_ref = COALESCE(EXCLUDED.source_ref, job_postings.source_ref),
                last_seen_at = EXCLUDED.last_seen_at
            RETURNING (xmax = 0) AS inserted`

        return { success: true, data: { upserted: postings.length, created: result.filter((r) => r.inserted).length, rejected } }
    }

    /**
     * Vagas para o matching do worker (§7.3): vistas nas últimas 48 h, abertas, de um ATS
     * que o worker envia, e que o usuário ainda não tem (de nenhuma fonte, pela URL
     * canônica). Sem descrição: o fit gate por texto (Fase 5) busca a de cada aprovada.
     * ponytail: corta em `limit` mais recentes; paginar se o catálogo crescer.
     */
    /** Descrição de uma vaga, só para o fit gate do worker (a lista de candidatas vem sem ela). */
    async getDescription(id: string) {
        if (!/^[0-9a-f-]{36}$/i.test(id)) return null
        return prisma.jobPosting.findUnique({ where: { id }, select: { description: true } })
    }

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
