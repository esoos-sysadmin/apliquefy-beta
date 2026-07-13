import Stripe from "stripe";
import { prisma } from "@repo/database";
import { stripe } from "../../../app/lib/stripe";
import {
    getPackageBySlug,
    getPackageStripePriceId,
    getPlanByStripePriceId,
    getPlanBySlug,
    getPlanStripePriceId,
} from "../../../app/lib/constants/plans";
import { sendEmail } from "../../../app/lib/email/client";
import { PurchaseConfirmation } from "../../../app/lib/email/templates/PurchaseConfirmation";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export class StripeService {
    /**
     * Creates or retrieves a Stripe customer for a user.
     * Saves the Stripe customer ID to the User record.
     */
    async ensureStripeCustomer(userId: string, email: string): Promise<string> {
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (user?.gatewayCustomerId) {
            return user.gatewayCustomerId;
        }

        const customer = await stripe.customers.create({
            email,
            metadata: { userId },
        });

        await prisma.user.update({
            where: { id: userId },
            data: { gatewayCustomerId: customer.id },
        });

        return customer.id;
    }

    /**
     * Creates a Stripe Checkout Session for subscribing to a plan.
     */
    async createSubscriptionCheckout(
        userId: string,
        email: string,
        planSlug: string,
        options?: { successUrl?: string }
    ): Promise<{ success: true; data: { url: string } } | { success: false; message: string; code?: string }> {
        const plan = getPlanBySlug(planSlug);
        const stripePriceId = getPlanStripePriceId(planSlug);

        if (!plan || !stripePriceId) {
            return { success: false, message: "Plano não encontrado", code: "NOT_FOUND" };
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (user?.subscriptionStatus === "active") {
            return { success: false, message: "Usuário já possui uma assinatura ativa. Use o portal para alterar o plano.", code: "CONFLICT" };
        }

        const customerId = await this.ensureStripeCustomer(userId, email);

        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            customer: customerId,
            line_items: [{ price: stripePriceId, quantity: 1 }],
            success_url: options?.successUrl ?? `${APP_URL}/obrigado`,
            cancel_url: `${APP_URL}/planos`,
            metadata: { userId, planSlug, type: "subscription" },
            subscription_data: {
                metadata: { userId, planSlug },
            },
        });

        if (!session.url) {
            return { success: false, message: "Erro ao criar sessão de checkout" };
        }

        return { success: true, data: { url: session.url } };
    }

    /**
     * Creates a Stripe Checkout Session for a one-time credit package purchase.
     */
    async createCreditPackageCheckout(
        userId: string,
        email: string,
        packageSlug: string
    ): Promise<{ success: true; data: { url: string } } | { success: false; message: string; code?: string }> {
        const creditPackage = getPackageBySlug(packageSlug);
        const stripePriceId = getPackageStripePriceId(packageSlug);

        if (!creditPackage || !stripePriceId) {
            return { success: false, message: "Pacote de créditos não encontrado", code: "NOT_FOUND" };
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (user?.subscriptionStatus === "canceled") {
            return { success: false, message: "Não é possível comprar créditos avulsos com assinatura cancelada", code: "FORBIDDEN" };
        }

        const customerId = await this.ensureStripeCustomer(userId, email);

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            customer: customerId,
            line_items: [{ price: stripePriceId, quantity: 1 }],
            success_url: `${APP_URL}/obrigado`,
            cancel_url: `${APP_URL}/assinatura/pacotes`,
            metadata: { userId, packageSlug, type: "credit_package", credits: String(creditPackage.credits) },
        });

        if (!session.url) {
            return { success: false, message: "Erro ao criar sessão de checkout" };
        }

        return { success: true, data: { url: session.url } };
    }

    /**
     * Creates a Stripe Customer Portal session for managing subscriptions.
     */
    async createBillingPortalSession(
        userId: string
    ): Promise<{ success: true; data: { url: string } } | { success: false; message: string; code?: string }> {
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user?.gatewayCustomerId) {
            return { success: false, message: "Usuário não possui conta no Stripe", code: "NOT_FOUND" };
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: user.gatewayCustomerId,
            return_url: `${APP_URL}/assinatura`,
        });

        return { success: true, data: { url: session.url } };
    }

    // ==================== HELPERS ====================

    private getSubscriptionIdFromInvoice(invoice: Stripe.Invoice): string | null {
        const sub = invoice.parent?.subscription_details?.subscription;
        if (!sub) return null;
        return typeof sub === "string" ? sub : sub.id;
    }

    private getPriceIdFromInvoice(invoice: Stripe.Invoice): string | null {
        const lineItem = invoice.lines?.data?.[0];
        if (!lineItem) return null;
        const price = lineItem.pricing?.price_details?.price;
        if (!price) return null;
        return typeof price === "string" ? price : price.id;
    }

    private getSubscriptionPeriodEnd(subscription: Stripe.Subscription): Date {
        const firstItem = subscription.items?.data?.[0];
        const periodEnd = firstItem?.current_period_end ?? subscription.cancel_at ?? Math.floor(Date.now() / 1000);
        return new Date(periodEnd * 1000);
    }

    // ==================== WEBHOOK HANDLERS ====================

    async handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
        const metadata = session.metadata;
        if (!metadata?.userId) return;

        const userId = metadata.userId;
        const email = session.customer_details?.email ?? undefined;
        const name = session.customer_details?.name ?? undefined;

        if (metadata.type === "credit_package") {
            const packageSlug = metadata.packageSlug;
            if (!packageSlug) return;

            const creditPackage = getPackageBySlug(packageSlug);
            if (!creditPackage) return;

            await prisma.$transaction([
                prisma.user.update({
                    where: { id: userId },
                    data: {
                        credits: { increment: creditPackage.credits },
                    },
                }),
                prisma.transaction.create({
                    data: {
                        userId,
                        amount: creditPackage.credits,
                        type: "PURCHASE",
                        reference_id: session.id,
                        description: `Compra avulsa: ${creditPackage.name}`,
                        metadata: {
                            packageSlug,
                            credits: creditPackage.credits,
                            priceInCents: creditPackage.priceInCents,
                            stripeSessionId: session.id,
                        },
                    },
                }),
            ]);

            if (email) {
                await sendEmail({
                    to: email,
                    subject: `Compra confirmada: ${creditPackage.name}`,
                    react: PurchaseConfirmation({ name, productName: creditPackage.name, credits: creditPackage.credits, appUrl: APP_URL }),
                });
            }
        } else if (metadata.type === "subscription") {
            const subscriptionId =
                typeof session.subscription === "string"
                    ? session.subscription
                    : session.subscription?.id;

            if (subscriptionId) {
                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        stripeSubscriptionId: subscriptionId,
                        subscriptionStatus: "active",
                        planTier: metadata.planSlug || "starter",
                    },
                });

                const plan = getPlanBySlug(metadata.planSlug || "starter");
                if (email && plan) {
                    await sendEmail({
                        to: email,
                        subject: `Assinatura confirmada: ${plan.name}`,
                        react: PurchaseConfirmation({ name, productName: `plano ${plan.name}`, credits: plan.credits, appUrl: APP_URL }),
                    });
                }
            }
        }
    }

    async handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
        const subscriptionId = this.getSubscriptionIdFromInvoice(invoice);
        if (!subscriptionId) return;

        const user = await prisma.user.findFirst({
            where: { stripeSubscriptionId: subscriptionId },
        });
        if (!user) return;

        const priceId = this.getPriceIdFromInvoice(invoice);
        if (!priceId) return;

        const plan = getPlanByStripePriceId(priceId);
        if (!plan) return;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const currentPeriodEnd = this.getSubscriptionPeriodEnd(subscription);

        await prisma.$transaction([
            prisma.user.update({
                where: { id: user.id },
                data: {
                    credits: plan.credits,
                    planTier: plan.slug,
                    subscriptionStatus: "active",
                    currentPeriodEnd,
                },
            }),
            prisma.transaction.create({
                data: {
                    userId: user.id,
                    amount: plan.credits,
                    type: "SUBSCRIPTION_CREDIT",
                    reference_id: invoice.id || subscriptionId,
                    description: `Renovação mensal: ${plan.name} — ${plan.credits} créditos`,
                    metadata: {
                        planSlug: plan.slug,
                        planCredits: plan.credits,
                        invoiceId: invoice.id,
                        previousBalance: user.credits,
                    },
                },
            }),
        ]);
    }

    async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
        const subscriptionId = this.getSubscriptionIdFromInvoice(invoice);
        if (!subscriptionId) return;

        await prisma.user.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: { subscriptionStatus: "past_due" },
        });
    }

    async handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
        const user = await prisma.user.findFirst({
            where: { stripeSubscriptionId: subscription.id },
        });
        if (!user) return;

        const newPriceId = subscription.items.data[0]?.price?.id;
        if (!newPriceId) return;

        const newPlan = getPlanByStripePriceId(newPriceId);
        if (!newPlan) return;

        const oldPlan = getPlanBySlug(user.planTier);

        const currentPeriodEnd = this.getSubscriptionPeriodEnd(subscription);
        const subscriptionStatus = subscription.status;

        if (oldPlan && newPlan.slug !== oldPlan.slug) {
            const creditDifference = newPlan.credits - oldPlan.credits;

            await prisma.$transaction([
                prisma.user.update({
                    where: { id: user.id },
                    data: {
                        planTier: newPlan.slug,
                        subscriptionStatus,
                        currentPeriodEnd,
                        ...(creditDifference > 0 ? { credits: { increment: creditDifference } } : {}),
                    },
                }),
                ...(creditDifference !== 0
                    ? [
                          prisma.transaction.create({
                              data: {
                                  userId: user.id,
                                  amount: creditDifference,
                                  type: "BONUS",
                                  reference_id: subscription.id,
                                  description: `Mudança de plano: ${oldPlan.name} → ${newPlan.name} (${creditDifference > 0 ? "+" : ""}${creditDifference} créditos)`,
                                  metadata: {
                                      oldPlan: oldPlan.slug,
                                      newPlan: newPlan.slug,
                                      creditDifference,
                                  },
                              },
                          }),
                      ]
                    : []),
            ]);
        } else {
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    planTier: newPlan.slug,
                    subscriptionStatus,
                    currentPeriodEnd,
                },
            });
        }
    }

    async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
        const user = await prisma.user.findFirst({
            where: { stripeSubscriptionId: subscription.id },
        });
        if (!user) return;

        const currentPeriodEnd = this.getSubscriptionPeriodEnd(subscription);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                subscriptionStatus: "canceled",
                currentPeriodEnd,
            },
        });
    }
}

export const stripeService = new StripeService();
