import { prisma, Prisma } from "@repo/database"
import { createJobSchema, listJobsQuerySchema, CreateJobInput, ListJobsQuery } from "../../../app/lib/validations/job"
import { JobResponse } from "../../../app/lib/types/job-types"

export class JobService {

    async createJob(userId: string, rawData: CreateJobInput): Promise<JobResponse> {
        const validation = createJobSchema.safeParse(rawData)

        if (!validation.success) {
            return {
                success: false,
                errorDesc: validation.error.format(),
            }
        }

        const { campaign_id, link, company_name, position, expiration_date, number_of_applications } = validation.data

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

            const job = await prisma.job.create({
                data: {
                    campaignId: campaign_id,
                    link,
                    companyName: company_name,
                    position,
                    expirationDate: expiration_date ? new Date(expiration_date) : null,
                    numberOfApplications: number_of_applications ?? 0,
                },
            })

            return { success: true, data: job }

        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
                return {
                    success: false,
                    message: "Já existe um job com esse link",
                    code: "CONFLICT",
                }
            }
            console.error("Erro ao criar job", error)
            throw new Error("Falha de comunicação no banco de dados ao criar job")
        }
    }

    async getJobById(userId: string, jobId: string): Promise<JobResponse> {
        try {
            const job = await prisma.job.findUnique({
                where: { id: jobId },
                include: { campaign: true },
            })

            if (!job) {
                return {
                    success: false,
                    message: "Job não encontrado",
                    code: "NOT_FOUND",
                }
            }

            if (job.campaign?.userId !== userId) {
                return {
                    success: false,
                    message: "Acesso negado a este job",
                    code: "FORBIDDEN",
                }
            }

            return { success: true, data: job }

        } catch (error) {
            console.error("Erro ao buscar job por ID", error)
            throw new Error("Falha de comunicação no banco de dados ao buscar job")
        }
    }

    async listJobs(userId: string, rawQuery: ListJobsQuery): Promise<JobResponse> {
        const validation = listJobsQuerySchema.safeParse(rawQuery)

        if (!validation.success) {
            return {
                success: false,
                errorDesc: validation.error.format(),
            }
        }

        const { campaign_id, page, limit, sort } = validation.data

        try {
            const where: Prisma.JobWhereInput = {
                campaign: { userId },
                ...(campaign_id && { campaignId: campaign_id }),
            }

            const orderBy: Prisma.JobOrderByWithRelationInput = {
                createdAt: sort === "created_at_asc" ? "asc" : "desc",
            }

            const [jobs, total] = await prisma.$transaction([
                prisma.job.findMany({
                    where,
                    orderBy,
                    skip: (page - 1) * limit,
                    take: limit,
                }),
                prisma.job.count({ where }),
            ])

            return {
                success: true,
                data: jobs,
                pagination: {
                    page,
                    limit,
                    total,
                    total_pages: Math.ceil(total / limit),
                },
            }

        } catch (error) {
            console.error("Erro ao listar jobs", error)
            throw new Error("Falha de comunicação no banco de dados ao listar jobs")
        }
    }
}

export const jobService = new JobService()
