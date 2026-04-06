import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { campaignService } from "../../../../../backend/modules/campaign/campaign.service";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { message: "Usuário não autenticado" },
                { status: 401 }
            );
        }

        const { id } = await context.params;

        if (!id) {
            return NextResponse.json(
                { message: "ID da campanha não fornecido" },
                { status: 400 }
            );
        }

        const result = await campaignService.activateCampaign(userId, id);

        if (!result.success) {
            return NextResponse.json(
                {
                    message: result.message ?? "Erro ao ativar campanha",
                    errorDesc: result.errorDesc,
                },
                { status: 400 }
            );
        }

        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        console.error("Erro na rota PATCH /api/campaigns/[id]/activate:", error);
        return NextResponse.json(
            { message: "Falha interna ao ativar campanha" },
            { status: 500 }
        );
    }
}
