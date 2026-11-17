import { prisma } from "@repo/database"
import { flatCost } from "../credits/credits.service";
import {
    createLinkedinCampaignSchema,
    createInfojobsCampaignSchema,
    updateCampaignSchema,
} from "../../../app/lib/validations/campaign";
import {
    CampaignResponse,
    CreateLinkedinCampaignInput,
    CreateInfojobsCampaignInput,
    UpdateCampaignInput,
} from "../../../app/lib/types/campaign-types";

export class CampaignService {
    private campaignRelations = {
        linkedinConfig: true,
        infojobsConfig: true,
        atsConfig: true,
        resume: {
            select: {
                id: true,
                title: true,
            }
        },
        _count: {
            select: {
                jobApplications: true,
                reports: true,
                jobs: true,
            }
        }
    } as const;

   
    async createLinkedinCampaign(userId: string, rawData: CreateLinkedinCampaignInput): Promise<CampaignResponse> {
        
        const validation = createLinkedinCampaignSchema.safeParse(rawData)

        if (validation.success != true) {
            return {
                success: validation.success,
                errorDesc: validation.error?.format()
            }
        }

        try {

            const existingResume = await prisma.resume.findFirst({
                where: {
                    id: validation.data.resumeId,
                    userId: userId,
                }
            })

            if (!existingResume) {
                return {
                    success: false,
                    message: "Currículo não pertence ao usuário ou não encontrado"
                }
            }


            const createCampaignData = await prisma.campaign.create({
            data: {
                userId: userId,
                resumeId: validation.data.resumeId,
                name: validation.data.name,
                platform: "linkedin",
                dailyLimit: validation.data.dailyLimit,
                linkedinConfig: {
                    create: {
                        searchTerms: validation.data.linkedinConfig.searchTerms,
                        locationTerm: validation.data.linkedinConfig.locationTerm,
                        sortBy: validation.data.linkedinConfig.sortBy,
                        datePosted: validation.data.linkedinConfig.datePosted,
                        expLevel: validation.data.linkedinConfig.expLevel,
                        jobType: validation.data.linkedinConfig.jobType,
                        remoteFilter: validation.data.linkedinConfig.remoteFilter
                    }
                }
            }
        })

        return {
            data: createCampaignData,
            success: true
  
            }
        } catch (error) {
            console.error("Erro ao criar campanha LinkedIn", error)
            throw new Error("Erro: Falha de comunicação na API, não foi possível criar a campanha LinkedIn")
        }
    }

    async createInfojobsCampaign(userId: string, rawData: CreateInfojobsCampaignInput): Promise<CampaignResponse> {

        const validation = createInfojobsCampaignSchema.safeParse(rawData)

        if (validation.success != true) {
            return {
                success: validation.success,
                errorDesc: validation.error.format()
            }
        }
        
        try {
            
            const existingResume = await prisma.resume.findFirst({
                where: {
                    id: validation.data.resumeId,
                    userId: userId,
                }
            })

            if (!existingResume) {
                return {
                    success: false,
                    message: "Currículo não pertence ao usuário ou não encontrado"
                }
            }

            const CreatecampaignInfoJobs = await prisma.campaign.create({
                data: {
                    userId: userId,
                    resumeId: validation.data.resumeId,
                    name: validation.data.name,
                    platform: "infojobs",
                    dailyLimit: validation.data.dailyLimit,
                    infojobsConfig: {
                        create: {
                            searchTerms: validation.data.infojobsConfig.searchTerms,
                            locationState: validation.data.infojobsConfig.locationState,
                            kmDeVoce: validation.data.infojobsConfig.kmDeVoce,
                            salaryFilter: validation.data.infojobsConfig.salaryFilter,
                            datePosted: validation.data.infojobsConfig.datePosted,
                            workModels: validation.data.infojobsConfig.workModels,
                            jobAreas: validation.data.infojobsConfig.jobAreas,
                            contractTypes: validation.data.infojobsConfig.contractTypes,
                            workSchedules: validation.data.infojobsConfig.workSchedules,
                            seniorityLevels: validation.data.infojobsConfig.seniorityLevels,
                            pcdTypes: validation.data.infojobsConfig.pcdTypes
                        }
                    }

                }
            })

            return {
                data: CreatecampaignInfoJobs,
                success: true
            }

        } catch (error) {
            console.error("Erro ao criar campanha InfoJobs", error)
            throw new Error("Erro: Falha de comunicação na API, não foi possível criar a campanha InfoJobs")
        }
    }

    async getAllCampaigns(userId: string): Promise<CampaignResponse> {
        try {
            const campaigns = await prisma.campaign.findMany({
                where: { userId },
                include: this.campaignRelations,
                orderBy: { createdAt: "desc" },
            })

            return { success: true, data: campaigns }

        } catch (error) {
            console.error("Erro ao buscar campanhas", error)
            throw new Error("Erro: Falha de comunicação na API, não foi possível buscar as campanhas")
        }
    }

    async getCampaignById(userId: string, campaignId: string): Promise<CampaignResponse> {
        try {
            const campaign = await prisma.campaign.findFirst({
                where: { id: campaignId, userId },
                include: this.campaignRelations,
            })

            if (!campaign) {
                return {
                    success: false,
                    message: "Campanha não encontrada",
                }
            }

            return { success: true, data: campaign }
        } catch (error) {
            console.error("Erro ao buscar campanha por ID", error)
            throw new Error("Erro: Falha de comunicação na API, não foi possível buscar a campanha")
        }
    }

    async updateCampaign(userId: string, campaignId: string, rawData: UpdateCampaignInput): Promise<CampaignResponse> {
        const validation = updateCampaignSchema.safeParse(rawData)

        if (validation.success !== true) {
            return {
                success: false,
                errorDesc: validation.error.format()
            }
        }

        try {
            const campaign = await prisma.campaign.findFirst({
                where: { id: campaignId, userId }
            })

            if (!campaign) {
                return { success: false, message: "Campanha não encontrada" }
            }

            if (validation.data.resumeId) {
                const resumeExists = await prisma.resume.findFirst({
                    where: { id: validation.data.resumeId, userId }
                })

                if (!resumeExists) {
                    return { success: false, message: "Currículo não pertence ao usuário ou não encontrado" }
                }
            }

            const updated = await prisma.campaign.update({
                where: { id: campaignId },
                data: {
                    ...(validation.data.name && { name: validation.data.name }),
                    ...(validation.data.resumeId && { resumeId: validation.data.resumeId }),
                    ...(validation.data.dailyLimit !== undefined && { dailyLimit: validation.data.dailyLimit }),
                },
                include: this.campaignRelations,
            })

            return { success: true, data: updated }

        } catch (error) {
            console.error("Não foi possível atualizar a campanha", error)
            throw new Error("Erro: Falha de comunicação na API, não foi possível atualizar a campanha")
        }
    }

    async pauseCampaign(userId: string, campaignId: string): Promise<CampaignResponse> {
        
        try {

            const existCampaign = await prisma.campaign.findFirst({
                where: {
                    id: campaignId,
                    userId: userId,
                },
                
            })

            if (!existCampaign) {
                return {
                    success: false,
                    errorDesc: "erro, campanha não encontrada"
                }
            }

            if (existCampaign.status === 'paused') {
                return {
                    success: false,
                    message: "A campanha já está pausada!"
                }
            }

            const updateStatus = await prisma.campaign.update({
                where: {id: campaignId },
                data: {
                    status: 'paused',
                },
                include: this.campaignRelations,
            })

            return {
                success: true,
                message: 'Campanha Pausada com sucesso',
                data: updateStatus
            }

        } catch (error) {
            console.error("Não foi possível pausar a campanha", error);
            throw new Error("Erro:Falha de comnunicação na API, não foi possível pausar a campanha")
        }

    }

    async activateCampaign(userId: string, campaignId: string): Promise<CampaignResponse> {
        try {

            const existCampaign = await prisma.campaign.findFirst({
                where: {
                    id: campaignId,
                    userId: userId,
                },
                
            })

            if (!existCampaign) {
                return {
                    success: false,
                    errorDesc: "erro, campanha não encontrada"
                }
            }

            if (existCampaign.status === 'active') {
                return {
                    success: false,
                    message: "A campanha já está ativada!"
                }
            }

            // O currículo pode ter sido excluído depois que a campanha foi criada
            // (a FK zera o vínculo). Sem currículo não há PDF para candidatar.
            if (!existCampaign.resumeId) {
                return {
                    success: false,
                    message: "Esta campanha está sem currículo. Edite a campanha e selecione um currículo antes de ativá-la."
                }
            }

            if (existCampaign.platform === 'linkedin') {
                const activeLinkedin = await prisma.campaign.findFirst({
                    where: { userId, platform: 'linkedin', status: 'active' }
                })

                if (activeLinkedin) {
                    return {
                        success: false,
                        message: "Você já tem uma campanha LinkedIn ativa"
                    }
                }
            }

            const updateStatus = await prisma.campaign.update({
                where: {id: campaignId },
                data: {
                    status: 'active',
                },
                include: this.campaignRelations,
            })

            return {
                success: true,
                message: 'Campanha Ativada com sucesso',
                data: updateStatus
            }

        } catch (error) {
            console.error("Não foi possível ativar a campanha", error);
            throw new Error("Erro:Falha de comunicação na API, não foi possível ativar a campanha")
        }
    }
  
    /**
     * Campanhas `ats` ativas que o worker da nuvem deve alimentar (GET /api/internal/campaigns/active).
     * Só entra campanha com currículo e cujo dono tem saldo para pelo menos um envio na nuvem;
     * sem preço da nuvem definido (CLOUD_COST_PER_APPLICATION), nenhuma (§6.3, ADR-08).
     * `remainingToday` desconta o que já foi enviado hoje E tudo que está na fila
     * (`pending`/`needs_user` de qualquer dia): fila de ontem ainda vai gastar o limite.
     */
    async listActiveCloudCampaigns() {
        const cost = flatCost("cloud", 0)
        if (cost === null) return []

        const campaigns = await prisma.campaign.findMany({
            where: { platform: "ats", status: "active", resumeId: { not: null }, user: { credits: { gte: cost } } },
            select: { id: true, userId: true, resumeId: true, dailyLimit: true, atsConfig: true, user: { select: { credits: true } } },
            orderBy: { createdAt: "asc" },
        })
        if (!campaigns.length) return []

        const startOfDay = new Date()
        startOfDay.setUTCHours(0, 0, 0, 0)
        const ids = campaigns.map((c) => c.id)
        const busy = await prisma.jobApplication.groupBy({
            by: ["campaignId"],
            where: {
                campaignId: { in: ids },
                OR: [
                    { status: "applied", appliedAt: { gte: startOfDay } },
                    { status: { in: ["pending", "needs_user"] } },
                ],
            },
            _count: { _all: true },
        })
        const used = new Map(busy.map((b) => [b.campaignId, b._count._all]))

        return campaigns
            .filter((c) => c.atsConfig)
            .map((c) => ({
                campaignId: c.id,
                userId: c.userId,
                resumeId: c.resumeId as string,
                dailyLimit: c.dailyLimit ?? 0,
                remainingToday: Math.max(0, (c.dailyLimit ?? 0) - (used.get(c.id) ?? 0)),
                credits: c.user.credits,
                config: {
                    searchTerms: c.atsConfig!.searchTerms,
                    locationTerm: c.atsConfig!.locationTerm,
                    remoteOnly: c.atsConfig!.remoteOnly,
                    atsAllowlist: c.atsConfig!.atsAllowlist,
                    fitMinScore: c.atsConfig!.fitMinScore,
                },
            }))
    }

    async deleteCampaign(userId: string, campaignId: string): Promise<CampaignResponse> {
        try {

            const deleteVerify = await prisma.campaign.findFirst({
                where: {
                    id: campaignId,
                    userId: userId
                }
            })

            if (!deleteVerify) {
                return {
                    success: false,
                    errorDesc: "Error: A campanha não existe"
                }
            }

            await prisma.$transaction([
                // Se a campanha for variante de um teste A/B, remove o teste antes (FK).
                prisma.abTest.deleteMany({ where: { OR: [{ variantAId: campaignId }, { variantBId: campaignId }] } }),
                prisma.campaignLinkedin.deleteMany({ where: { campaignId } }),
                prisma.campaignInfojobs.deleteMany({ where: { campaignId } }),
                prisma.campaignAts.deleteMany({ where: { campaignId } }),
                prisma.report.deleteMany({ where: { campaignId } }),
                prisma.job.deleteMany({ where: { campaignId } }),
                prisma.jobApplication.deleteMany({ where: { campaignId } }),
                prisma.campaign.delete({ where: { id: campaignId } }),
            ])
            
            return {
                success: true,
                message: 'Campanha deletada com sucesso'
            }

            
        } catch (error) {
            console.error("Não foi possível deletar a campanha", error)
            throw new Error("Erro: Falha de comunicação na API, não foi possível deletar a campanha")
        }
    }
}

export const campaignService = new CampaignService();
