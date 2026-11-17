import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { campaignService } from "../../../../backend/modules/campaign/campaign.service";

// Campanha "Sites de empresas" (platform = ats): roda no worker da nuvem, sem o desktop.
export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ message: "Usuário não autenticado" }, { status: 401 });
        }

        const result = await campaignService.createAtsCampaign(userId, await request.json());
        if (!result.success) {
            return NextResponse.json(
                { message: result.message ?? "Dados inválidos para criação da campanha", errorDesc: result.errorDesc },
                { status: 400 },
            );
        }
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("Erro na rota POST /api/campaigns/ats:", error);
        return NextResponse.json({ message: "Falha interna ao criar campanha" }, { status: 500 });
    }
}
