import { prisma } from "@repo/database"
import {
    createJobApplicationSchema,
    updateJobApplicationSchema,
    type CreateJobApplicationInput,
    type UpdateJobApplicationInput,
} from "../../../app/lib/validations/job-application"

type ServiceResponse =
    | { success: true; data?: unknown }
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

            const application = await prisma.jobApplication.create({
                data: {
                    campaignId: campaign_id,
                    userId,
                    platform,
                    companyName: company_name ?? null,
                    jobTitle: job_title ?? null,
                    jobUrl: job_url ?? null,
                    status: "pending",
                },
            })

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

        const { status, error_log, applied_at, company_name, job_title, job_url } = validation.data

        try {
            const existing = await prisma.jobApplication.findFirst({
                where: { id, userId },
                select: { id: true },
            })

            if (!existing) {
                return { success: false, message: "Candidatura não encontrada", code: "NOT_FOUND" }
            }

            const appliedAt =
                applied_at !== undefined
                    ? applied_at
                        ? new Date(applied_at)
                        : null
                    : status === "applied"
                      ? new Date()
                      : undefined

            const updated = await prisma.jobApplication.update({
                where: { id },
                data: {
                    ...(status && { status }),
                    ...(error_log !== undefined && { errorLog: error_log }),
                    ...(appliedAt !== undefined && { appliedAt }),
                    ...(company_name !== undefined && { companyName: company_name }),
                    ...(job_title !== undefined && { jobTitle: job_title }),
                    ...(job_url !== undefined && { jobUrl: job_url }),
                },
            })

            return { success: true, data: updated }
        } catch (error) {
            console.error("Erro ao atualizar JobApplication:", error)
            throw new Error("Falha de comunicação no banco de dados ao atualizar candidatura")
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

export const jobApplicationService = new JobApplicationService()
