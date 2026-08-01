import { prisma, Prisma } from "@repo/database";
import { createAbTestSchema, updateAbTestSchema } from "../../../app/lib/validations/ab-test";
import type { CreateAbTestInput, UpdateAbTestInput } from "../../../app/lib/validations/ab-test";

type ServiceResponse =
    | { success: true; data?: unknown; message?: string }
    | { success: false; message?: string; code?: string; errorDesc?: unknown };

/**
 * Monta o bloco `data` de uma Campaign variante do teste A/B a partir da config validada.
 * Cada variante é uma Campaign real: reusa applications, limite diário, engine e relatórios.
 */
function buildVariantData(
    userId: string,
    input: CreateAbTestInput,
    resumeId: string,
    suffix: string,
): Prisma.CampaignCreateInput {
    const base = {
        user: { connect: { id: userId } },
        resume: { connect: { id: resumeId } },
        name: `${input.name} (${suffix})`,
        platform: input.platform,
        dailyLimit: input.dailyLimit,
    };

    if (input.platform === "linkedin") {
        return { ...base, linkedinConfig: { create: input.linkedinConfig } };
    }
    return { ...base, infojobsConfig: { create: input.infojobsConfig } };
}

function variantSummarySelect() {
    return {
        id: true,
        name: true,
        status: true,
        resume: { select: { id: true, title: true } },
        _count: { select: { jobApplications: true } },
    } as const;
}

export class AbTestService {
    async createAbTest(userId: string, raw: CreateAbTestInput): Promise<ServiceResponse> {
        const validation = createAbTestSchema.safeParse(raw);

        if (!validation.success) {
            return { success: false, errorDesc: validation.error.format() };
        }

        const input = validation.data;

        try {
            const resumes = await prisma.resume.findMany({
                where: { id: { in: [input.resumeAId, input.resumeBId] }, userId },
                select: { id: true },
            });

            if (resumes.length !== 2) {
                return { success: false, message: "Um dos currículos não pertence ao usuário ou não foi encontrado" };
            }

            const abTest = await prisma.$transaction(async (tx) => {
                const variantA = await tx.campaign.create({ data: buildVariantData(userId, input, input.resumeAId, "A") });
                const variantB = await tx.campaign.create({ data: buildVariantData(userId, input, input.resumeBId, "B") });

                return tx.abTest.create({
                    data: {
                        userId,
                        name: input.name,
                        platform: input.platform,
                        hypothesis: input.hypothesis ?? null,
                        variantAId: variantA.id,
                        variantBId: variantB.id,
                    },
                    include: {
                        variantA: { select: variantSummarySelect() },
                        variantB: { select: variantSummarySelect() },
                    },
                });
            });

            return { success: true, data: abTest };
        } catch (error) {
            console.error("Erro ao criar teste A/B:", error);
            throw new Error("Falha de comunicação no banco de dados ao criar o teste A/B");
        }
    }

    async getAllAbTests(userId: string): Promise<ServiceResponse> {
        try {
            const abTests = await prisma.abTest.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" },
                include: {
                    variantA: { select: variantSummarySelect() },
                    variantB: { select: variantSummarySelect() },
                },
            });

            return { success: true, data: abTests };
        } catch (error) {
            console.error("Erro ao buscar testes A/B:", error);
            throw new Error("Falha de comunicação no banco de dados ao buscar os testes A/B");
        }
    }

    /**
     * Detalhe com comparação: para cada variante, a lista de candidaturas (com o tracking
     * manual gotResponse/gotInterview) e as métricas agregadas (enviadas, respostas,
     * entrevistas e taxas). O denominador das taxas é o total de candidaturas enviadas.
     */
    async getAbTestById(userId: string, id: string): Promise<ServiceResponse> {
        try {
            const abTest = await prisma.abTest.findFirst({
                where: { id, userId },
                include: {
                    variantA: { select: { id: true, name: true, status: true, resume: { select: { id: true, title: true } } } },
                    variantB: { select: { id: true, name: true, status: true, resume: { select: { id: true, title: true } } } },
                },
            });

            if (!abTest) {
                return { success: false, message: "Teste A/B não encontrado", code: "NOT_FOUND" };
            }

            const applications = await prisma.jobApplication.findMany({
                where: { userId, campaignId: { in: [abTest.variantAId, abTest.variantBId] } },
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    campaignId: true,
                    platform: true,
                    companyName: true,
                    jobTitle: true,
                    jobUrl: true,
                    status: true,
                    gotResponse: true,
                    gotInterview: true,
                    appliedAt: true,
                    createdAt: true,
                },
            });

            const buildVariant = (
                campaign: { id: string; name: string; status: string; resume: { id: string; title: string } | null },
            ) => {
                const apps = applications.filter((a) => a.campaignId === campaign.id);
                const sent = apps.filter((a) => a.status === "applied").length;
                const responses = apps.filter((a) => a.gotResponse).length;
                const interviews = apps.filter((a) => a.gotInterview).length;
                return {
                    campaignId: campaign.id,
                    name: campaign.name,
                    status: campaign.status,
                    resumeTitle: campaign.resume?.title ?? null,
                    metrics: {
                        total: apps.length,
                        sent,
                        responses,
                        interviews,
                        responseRate: sent > 0 ? Math.round((responses / sent) * 100) : 0,
                        interviewRate: sent > 0 ? Math.round((interviews / sent) * 100) : 0,
                    },
                    applications: apps,
                };
            };

            return {
                success: true,
                data: {
                    id: abTest.id,
                    name: abTest.name,
                    platform: abTest.platform,
                    hypothesis: abTest.hypothesis,
                    winner: abTest.winner,
                    createdAt: abTest.createdAt,
                    variantA: buildVariant(abTest.variantA),
                    variantB: buildVariant(abTest.variantB),
                },
            };
        } catch (error) {
            console.error("Erro ao buscar teste A/B:", error);
            throw new Error("Falha de comunicação no banco de dados ao buscar o teste A/B");
        }
    }

    async updateAbTest(userId: string, id: string, raw: UpdateAbTestInput): Promise<ServiceResponse> {
        const validation = updateAbTestSchema.safeParse(raw);

        if (!validation.success) {
            return { success: false, errorDesc: validation.error.format() };
        }

        try {
            const existing = await prisma.abTest.findFirst({ where: { id, userId }, select: { id: true } });
            if (!existing) return { success: false, message: "Teste A/B não encontrado", code: "NOT_FOUND" };

            const updated = await prisma.abTest.update({
                where: { id },
                data: {
                    ...(validation.data.winner !== undefined && { winner: validation.data.winner }),
                    ...(validation.data.hypothesis !== undefined && { hypothesis: validation.data.hypothesis }),
                },
            });

            return { success: true, data: updated };
        } catch (error) {
            console.error("Erro ao atualizar teste A/B:", error);
            throw new Error("Falha de comunicação no banco de dados ao atualizar o teste A/B");
        }
    }

    /**
     * Remove o teste e as duas campanhas variantes (com applications, jobs, reports e configs).
     */
    async deleteAbTest(userId: string, id: string): Promise<ServiceResponse> {
        try {
            const abTest = await prisma.abTest.findFirst({
                where: { id, userId },
                select: { id: true, variantAId: true, variantBId: true },
            });

            if (!abTest) return { success: false, message: "Teste A/B não encontrado", code: "NOT_FOUND" };

            const campaignIds = [abTest.variantAId, abTest.variantBId];

            await prisma.$transaction([
                prisma.abTest.delete({ where: { id } }),
                prisma.campaignLinkedin.deleteMany({ where: { campaignId: { in: campaignIds } } }),
                prisma.campaignInfojobs.deleteMany({ where: { campaignId: { in: campaignIds } } }),
                prisma.report.deleteMany({ where: { campaignId: { in: campaignIds } } }),
                prisma.job.deleteMany({ where: { campaignId: { in: campaignIds } } }),
                prisma.jobApplication.deleteMany({ where: { campaignId: { in: campaignIds } } }),
                prisma.campaign.deleteMany({ where: { id: { in: campaignIds } } }),
            ]);

            return { success: true, message: "Teste A/B removido com sucesso" };
        } catch (error) {
            console.error("Erro ao deletar teste A/B:", error);
            throw new Error("Falha de comunicação no banco de dados ao deletar o teste A/B");
        }
    }
}

export const abTestService = new AbTestService();
