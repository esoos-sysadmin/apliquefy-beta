import { prisma } from "@repo/database"
import { resumeSchema } from "../../../app/lib/validations/resume"
import { CreateResumeResponse } from "../../../app/lib/types/resume-types"
import { z } from "zod";

export type IResumeDataInput = z.infer<typeof resumeSchema>

export class ResumeService {

    async createResume(userId: string, title: string, rawData: IResumeDataInput): Promise<CreateResumeResponse> {
    
        const validation = resumeSchema.safeParse(rawData)
    
        if (validation.success != true) {
    
            return {
                success: validation.success,
                errorDesc: validation.error.format()
            }
    
        }
    
        try {
    
            const resumeSave = await prisma.resume.create({
                data: {
                    userId: userId,
                    title: title,
                    personalInfo: validation.data.personalInfo,
                    education: validation.data.education,
                    experience: validation.data.experience,
                    skills: validation.data.skills,
                    idioms: validation.data.idioms
                },
    
            })
            // criar function emailSent para verificação do usuário
            return {
                data: resumeSave,
                success: true
            }
    
    
    
        } catch (error) {
            console.error("Erro ao criar curriculo no banco de dados", error)
            throw new Error("Falha na comunicação do banco de dados endpoint createResume")
        }
    
    }
    
    async getAllMyResumes(userId: string): Promise<CreateResumeResponse> {
        try {
    
            const responseAllCvs = await prisma.resume.findMany({
                where: { userId: userId }
            })
    
            if (responseAllCvs.length != 0) {
                return {
                    success: true,
                    data: responseAllCvs
                }
            } else {
                return {
                    success: false,
                    errorDesc: "Erro não há nenhum CV na base de dados"
                }
            }
    
        } catch (err) {
            console.error("Error ao buscasr todos os cvs do banco de dados", err)
            throw new Error("Falha no endpoint getAllResumes")
        }
    
    }
    
    async SearchMyCVsById(userId: string, documentId: string): Promise<CreateResumeResponse> {
        try {
    
            const myCVById = await prisma.resume.findFirst({
                where: { userId: userId, id: documentId }
            })
    
            if (!myCVById) {
                return {
                    success: false,
                    errorDesc: "CV não encontrado no banco de dados"
                }
            }
    
            return {
                data: myCVById,
                success: true
            }
    
        } catch (error) {
            console.error("Erro ao tentar buscar CV", error)
            throw new Error("Erro no endpoint seachMyCVsById")
    
        }
    }
    
    async deleteMyResume(userId: string, documentId: string): Promise<CreateResumeResponse> {
        try {
    
            const resume = await prisma.resume.deleteMany({
                where: {
                    userId: userId, id: documentId
                }
            })
    
            if (!resume.count) {
                return {
                    success: false,
                    errorDesc: "Erro: Não foi possível deletar esse CV no banco de dados"
                }
            }
    
            return {
                success: true,
                message: "Cv deletado com sucesso"
            }
    
        } catch (error) {
            console.error("Erro ao deletar curriculo", error)
            throw new Error("Erro ao tentar deletar o resumo na função deleteMyResume")
        }
    }
    
    async updateResume(userId: string, resumeId: string, rawData: IResumeDataInput): Promise<CreateResumeResponse> {
    
        const validation = resumeSchema.safeParse(rawData);
    
        if (validation.success != true) {
            return {
                success: validation.success,
                errorDesc: validation.error.format()
            }
        }
    
        try {
    
        const existingResume = await prisma.resume.findFirst({
                where: {
                    id: resumeId,
                    userId: userId,
                }
            }
        )

        if (!existingResume) {
        return {
                success: false,
                message: "Currículo não encontrado ou você não tem permissão para editá-lo."
            }
        }
    
        const updatedCv = await prisma.resume.update({
            where: {
                id: resumeId, 
            },
            data: validation.data
        });

        return {
            success: true,
            data: updatedCv
        }
    
        } catch (error) {
            console.error("erro ao executar a função de atualizar curriculos:", error)
            throw new Error("Error na atualização do objeto")
        }
    
    }
}
export const resumeService= new ResumeService()