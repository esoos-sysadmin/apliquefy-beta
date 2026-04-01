import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createInfojobsCampaignSchema } from "../../../lib/validations/campaign";
import { campaignService } from "../../../../backend/modules/campaign/campaign.service";

export async function POST(request: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { message: "Usuário não autenticado" },
                { status: 401 }
            );
        }

        const rawData = await request.json();

        const validation = createInfojobsCampaignSchema.safeParse(rawData);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Dados inválidos para criação da campanha InfoJobs",
                    errorDesc: validation.error.format(),
                },
                { status: 400 }
            );
        }

        const result = await campaignService.createInfojobsCampaign(userId, validation.data);

        if (!result.success) {
            return NextResponse.json(
                {
                    message: result.message ?? "Erro ao criar campanha InfoJobs",
                    errorDesc: result.errorDesc,
                },
                { status: 400 }
            );
        }

        return NextResponse.json(result, { status: 201 });

    } catch (error) {
        console.error("Erro na rota POST /api/campaigns/infojobs:", error);
        return NextResponse.json(
            { message: "Falha interna ao criar campanha InfoJobs" },
            { status: 500 }
        );
    }
}
