import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { updateCampaignSchema } from "../../../lib/validations/campaign";
import { campaignService } from "../../../../backend/modules/campaign/campaign.service";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
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

        const result = await campaignService.getCampaignById(userId, id);

        if (!result.success) {
            return NextResponse.json(
                {
                    message: result.message ?? "Erro ao buscar campanha",
                    errorDesc: result.errorDesc,
                },
                { status: 404 }
            );
        }

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Erro na rota GET /api/campaigns/[id]:", error);
        return NextResponse.json(
            { message: "Falha interna ao buscar campanha" },
            { status: 500 }
        );
    }
}

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

        const rawData = await request.json();

        const validation = updateCampaignSchema.safeParse(rawData);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Dados inválidos para atualização da campanha",
                    errorDesc: validation.error.format(),
                },
                { status: 400 }
            );
        }

        const result = await campaignService.updateCampaign(userId, id, validation.data);

        if (!result.success) {
            return NextResponse.json(
                {
                    message: result.message ?? "Erro ao atualizar campanha",
                    errorDesc: result.errorDesc,
                },
                { status: 400 }
            );
        }

        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        console.error("Erro na rota PATCH /api/campaigns/[id]:", error);
        return NextResponse.json(
            { message: "Falha interna ao atualizar campanha" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
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

        const result = await campaignService.deleteCampaign(userId, id);

        if (!result.success) {
            return NextResponse.json(
                {
                    message: result.message ?? "Erro ao deletar campanha",
                    errorDesc: result.errorDesc,
                },
                { status: 400 }
            );
        }

        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        console.error("Erro na rota DELETE /api/campaigns/[id]:", error);
        return NextResponse.json(
            { message: "Falha interna ao deletar campanha" },
            { status: 500 }
        );
    }
}
