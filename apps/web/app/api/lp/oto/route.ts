import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { stripeService } from "../../../../backend/modules/stripe/stripe.service";

const bodySchema = z.object({
    sessionId: z.string().startsWith("cs_"),
    oto: z.enum(["voice", "text"]),
});

// OTO do funil /lp: cobra o upsell pós-compra no cartão do checkout que acabou de ser pago.
export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ message: "Usuário não autenticado" }, { status: 401 });
        }

        const parsed = bodySchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) {
            return NextResponse.json({ message: "Dados inválidos", errors: parsed.error.issues }, { status: 400 });
        }

        const result = await stripeService.chargeLpOto(userId, parsed.data.sessionId, parsed.data.oto);
        if (!result.success) {
            const status = result.code === "FORBIDDEN" ? 403 : result.code === "NOT_FOUND" ? 404 : 402;
            return NextResponse.json({ message: result.message }, { status });
        }

        return NextResponse.json({ data: { ok: true } }, { status: 200 });
    } catch (error) {
        console.error("Erro na rota POST /api/lp/oto:", error);
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
    }
}
