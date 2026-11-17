import { prisma } from "@repo/database"
import { upsertBoardsSchema, upsertPostingsSchema } from "../../../app/lib/validations/internal"

type Result<T> = { success: true; data: T } | { success: false; errorDesc: unknown }

export class JobPostingService {
    /**
     * Upsert em lote por URL canônica (catálogo global, compartilhado entre usuários).
     * `lastSeenAt` sempre avança; `closedAt` liga quando a fonte diz que fechou e desliga
     * se a vaga reaparecer aberta.
     * ponytail: um upsert por vaga numa transação (≤500, uma vez por dia); INSERT … ON
     * CONFLICT em lote via SQL bruto se a descoberta ficar lenta.
     */
    async upsertPostings(raw: unknown): Promise<Result<{ upserted: number; created: number }>> {
        const parsed = upsertPostingsSchema.safeParse(raw)
        if (!parsed.success) return { success: false, errorDesc: parsed.error.format() }

        // A mesma URL duas vezes no lote: fica a última.
        const postings = [...new Map(parsed.data.postings.map((p) => [p.canonicalUrl, p])).values()]
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

        return { success: true, data: { upserted: postings.length, created: postings.length - existing } }
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
