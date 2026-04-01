import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createLinkedinCampaignSchema } from "../../../lib/validations/campaign";
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

        const validation = createLinkedinCampaignSchema.safeParse(rawData);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Dados inválidos para criação da campanha LinkedIn",
                    errorDesc: validation.error.format(),
                },
                { status: 400 }
            );
        }

        const result = await campaignService.createLinkedinCampaign(userId, validation.data);

        if (!result.success) {
            return NextResponse.json(
                {
                    message: result.message ?? "Erro ao criar campanha LinkedIn",
                    errorDesc: result.errorDesc,
                },
                { status: 400 }
            );
        }

        return NextResponse.json(result, { status: 201 });

    } catch (error) {
        console.error("Erro na rota POST /api/campaigns/linkedin:", error);
        return NextResponse.json(
            { message: "Falha interna ao criar campanha LinkedIn" },
            { status: 500 }
        );
    }
}
