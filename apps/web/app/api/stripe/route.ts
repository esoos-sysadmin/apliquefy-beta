import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const billingPortalUrl = process.env.STRIPE_BILLING_PORTAL_URL;

    if (!billingPortalUrl) {
        return NextResponse.redirect(new URL("/conta?billing=missing", request.url));
    }

    return NextResponse.redirect(billingPortalUrl);
}
