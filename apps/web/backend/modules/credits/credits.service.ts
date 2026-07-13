import { prisma, Prisma } from "@repo/database"
import {
    debitFlatSchema,
    creditHistoryFiltersSchema,
    type DebitFlatInput,
    type CreditHistoryFilters,
} from "../../../app/lib/validations/credits"
import type {
    CreditsServiceResponse,
    CheckBalanceData,
    DebitCreditsData,
} from "../../../app/lib/types/credits-types"

export class CreditsService {
    /**
     * Returns the user's current credit balance and subscription status.
     * Used by the RPA to decide whether to start processing.
     */
    async checkBalance(userId: string): Promise<CreditsServiceResponse> {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    credits: true,
                    planTier: true,
                    subscriptionStatus: true,
                    currentPeriodEnd: true,
                },
            })

            if (!user) {
                return { success: false, message: "Usuário não encontrado", code: "NOT_FOUND" }
            }

            const data: CheckBalanceData = {
                balance: user.credits,
                canSend: user.credits >= 1,
                plan: user.planTier,
                subscriptionStatus: user.subscriptionStatus,
                currentPeriodEnd: user.currentPeriodEnd?.toISOString() ?? null,
                hasNegativeBalance: user.credits < 0,
            }

            return { success: true, data }
        } catch (error) {
            console.error("Erro ao verificar saldo:", error)
            throw new Error("Falha de comunicação no banco de dados ao verificar saldo")
        }
    }

    /**
     * Debits a flat cost per application (RPA engine).
     * Cost read from env COST_PER_APPLICATION (default 1).
     * Atomic + idempotent via idempotency_key.
     */
    async debitFlat(userId: string, rawData: DebitFlatInput): Promise<CreditsServiceResponse> {
        const validation = debitFlatSchema.safeParse(rawData)

        if (!validation.success) {
            return { success: false, errorDesc: validation.error.format() }
        }

        const { campaign_id, job_application_id, idempotency_key, questions, steps } = validation.data
        // Custo variável: base por candidatura + peso por pergunta dinâmica respondida,
        // com teto opcional. Defaults (base=1, peso=0, teto=0) => 1 crédito/candidatura,
        // igual a hoje. Vira variável só ajustando os envs — sem mexer no engine.
        const base = Math.max(0, Number.parseInt(process.env.COST_PER_APPLICATION ?? "1", 10))
        const perQuestion = Number.parseFloat(process.env.CREDIT_COST_PER_QUESTION ?? "0")
        // Teto por candidatura: máximo de créditos que UMA candidatura pode custar, por
        // mais perguntas que tenha — previsibilidade p/ o usuário pré-pago. 0 = sem teto.
        const maxPerApplication = Math.max(0, Number.parseInt(process.env.CREDIT_COST_MAX_PER_APPLICATION ?? "0", 10))
        const costUncapped = Math.max(1, Math.ceil(base + questions * perQuestion))
        const cost = maxPerApplication > 0 ? Math.min(costUncapped, maxPerApplication) : costUncapped

        try {
            const result = await prisma.$transaction(async (tx) => {
                const existing = await tx.transaction.findFirst({
                    where: { idempotencyKey: idempotency_key },
                })

                if (existing) {
                    const user = await tx.user.findUnique({ where: { id: userId } })
                    return {
                        newBalance: user?.credits ?? 0,
                        creditsDebited: 0,
                        rawCost: 0,
                        blocked: (user?.credits ?? 0) <= 0,
                        idempotent: true,
                    }
                }

                const updated = await tx.user.update({
                    where: { id: userId },
                    data: { credits: { decrement: cost } },
                })

                await tx.transaction.create({
                    data: {
                        userId,
                        amount: -cost,
                        type: "USAGE",
                        reference_id: campaign_id,
                        description: `Candidatura aplicada — ${cost} crédito(s) (${questions} pergunta(s))`,
                        idempotencyKey: idempotency_key,
                        metadata: {
                            flat: true,
                            cost,
                            costUncapped,
                            cap: maxPerApplication,
                            base,
                            perQuestion,
                            questions,
                            steps,
                            campaignId: campaign_id,
                            jobApplicationId: job_application_id,
                        },
                    },
                })

                return {
                    newBalance: updated.credits,
                    creditsDebited: cost,
                    rawCost: cost,
                    blocked: updated.credits <= 0,
                    idempotent: false,
                }
            })

            const data: DebitCreditsData = {
                newBalance: result.newBalance,
                creditsDebited: result.creditsDebited,
                rawCost: result.rawCost,
                blocked: result.blocked,
            }

            return { success: true, data }
        } catch (error) {
            console.error("Erro ao debitar crédito flat:", error)
            throw new Error("Falha de comunicação no banco de dados ao debitar crédito flat")
        }
    }

    /**
     * Debits a fixed amount of credits for a non-application action (ex.: análise de currículo).
     * Atômico + idempotente: recusa se o saldo for insuficiente (não deixa negativar).
     */
    async debitFixed(
        userId: string,
        opts: { amount: number; reason: string; referenceId?: string; idempotencyKey: string },
    ): Promise<CreditsServiceResponse> {
        const { amount, reason, referenceId, idempotencyKey } = opts

        if (!Number.isInteger(amount) || amount <= 0) {
            return { success: false, message: "Valor de débito inválido" }
        }

        try {
            const result = await prisma.$transaction(async (tx) => {
                const existing = await tx.transaction.findFirst({ where: { idempotencyKey } })
                if (existing) {
                    const user = await tx.user.findUnique({ where: { id: userId }, select: { credits: true } })
                    return { status: "ok" as const, newBalance: user?.credits ?? 0, creditsDebited: 0 }
                }

                const user = await tx.user.findUnique({ where: { id: userId }, select: { credits: true } })
                if (!user) return { status: "not_found" as const }
                if (user.credits < amount) return { status: "insufficient" as const, newBalance: user.credits }

                const updated = await tx.user.update({
                    where: { id: userId },
                    data: { credits: { decrement: amount } },
                })

                await tx.transaction.create({
                    data: {
                        userId,
                        amount: -amount,
                        type: "USAGE",
                        reference_id: referenceId ?? "",
                        description: reason,
                        idempotencyKey,
                        metadata: { fixed: true, amount, reason },
                    },
                })

                return { status: "ok" as const, newBalance: updated.credits, creditsDebited: amount }
            })

            if (result.status === "not_found") {
                return { success: false, message: "Usuário não encontrado", code: "NOT_FOUND" }
            }
            if (result.status === "insufficient") {
                return {
                    success: false,
                    message: "Créditos insuficientes",
                    code: "INSUFFICIENT_BALANCE",
                }
            }

            return { success: true, data: { newBalance: result.newBalance, creditsDebited: result.creditsDebited } }
        } catch (error) {
            console.error("Erro ao debitar crédito fixo:", error)
            throw new Error("Falha de comunicação no banco de dados ao debitar crédito fixo")
        }
    }

    /**
     * Returns paginated credit transaction history.
     * Supports filters by type, date range.
     */
    async getCreditHistory(userId: string, rawQuery: CreditHistoryFilters): Promise<CreditsServiceResponse> {
        const validation = creditHistoryFiltersSchema.safeParse(rawQuery)

        if (!validation.success) {
            return { success: false, errorDesc: validation.error.format() }
        }

        const { type, from, to, page, limit } = validation.data

        try {
            const where: Prisma.TransactionWhereInput = {
                userId,
                ...(type && { type }),
                ...(from || to
                    ? {
                          created_at: {
                              ...(from && { gte: new Date(from) }),
                              ...(to && { lte: new Date(to) }),
                          },
                      }
                    : {}),
            }

            const [transactions, total] = await prisma.$transaction([
                prisma.transaction.findMany({
                    where,
                    orderBy: { created_at: "desc" },
                    skip: (page - 1) * limit,
                    take: limit,
                }),
                prisma.transaction.count({ where }),
            ])

            return {
                success: true,
                data: transactions,
                pagination: {
                    page,
                    limit,
                    total,
                    total_pages: Math.ceil(total / limit),
                },
            }
        } catch (error) {
            console.error("Erro ao listar histórico de créditos:", error)
            throw new Error("Falha de comunicação no banco de dados ao listar histórico")
        }
    }
}

export const creditsService = new CreditsService()
