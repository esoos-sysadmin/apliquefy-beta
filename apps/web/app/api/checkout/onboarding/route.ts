import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { stripeService } from "../../../../backend/modules/stripe/stripe.service";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function GET(request: Request) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.redirect(`${APP_URL}/cadastro`);
    }

    const { searchParams } = new URL(request.url);
    const plan = searchParams.get("plan");

    if (!plan) {
        return NextResponse.redirect(`${APP_URL}/planos`);
    }

    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress;

    if (!email) {
        return NextResponse.redirect(`${APP_URL}/planos`);
    }

    const result = await stripeService.createSubscriptionCheckout(userId, email, plan, {
        successUrl: `${APP_URL}/obrigado`,
    });

    if (!result.success) {
        return NextResponse.redirect(`${APP_URL}/planos`);
    }

    return NextResponse.redirect(result.data.url);
}
