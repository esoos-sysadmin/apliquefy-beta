import { prisma, Prisma } from "@repo/database"
import { createReportSchema, listReportsQuerySchema, CreateReportInput, ListReportsQuery } from "../../../app/lib/validations/report"
import { ReportResponse, ReportWithCampaign } from "../../../app/lib/types/report-types"

export class ReportService {

    async createReport(userId: string, rawData: CreateReportInput): Promise<ReportResponse> {
        const validation = createReportSchema.safeParse(rawData)

        if (!validation.success) {
            return {
                success: false,
                errorDesc: validation.error.format(),
            }
        }

        const {
            campaign_id,
            total_jobs_applications,
            success_applications,
            fail_applications,
            credits_used,
            credits_refund,
        } = validation.data

        try {
            const campaign = await prisma.campaign.findFirst({
                where: { id: campaign_id, userId },
            })

            if (!campaign) {
                return {
                    success: false,
                    message: "Campanha não encontrada ou não pertence ao usuário",
                    code: "FORBIDDEN",
                }
            }

            const report = await prisma.report.create({
                data: {
                    campaignId: campaign_id,
                    totalJobsApplications: total_jobs_applications ?? 0,
                    successApplications: success_applications ?? 0,
                    failApplications: fail_applications ?? 0,
                    creditsUsed: credits_used ?? 0,
                    creditsRefund: credits_refund ?? 0,
                },
            })

            return { success: true, data: report }

        } catch (error) {
            console.error("Erro ao criar report", error)
            throw new Error("Falha de comunicação no banco de dados ao criar report")
        }
    }

    async getReportById(userId: string, reportId: string): Promise<ReportResponse> {
        try {
            const report = await prisma.report.findUnique({
                where: { id: reportId },
                include: { campaign: true },
            })

            if (!report) {
                return {
                    success: false,
                    message: "Relatório não encontrado",
                    code: "NOT_FOUND",
                }
            }

            if (report.campaign?.userId !== userId) {
                return {
                    success: false,
                    message: "Acesso negado a este relatório",
                    code: "FORBIDDEN",
                }
            }

            const result: ReportWithCampaign = {
                ...report,
                campaign_name: report.campaign?.name ?? "",
                campaign_platform: report.campaign?.platform ?? "",
            }

            return { success: true, data: result }

        } catch (error) {
            console.error("Erro ao buscar report por ID", error)
            throw new Error("Falha de comunicação no banco de dados ao buscar report")
        }
    }

    async listReports(userId: string, rawQuery: ListReportsQuery): Promise<ReportResponse> {
        const validation = listReportsQuerySchema.safeParse(rawQuery)

        if (!validation.success) {
            return {
                success: false,
                errorDesc: validation.error.format(),
            }
        }

        const { campaign_id, page, limit, sort } = validation.data

        try {
            const where: Prisma.ReportWhereInput = {
                campaign: { userId },
                ...(campaign_id && { campaignId: campaign_id }),
            }

            const orderBy: Prisma.ReportOrderByWithRelationInput = {
                createdAt: sort === "created_at_asc" ? "asc" : "desc",
            }

            const [reports, total] = await prisma.$transaction([
                prisma.report.findMany({
                    where,
                    orderBy,
                    skip: (page - 1) * limit,
                    take: limit,
                    include: { campaign: true },
                }),
                prisma.report.count({ where }),
            ])

            const data: ReportWithCampaign[] = reports.map(r => ({
                ...r,
                campaign_name: r.campaign?.name ?? "",
                campaign_platform: r.campaign?.platform ?? "",
            }))

            return {
                success: true,
                data,
                pagination: {
                    page,
                    limit,
                    total,
                    total_pages: Math.ceil(total / limit),
                },
            }

        } catch (error) {
            console.error("Erro ao listar reports", error)
            throw new Error("Falha de comunicação no banco de dados ao listar reports")
        }
    }
}

export const reportService = new ReportService()
