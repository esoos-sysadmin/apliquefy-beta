export const STRIPE_PORTAL_URL = "https://billing.stripe.com/p/login/test_eVq6ozgL22n22tzf0D0Fi00"

export const PLANS = [
    { slug: "starter", name: "Starter", priceInCents: 4900, credits: 500, tier: 1 },
    { slug: "professional", name: "Professional", priceInCents: 9900, credits: 1500, tier: 2 },
    { slug: "enterprise", name: "Enterprise", priceInCents: 24900, credits: 5000, tier: 3 },
] as const

export const CREDIT_PACKAGES = [
    { slug: "pack_50", name: "50 Créditos", credits: 50, priceInCents: 2000 },
    { slug: "pack_100", name: "100 Créditos", credits: 100, priceInCents: 3500 },
    { slug: "pack_200", name: "200 Créditos", credits: 200, priceInCents: 6000 },
] as const

export type Plan = (typeof PLANS)[number]
export type CreditPackage = (typeof CREDIT_PACKAGES)[number]

export function formatBRL(cents: number): string {
    return `R$${(cents / 100).toFixed(2).replace(".", ",")}`
}

export function getPlanBySlug(slug: string): Plan | null {
    return PLANS.find((p) => p.slug === slug) ?? null
}

export function getPackageBySlug(slug: string): CreditPackage | null {
    return CREDIT_PACKAGES.find((p) => p.slug === slug) ?? null
}

export function getNextPlan(currentSlug: string): Plan | null {
    const current = PLANS.find((p) => p.slug === currentSlug)
    if (!current) return PLANS[0]
    return PLANS.find((p) => p.tier > current.tier) ?? null
}

export function isMaxPlan(slug: string): boolean {
    const plan = PLANS.find((p) => p.slug === slug)
    return plan?.tier === 3
}

// Server-only: reads Stripe Price IDs from env. Do not call from client components.
export function getPlanStripePriceId(slug: string): string | null {
    const map: Record<string, string | undefined> = {
        starter: process.env.STRIPE_PRICE_STARTER,
        professional: process.env.STRIPE_PRICE_PROFESSIONAL,
        enterprise: process.env.STRIPE_PRICE_ENTERPRISE,
    }
    return map[slug] ?? null
}

export function getPackageStripePriceId(slug: string): string | null {
    const map: Record<string, string | undefined> = {
        pack_50: process.env.STRIPE_PRICE_PACK_50,
        pack_100: process.env.STRIPE_PRICE_PACK_100,
        pack_200: process.env.STRIPE_PRICE_PACK_200,
    }
    return map[slug] ?? null
}

export function getPlanByStripePriceId(stripePriceId: string): Plan | null {
    const priceIdToSlug: Record<string, string> = {
        [process.env.STRIPE_PRICE_STARTER ?? ""]: "starter",
        [process.env.STRIPE_PRICE_PROFESSIONAL ?? ""]: "professional",
        [process.env.STRIPE_PRICE_ENTERPRISE ?? ""]: "enterprise",
    }
    const slug = priceIdToSlug[stripePriceId]
    return slug ? getPlanBySlug(slug) : null
}
