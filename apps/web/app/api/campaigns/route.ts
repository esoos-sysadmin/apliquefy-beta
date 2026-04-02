import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { campaignService } from "../../../backend/modules/campaign/campaign.service";

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { message: "Usuário não autenticado" },
                { status: 401 }
            );
        }

        const result = await campaignService.getAllCampaigns(userId);

        if (!result.success) {
            return NextResponse.json(
                { message: "Erro ao buscar campanhas" },
                { status: 400 }
            );
        }

        return NextResponse.json(result);

    } catch (error) {
        console.error("Erro na rota GET /api/campaigns:", error);
        return NextResponse.json(
            { message: "Falha interna ao buscar campanhas" },
            { status: 500 }
        );
    }
}
