import { prisma } from "@repo/database"
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

   
    async createLinkedinCampaign(userId: string, rawData: CreateLinkedinCampaignInput): Promise<CampaignResponse> {
        
        const validation = createLinkedinCampaignSchema.safeParse(rawData)

        if (validation.success != true) {
            return {
                success: validation.success,
                errorDesc: validation.error?.format()
            }
        }

        try {

            const existingResumeId = await prisma.user.findFirst({
                where: {
                    id: userId,
                    resumeId: validation.data.resumeId
                }
            })
            
            if (!existingResumeId) {
                return {
                    success: true,
                    message: "Curriculo não pertence ao usuário ou não encontrado"
                }
            }

            const activeLinkedinCampaign = await prisma.campaign.findFirst({
                where: {
                    userId: userId,
                    platform: 'linkedin',
                    status: 'active'
                }
            })

            if (activeLinkedinCampaign) {
                return {
                    success: false,
                    message: "Você já tem uma campanha ativa do Linkedin"
                }
            }

            const createCampaignData = await prisma.campaign.create({
            data: {
                userId: userId,
                resumeId: validation.data.resumeId,
                name: validation.data.name,
                platform: "linkedin",
                status: 'inactive',
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
            console.error("Erro ao criar curriculo no banco de dados", error)
            throw new Error("Falha na comunicação do banco de dados endpoint createResume")
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
            
            const verifyCampaign = await prisma.campaign.findFirst({
                where: {
                    userId: userId,
                    resumeId: validation.data.resumeId
                }
            })

            if (!verifyCampaign) {
                return {
                    success: true,
                    message: "campanha não econtrada"
                }
            }

            const CreatecampaignInfoJobs = await prisma.campaign.create({
                data: {
                    userId: userId,
                    resumeId: validation.data.resumeId,
                    name: validation.data.name,
                    platform: "infojobs",
                    dailyLimit: validation.data.dailyLimit,
                    status: 'inactive',
                    infojobsConfig: {
                        create: {
                            searchTerms: validation.data.infojobsConfig.searchTerms,
                            locationState: validation.data.infojobsConfig.locationState,
                            kmDeVoce: validation.data.infojobsConfig.kmDeVoce,
                            salaryFilter: validation.data.infojobsConfig.salaryFilter,
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
            console.error("Erro ao criar curriculo no banco de dados", error)
            throw new Error("Falha na comunicação do banco de dados endpoint createResume")
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
                    ...(validation.data.dailyLimit && { dailyLimit: validation.data.dailyLimit }),
                }
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

            const updateStatus = await prisma.campaign.update({
                where: {id: campaignId },
                data: {
                    status: 'active',
                },
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
                prisma.campaignLinkedin.deleteMany({ where: { campaignId } }),
                prisma.campaignInfojobs.deleteMany({ where: { campaignId } }),
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
