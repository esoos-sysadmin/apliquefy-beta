import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { abTestService } from "../../../../backend/modules/ab-test/ab-test.service";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ message: "Usuário não autenticado" }, { status: 401 });
        }

        const { id } = await context.params;
        const result = await abTestService.getAbTestById(userId, id);

        if (!result.success) {
            const status = result.code === "NOT_FOUND" ? 404 : 400;
            return NextResponse.json({ message: result.message ?? "Erro ao buscar teste A/B" }, { status });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("Erro na rota GET /api/ab-tests/[id]:", error);
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
    }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ message: "Usuário não autenticado" }, { status: 401 });
        }

        const { id } = await context.params;
        const body = await request.json();
        const result = await abTestService.updateAbTest(userId, id, body);

        if (!result.success) {
            const status = result.code === "NOT_FOUND" ? 404 : 400;
            return NextResponse.json(
                { message: result.message ?? "Dados inválidos", errorDesc: result.errorDesc },
                { status }
            );
        }

        return NextResponse.json({ success: true, data: result.data });
    } catch (error) {
        console.error("Erro na rota PATCH /api/ab-tests/[id]:", error);
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
    }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ message: "Usuário não autenticado" }, { status: 401 });
        }

        const { id } = await context.params;
        const result = await abTestService.deleteAbTest(userId, id);

        if (!result.success) {
            const status = result.code === "NOT_FOUND" ? 404 : 400;
            return NextResponse.json({ message: result.message ?? "Erro ao deletar teste A/B" }, { status });
        }

        return NextResponse.json({ success: true, message: result.message });
    } catch (error) {
        console.error("Erro na rota DELETE /api/ab-tests/[id]:", error);
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
    }
}
