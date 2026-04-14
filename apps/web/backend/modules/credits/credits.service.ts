import { prisma, Prisma } from "@repo/database"
import {
    debitCreditsSchema,
    creditHistoryFiltersSchema,
    type DebitCreditsInput,
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
     * Debits credits for a completed form submission.
     * Calculates cost from weights table, applies ceiling rounding.
     * Atomic: decrement + log in same transaction.
     * Idempotent: same idempotencyKey returns previous result.
     */
    async debitCredits(userId: string, rawData: DebitCreditsInput): Promise<CreditsServiceResponse> {
        const validation = debitCreditsSchema.safeParse(rawData)

        if (!validation.success) {
            return { success: false, errorDesc: validation.error.format() }
        }

        const { questions, campaign_id, job_application_id, idempotency_key } = validation.data

        try {
            const result = await prisma.$transaction(async (tx) => {
                // Idempotency check
                const existingTransaction = await tx.transaction.findFirst({
                    where: { idempotencyKey: idempotency_key },
                })

                if (existingTransaction) {
                    const user = await tx.user.findUnique({ where: { id: userId } })
                    return {
                        newBalance: user?.credits ?? 0,
                        creditsDebited: 0,
                        rawCost: 0,
                        blocked: (user?.credits ?? 0) <= 0,
                        idempotent: true,
                    }
                }

                // Get weight configuration from DB
                const weights = await tx.creditWeight.findMany()
                const weightMap: Record<string, number> = {}
                for (const w of weights) {
                    weightMap[w.stage] = w.weight
                }

                const inputWeight = weightMap["input"] ?? 0.1
                const ragWeight = weightMap["rag"] ?? 0.1
                const outputWeight = weightMap["output"] ?? 0.2
                const judgeWeight = weightMap["judge"] ?? 0.1
                const fallbackWeight = weightMap["fallback"] ?? 0.5

                const baseFlowCost = inputWeight + ragWeight + outputWeight + judgeWeight

                // Calculate cost per question
                let rawCost = 0
                const questionBreakdown: Array<{
                    question_id: string
                    used_fallback: boolean
                    cost: number
                    stages: string[]
                }> = []

                for (const q of questions) {
                    const cost = q.used_fallback
                        ? baseFlowCost + fallbackWeight
                        : baseFlowCost

                    rawCost += cost

                    questionBreakdown.push({
                        question_id: q.question_id,
                        used_fallback: q.used_fallback,
                        cost,
                        stages: q.used_fallback
                            ? ["input", "rag", "output", "judge", "fallback"]
                            : ["input", "rag", "output", "judge"],
                    })
                }

                // Ceiling to integer
                const totalCost = Math.ceil(rawCost)

                const fallbackCount = questions.filter(q => q.used_fallback).length

                // Debit (allow negative balance)
                const updatedUser = await tx.user.update({
                    where: { id: userId },
                    data: { credits: { decrement: totalCost } },
                })

                // Record transaction with detailed metadata
                await tx.transaction.create({
                    data: {
                        userId,
                        amount: -totalCost,
                        type: "USAGE",
                        reference_id: campaign_id,
                        description: `Envio: ${questions.length} pergunta(s), ${fallbackCount} com fallback — ${totalCost} créditos`,
                        idempotencyKey: idempotency_key,
                        metadata: {
                            rawCost,
                            roundedCost: totalCost,
                            questionCount: questions.length,
                            fallbackCount,
                            jobApplicationId: job_application_id ?? null,
                            campaignId: campaign_id,
                            weightsSnapshot: weightMap,
                            questionBreakdown,
                        },
                    },
                })

                return {
                    newBalance: updatedUser.credits,
                    creditsDebited: totalCost,
                    rawCost,
                    blocked: updatedUser.credits <= 0,
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
            console.error("Erro ao debitar créditos:", error)
            throw new Error("Falha de comunicação no banco de dados ao debitar créditos")
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

    /**
     * Returns the current weight configuration table.
     * Used by the RPA to know costs without hardcoding.
     */
    async getWeightsConfig(): Promise<CreditsServiceResponse> {
        try {
            const weights = await prisma.creditWeight.findMany({
                orderBy: { stage: "asc" },
            })

            return { success: true, data: weights }
        } catch (error) {
            console.error("Erro ao buscar pesos:", error)
            throw new Error("Falha de comunicação no banco de dados ao buscar pesos")
        }
    }
}

export const creditsService = new CreditsService()
