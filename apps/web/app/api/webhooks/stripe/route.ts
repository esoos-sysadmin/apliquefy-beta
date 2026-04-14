import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "../../../lib/stripe";
import { stripeService } from "../../../../backend/modules/stripe/stripe.service";
import { prisma } from "@repo/database";

export async function POST(request: Request) {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
        return NextResponse.json({ message: "Stripe signature ausente" }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
        console.error("STRIPE_WEBHOOK_SECRET não configurado");
        return NextResponse.json({ message: "Webhook secret não configurado" }, { status: 500 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Assinatura inválida";
        console.error("Webhook signature verification failed:", message);
        return NextResponse.json({ message: "Assinatura do webhook inválida" }, { status: 400 });
    }

    // Idempotency check
    const existing = await prisma.webhookEvent.findUnique({ where: { id: event.id } });
    if (existing) {
        return NextResponse.json({ message: "Evento já processado" }, { status: 200 });
    }

    try {
        switch (event.type) {
            case "checkout.session.completed":
                await stripeService.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
                break;

            case "invoice.paid":
                await stripeService.handleInvoicePaid(event.data.object as Stripe.Invoice);
                break;

            case "invoice.payment_failed":
                await stripeService.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
                break;

            case "customer.subscription.updated":
                await stripeService.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
                break;

            case "customer.subscription.deleted":
                await stripeService.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
                break;

            default:
                break;
        }

        // Record processed event for idempotency
        await prisma.webhookEvent.create({
            data: { id: event.id, type: event.type },
        });
    } catch (error) {
        console.error(`Erro ao processar webhook ${event.type}:`, error);
        return NextResponse.json({ message: "Erro ao processar evento" }, { status: 500 });
    }

    return NextResponse.json({ received: true }, { status: 200 });
}
