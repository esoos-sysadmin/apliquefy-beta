import { prisma, Prisma } from "@repo/database"
import {
    createJobApplicationSchema,
    updateJobApplicationSchema,
    listJobApplicationsQuerySchema,
    type CreateJobApplicationInput,
    type UpdateJobApplicationInput,
    type ListJobApplicationsQuery,
} from "../../../app/lib/validations/job-application"

type ServiceResponse =
    | { success: true; data?: unknown; pagination?: unknown }
    | { success: false; message?: string; code?: string; errorDesc?: unknown }

export class JobApplicationService {
    /**
     * Creates a JobApplication in `pending` for the engine.
     * Validates campaign ownership.
     */
    async createApplication(userId: string, raw: CreateJobApplicationInput): Promise<ServiceResponse> {
        const validation = createJobApplicationSchema.safeParse(raw)

        if (!validation.success) {
            return { success: false, errorDesc: validation.error.format() }
        }

        const { campaign_id, platform, company_name, job_title, job_url } = validation.data

        try {
            const campaign = await prisma.campaign.findFirst({
                where: { id: campaign_id, userId },
                select: { id: true },
            })

            if (!campaign) {
                return { success: false, message: "Campanha não pertence ao usuário", code: "FORBIDDEN" }
            }

            const data = {
                campaignId: campaign_id,
                userId,
                platform,
                companyName: company_name ?? null,
                jobTitle: job_title ?? null,
                jobUrl: job_url ?? null,
                status: "pending" as const,
            }

            // (userId, jobUrl) é único: o usuário já pode ter candidatura nesta vaga.
            // Upsert em vez de create + catch(P2002): vira um INSERT ... ON CONFLICT, sem
            // exceção como fluxo de controle e sem o `prisma:error` assustando no log.
            // jobUrl é opcional no schema, e índice único no Postgres não colide em NULL —
            // sem URL não há o que reaproveitar, então cai no create simples.
            const application = job_url
                ? await prisma.jobApplication.upsert({
                      where: { userId_jobUrl: { userId, jobUrl: job_url } },
                      create: data,
                      update: {}, // já existe: reaproveita a linha sem tocar nela
                  })
                : await prisma.jobApplication.create({ data })

            // Run anterior caiu no meio: a linha pendente é reaproveitada. Já enviada de
            // verdade: o engine pula a vaga.
            if (application.status === "applied") {
                return { success: false, message: "Você já se candidatou a esta vaga", code: "DUPLICATE" }
            }

            return { success: true, data: application }
        } catch (error) {
            console.error("Erro ao criar JobApplication:", error)
            throw new Error("Falha de comunicação no banco de dados ao criar candidatura")
        }
    }

    /**
     * Updates a JobApplication. Sets `appliedAt` automatically when status becomes `applied`.
     */
    async updateApplication(userId: string, id: string, raw: UpdateJobApplicationInput): Promise<ServiceResponse> {
        const validation = updateJobApplicationSchema.safeParse(raw)

        if (!validation.success) {
            return { success: false, errorDesc: validation.error.format() }
        }

        const { status, error_log, applied_at, company_name, job_title, job_url, got_response, got_interview } = validation.data

        try {
            const updated = await prisma.$transaction(async (tx) => {
                const existing = await tx.jobApplication.findFirst({
                    where: { id, userId },
                    select: { id: true },
                })

                if (!existing) return null

                const appliedAt =
                    applied_at !== undefined
                        ? applied_at
                            ? new Date(applied_at)
                            : null
                        : status === "applied"
                          ? new Date()
                          : undefined

                const app = await tx.jobApplication.update({
                    where: { id },
                    data: {
                        ...(status && { status }),
                        ...(error_log !== undefined && { errorLog: error_log }),
                        ...(appliedAt !== undefined && { appliedAt }),
                        ...(company_name !== undefined && { companyName: company_name }),
                        ...(job_title !== undefined && { jobTitle: job_title }),
                        ...(job_url !== undefined && { jobUrl: job_url }),
                        ...(got_response !== undefined && { gotResponse: got_response }),
                        ...(got_interview !== undefined && { gotInterview: got_interview }),
                    },
                })

                // Falha técnica → devolve o crédito se esta candidatura chegou a ser cobrada.
                if (status === "failed") {
                    await this.refundFailedApplication(tx, userId, id)
                }

                return app
            })

            if (!updated) {
                return { success: false, message: "Candidatura não encontrada", code: "NOT_FOUND" }
            }

            return { success: true, data: updated }
        } catch (error) {
            console.error("Erro ao atualizar JobApplication:", error)
            throw new Error("Falha de comunicação no banco de dados ao atualizar candidatura")
        }
    }

    /**
     * Reembolsa o crédito de uma candidatura que falhou, se ela chegou a ser cobrada.
     * Idempotente via idempotency_key `refund:application:<id>` (uma cobrança → um reembolso).
     * Hoje o engine só debita em sucesso, então normalmente é no-op; existe para manter o
     * invariante "só paga por sucesso" mesmo que a ordem de débito do engine mude.
     * ponytail: guard sequencial (pré-check + unique). Dois PATCH failed simultâneos p/ a
     * mesma candidatura dariam 500 no 2º e se auto-corrigem no retry — carga real é sequencial.
     */
    private async refundFailedApplication(
        tx: Prisma.TransactionClient,
        userId: string,
        applicationId: string,
    ): Promise<void> {
        const usage = await tx.transaction.findFirst({
            where: { userId, type: "USAGE", metadata: { path: ["jobApplicationId"], equals: applicationId } },
        })

        if (!usage) return

        const refundKey = `refund:application:${applicationId}`
        const already = await tx.transaction.findUnique({ where: { idempotencyKey: refundKey } })
        if (already) return

        const amount = Math.abs(usage.amount)
        if (amount <= 0) return

        await tx.user.update({ where: { id: userId }, data: { credits: { increment: amount } } })
        await tx.transaction.create({
            data: {
                userId,
                amount,
                type: "REFUND",
                reference_id: usage.reference_id,
                description: `Reembolso — candidatura falhou (${amount} crédito(s))`,
                idempotencyKey: refundKey,
                metadata: { refundOf: usage.id, jobApplicationId: applicationId },
            },
        })
    }

    /**
     * Metrics for the reports screen: per-status summary, per-resume breakdown,
     * and a paginated job-application history (each row carries jobUrl).
     * Aggregates are computed over ALL matching applications (via groupBy),
     * not just the current page, so the numbers stay correct while paginating.
     */
    async getCampaignMetrics(userId: string, rawQuery: ListJobApplicationsQuery): Promise<ServiceResponse> {
        const validation = listJobApplicationsQuerySchema.safeParse(rawQuery)

        if (!validation.success) {
            return { success: false, errorDesc: validation.error.format() }
        }

        const { campaign_id, status, page, limit } = validation.data

        try {
            const where: Prisma.JobApplicationWhereInput = {
                userId,
                ...(campaign_id && { campaignId: campaign_id }),
                ...(status && { status }),
            }

            // campaigns of this user (small N) → maps campaignId to its resume
            const campaigns = await prisma.campaign.findMany({
                where: { userId, ...(campaign_id && { id: campaign_id }) },
                select: {
                    id: true,
                    name: true,
                    status: true,
                    dailyLimit: true,
                    resume: { select: { id: true, title: true } },
                },
            })
            const campaignMap = new Map(campaigns.map((c) => [c.id, c]))

            // one grouped pass gives both the status summary and the per-resume breakdown
            const grouped = await prisma.jobApplication.groupBy({
                by: ["campaignId", "status"],
                where,
                _count: { _all: true },
            })

            const summary = { total: 0, applied: 0, failed: 0, pending: 0, skipped: 0 }
            const byResumeMap = new Map<string, { resumeId: string; resumeTitle: string; total: number; applied: number }>()

            for (const row of grouped) {
                const count = row._count._all
                summary.total += count
                if (row.status && row.status in summary) {
                    summary[row.status as "applied" | "failed" | "pending" | "skipped"] += count
                }

                const resume = row.campaignId ? campaignMap.get(row.campaignId)?.resume : null
                const key = resume?.id ?? "unknown"
                const entry = byResumeMap.get(key) ?? {
                    resumeId: resume?.id ?? "",
                    resumeTitle: resume?.title ?? "Sem currículo",
                    total: 0,
                    applied: 0,
                }
                entry.total += count
                if (row.status === "applied") entry.applied += count
                byResumeMap.set(key, entry)
            }

            const [applications, total] = await prisma.$transaction([
                prisma.jobApplication.findMany({
                    where,
                    orderBy: { createdAt: "desc" },
                    skip: (page - 1) * limit,
                    take: limit,
                    select: {
                        id: true,
                        platform: true,
                        companyName: true,
                        jobTitle: true,
                        jobUrl: true,
                        status: true,
                        errorLog: true,
                        appliedAt: true,
                        createdAt: true,
                        campaign: { select: { name: true, resume: { select: { title: true } } } },
                    },
                }),
                prisma.jobApplication.count({ where }),
            ])

            const history = applications.map((a) => ({
                id: a.id,
                platform: a.platform,
                companyName: a.companyName,
                jobTitle: a.jobTitle,
                jobUrl: a.jobUrl,
                status: a.status,
                // motivo de descarte/falha: é a resposta para "por que essa vaga não foi enviada?"
                reason: a.errorLog,
                appliedAt: a.appliedAt,
                createdAt: a.createdAt,
                campaignName: a.campaign?.name ?? null,
                resumeTitle: a.campaign?.resume?.title ?? null,
            }))

            // --- por que não foi enviada: groupBy nos textos distintos (poucas linhas) + bucket
            // heurístico. Inclui `skipped` e não só `failed`: vaga descartada pelo gate de
            // aderência nunca chega a falhar, e era justamente o que sumia do relatório.
            const failedGroups = await prisma.jobApplication.groupBy({
                by: ["errorLog"],
                where: { ...where, status: { in: ["failed", "skipped"] } },
                _count: { _all: true },
            })
            const reasonMap = new Map<string, number>()
            for (const g of failedGroups) {
                const reason = classifyErrorLog(g.errorLog)
                reasonMap.set(reason, (reasonMap.get(reason) ?? 0) + g._count._all)
            }
            const failureReasons = Array.from(reasonMap, ([reason, count]) => ({ reason, count }))
                .sort((x, y) => y.count - x.count)
                .slice(0, 6)

            // --- créditos gastos (USAGE grava reference_id = campaignId)
            // Nem todo USAGE é candidatura: a análise de currículo com IA também debita
            // (debitFixed). Sem esse filtro, "Todas as campanhas" (campaign_id vazio)
            // somava esses débitos aqui e o costPerApplication saía inflado.
            // O discriminador é metadata.jobApplicationId, que o debitFlat grava do lado
            // do servidor — e não a idempotencyKey, que é a string que o engine mandou e
            // pode mudar lá sem ninguém perceber aqui. Mesmo critério do refund (l. 152).
            const usageAgg = await prisma.transaction.aggregate({
                where: {
                    userId,
                    type: "USAGE",
                    metadata: { path: ["jobApplicationId"], not: Prisma.DbNull },
                    ...(campaign_id && { reference_id: campaign_id }),
                },
                _sum: { amount: true },
            })
            const creditsUsed = Math.abs(usageAgg._sum.amount ?? 0)
            const costPerApplication = summary.applied > 0 ? Math.round((creditsUsed / summary.applied) * 10) / 10 : 0

            // créditos devolvidos por candidaturas que falharam (REFUND grava amount positivo)
            const refundAgg = await prisma.transaction.aggregate({
                where: { userId, type: "REFUND", ...(campaign_id && { reference_id: campaign_id }) },
                _sum: { amount: true },
            })
            const creditsRefunded = refundAgg._sum.amount ?? 0

            // --- uso do limite diário hoje (UTC), por campanha ativa no escopo
            const startOfDay = new Date()
            startOfDay.setUTCHours(0, 0, 0, 0)
            const todayGroups = await prisma.jobApplication.groupBy({
                by: ["campaignId"],
                where: { ...where, status: "applied", appliedAt: { gte: startOfDay } },
                _count: { _all: true },
            })
            const todayMap = new Map(todayGroups.map((g) => [g.campaignId, g._count._all]))
            const dailyUsage = campaigns
                .filter((c) => c.status === "active")
                .map((c) => ({
                    campaignId: c.id,
                    campaignName: c.name,
                    used: todayMap.get(c.id) ?? 0,
                    limit: c.dailyLimit ?? 0,
                }))

            // --- candidaturas por dia (14 dias): busca só createdAt no intervalo e agrupa em JS
            // ponytail: bucket em JS sobre ≤14d de linhas; trocar por date_trunc raw se o volume crescer
            const since = new Date(startOfDay)
            since.setUTCDate(since.getUTCDate() - 13)
            const recent = await prisma.jobApplication.findMany({
                where: { ...where, createdAt: { gte: since } },
                select: { createdAt: true },
            })
            const dayCounts = new Map<string, number>()
            for (const r of recent) {
                if (!r.createdAt) continue
                const day = r.createdAt.toISOString().slice(0, 10)
                dayCounts.set(day, (dayCounts.get(day) ?? 0) + 1)
            }
            const timeline = Array.from({ length: 14 }, (_, i) => {
                const d = new Date(since)
                d.setUTCDate(d.getUTCDate() + i)
                const day = d.toISOString().slice(0, 10)
                return { date: day, count: dayCounts.get(day) ?? 0 }
            })

            return {
                success: true,
                data: {
                    summary,
                    byResume: Array.from(byResumeMap.values()).sort((x, y) => y.total - x.total),
                    history,
                    failureReasons,
                    creditsUsed,
                    creditsRefunded,
                    costPerApplication,
                    dailyUsage,
                    timeline,
                },
                pagination: { page, limit, total, total_pages: Math.ceil(total / limit) },
            }
        } catch (error) {
            console.error("Erro ao buscar métricas de candidaturas:", error)
            throw new Error("Falha de comunicação no banco de dados ao buscar métricas")
        }
    }

    /**
     * Counts applications submitted today (UTC) for a campaign.
     * Used by the engine to enforce dailyLimit.
     */
    async countTodayByCampaign(userId: string, campaignId: string): Promise<{ used: number; limit: number; remaining: number } | null> {
        const campaign = await prisma.campaign.findFirst({
            where: { id: campaignId, userId },
            select: { id: true, dailyLimit: true },
        })

        if (!campaign) return null

        const startOfDay = new Date()
        startOfDay.setUTCHours(0, 0, 0, 0)
        const endOfDay = new Date(startOfDay)
        endOfDay.setUTCDate(endOfDay.getUTCDate() + 1)

        const used = await prisma.jobApplication.count({
            where: {
                campaignId,
                userId,
                status: "applied",
                appliedAt: { gte: startOfDay, lt: endOfDay },
            },
        })

        const limit = campaign.dailyLimit ?? 0
        return { used, limit, remaining: Math.max(0, limit - used) }
    }
}

/**
 * errorLog é texto semi-livre do agente. Agrupa os padrões conhecidos em buckets;
 * mensagens desconhecidas viram o próprio texto (truncado) para que falhas recorrentes apareçam.
 */
function classifyErrorLog(log: string | null): string {
    if (!log || !log.trim()) return "Sem detalhe"
    const l = log.toLowerCase()
    // Prefixos estáveis que o engine grava (fit_gate.FIT_MARKER e apply_agent.SKIP_MARKER).
    // Sem eles cada frase do LLM virava um bucket com contagem 1 e o painel não dizia nada.
    if (log.startsWith("FIT:")) return "Baixa aderência à vaga"
    if (log.startsWith("ELEGIBILIDADE:")) return "Pergunta sem resposta no currículo"
    if (l.includes("crash")) return "Erro no agente"
    if (l.includes("não concluiu") || l.includes("limite de passos") || l.includes("timeout")) return "Tempo/limite excedido"
    return log.length > 60 ? `${log.slice(0, 60)}…` : log
}

export const jobApplicationService = new JobApplicationService()
