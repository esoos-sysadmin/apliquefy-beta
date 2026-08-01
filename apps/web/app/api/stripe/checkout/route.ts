import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { stripeService } from "../../../../backend/modules/stripe/stripe.service";

export async function POST(request: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ message: "Usuário não autenticado" }, { status: 401 });
        }

        const user = await currentUser();
        const email = user?.emailAddresses[0]?.emailAddress;

        if (!email) {
            return NextResponse.json({ message: "Email do usuário não encontrado" }, { status: 400 });
        }

        const body = await request.json();
        const { planSlug, packageSlug } = body as { planSlug?: string; packageSlug?: string };

        if (!planSlug && !packageSlug) {
            return NextResponse.json(
                { message: "Informe planSlug ou packageSlug" },
                { status: 400 }
            );
        }

        if (planSlug && packageSlug) {
            return NextResponse.json(
                { message: "Informe apenas planSlug ou packageSlug, não ambos" },
                { status: 400 }
            );
        }

        const result = planSlug
            ? await stripeService.createSubscriptionCheckout(userId, email, planSlug)
            : await stripeService.createCreditPackageCheckout(userId, email, packageSlug!);

        if (!result.success) {
            const statusCode = result.code === "NOT_FOUND" ? 404 : result.code === "CONFLICT" ? 409 : result.code === "FORBIDDEN" ? 403 : 400;
            return NextResponse.json({ message: result.message }, { status: statusCode });
        }

        return NextResponse.json({ data: result.data }, { status: 200 });
    } catch (error) {
        console.error("Erro na rota POST /api/stripe/checkout:", error);
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
    }
}
