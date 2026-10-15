import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { stripeService } from "../../../../backend/modules/stripe/stripe.service";
import { isUpsellSlug } from "../../../lib/constants/plans";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// /planos: ?plan=<slug>. Funil /lp: ?from=lp&plan=<slug opcional>&bumps=<slug,slug>.
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const plan = searchParams.get("plan") ?? undefined;
    const fromLp = searchParams.get("from") === "lp";

    const { userId } = await auth();

    // Sem conta ainda: cria no /cadastro e volta para cá com os mesmos parâmetros.
    if (!userId) {
        return NextResponse.redirect(`${APP_URL}/cadastro?${searchParams.toString()}`);
    }

    const fail = fromLp ? `${APP_URL}/lp?checkout=error` : `${APP_URL}/planos`;

    if (!plan && !fromLp) {
        return NextResponse.redirect(fail);
    }

    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress;

    if (!email) {
        return NextResponse.redirect(fail);
    }

    const result = fromLp
        ? await stripeService.createLpCheckout(userId, email, {
              planSlug: plan,
              bumps: (searchParams.get("bumps") ?? "").split(",").filter(isUpsellSlug),
          })
        : await stripeService.createSubscriptionCheckout(userId, email, plan!, { successUrl: `${APP_URL}/obrigado` });

    if (!result.success) {
        return NextResponse.redirect(fromLp && result.code === "CONFLICT" ? `${APP_URL}/lp?checkout=active` : fail);
    }

    return NextResponse.redirect(result.data.url);
}
