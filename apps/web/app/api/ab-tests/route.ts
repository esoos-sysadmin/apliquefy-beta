import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAbTestSchema } from "../../lib/validations/ab-test";
import { abTestService } from "../../../backend/modules/ab-test/ab-test.service";

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ message: "Usuário não autenticado" }, { status: 401 });
        }

        const result = await abTestService.getAllAbTests(userId);

        if (!result.success) {
            return NextResponse.json({ message: "Erro ao buscar testes A/B" }, { status: 400 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("Erro na rota GET /api/ab-tests:", error);
        return NextResponse.json({ message: "Falha interna ao buscar testes A/B" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ message: "Usuário não autenticado" }, { status: 401 });
        }

        const rawData = await request.json();
        const validation = createAbTestSchema.safeParse(rawData);

        if (!validation.success) {
            return NextResponse.json(
                { message: "Dados inválidos para criação do teste A/B", errorDesc: validation.error.format() },
                { status: 400 }
            );
        }

        const result = await abTestService.createAbTest(userId, validation.data);

        if (!result.success) {
            return NextResponse.json(
                { message: result.message ?? "Erro ao criar teste A/B", errorDesc: result.errorDesc },
                { status: 400 }
            );
        }

        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("Erro na rota POST /api/ab-tests:", error);
        return NextResponse.json({ message: "Falha interna ao criar teste A/B" }, { status: 500 });
    }
}
