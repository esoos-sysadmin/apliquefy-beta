import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@repo/database"

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ message: "Usuário não autenticado" }, { status: 401 })
        }

        const { id } = await context.params

        const campaign = await prisma.campaign.findFirst({
            where: { id, userId },
            include: {
                linkedinConfig: true,
                infojobsConfig: true,
                resume: true,
            },
        })

        if (!campaign) {
            return NextResponse.json(
                { message: "Campanha não encontrada", code: "NOT_FOUND" },
                { status: 404 }
            )
        }

        const startOfDay = new Date()
        startOfDay.setUTCHours(0, 0, 0, 0)
        const endOfDay = new Date(startOfDay)
        endOfDay.setUTCDate(endOfDay.getUTCDate() + 1)

        const usedToday = await prisma.jobApplication.count({
            where: {
                campaignId: id,
                userId,
                status: "applied",
                appliedAt: { gte: startOfDay, lt: endOfDay },
            },
        })

        const balance = await prisma.user.findUnique({
            where: { id: userId },
            select: { credits: true },
        })

        return NextResponse.json(
            {
                success: true,
                data: {
                    campaign: {
                        id: campaign.id,
                        name: campaign.name,
                        platform: campaign.platform,
                        status: campaign.status,
                        dailyLimit: campaign.dailyLimit,
                        linkedinConfig: campaign.linkedinConfig,
                        infojobsConfig: campaign.infojobsConfig,
                    },
                    resume: campaign.resume,
                    dailyStatus: {
                        used: usedToday,
                        limit: campaign.dailyLimit ?? 0,
                        remaining: Math.max(0, (campaign.dailyLimit ?? 0) - usedToday),
                    },
                    credits: balance?.credits ?? 0,
                },
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("Erro na rota GET /api/campaigns/[id]/runtime:", error)
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
    }
}
