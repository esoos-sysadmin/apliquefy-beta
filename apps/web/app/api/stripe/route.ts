import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { stripeService } from "../../../backend/modules/stripe/stripe.service";

export async function GET(request: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        const result = await stripeService.createBillingPortalSession(userId);

        if (!result.success) {
            return NextResponse.redirect(new URL("/assinatura?portal=error", request.url));
        }

        return NextResponse.redirect(result.data.url);
    } catch (error) {
        console.error("Erro na rota GET /api/stripe:", error);
        return NextResponse.redirect(new URL("/assinatura?portal=error", request.url));
    }
}
