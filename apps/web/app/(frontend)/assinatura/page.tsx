"use client"

import { Coins, Crown, ExternalLink, Package, Sparkles } from "lucide-react"
import { useCredits } from "../../hooks/use-credits"
import { useSubscription } from "../../hooks/use-subscription"
import { CREDIT_PACKAGES, STRIPE_PORTAL_URL, formatBRL } from "../../lib/constants/plans"
import Link from "next/link"

export default function AssinaturaPage() {
    const { balance, isLoading } = useCredits()
    const { purchaseCreditPackage } = useSubscription()

    const credits = balance?.balance ?? 0
    const subscriptionStatus = balance?.subscriptionStatus
    const planName = balance?.plan
        ? balance.plan.charAt(0).toUpperCase() + balance.plan.slice(1)
        : null
    const periodEnd = balance?.currentPeriodEnd
        ? new Date(balance.currentPeriodEnd).toLocaleDateString("pt-BR")
        : null

    const isBlocked = credits <= 0
    const isLow = credits > 0 && credits <= 50
    const hasActivePlan = subscriptionStatus === "active"

    return (
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 text-white">
            {/* Header */}
            <div className="border-b border-[#1C2333] pb-6">
                <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                        <Link href="/dashboard" className="transition-colors hover:text-slate-300">
                            Dashboard
                        </Link>
                        <span>/</span>
                        <span className="text-slate-300">Assinatura</span>
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Assinatura & Créditos
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
                            Gerencie seu plano e acompanhe seus créditos disponíveis.
                        </p>
                    </div>
                </div>
            </div>

            {/* Balance card */}
            <div
                className={`rounded-2xl border p-6 ${
                    isBlocked
                        ? "border-rose-500/20 bg-rose-500/5"
                        : isLow
                          ? "border-amber-500/20 bg-amber-500/5"
                          : "border-emerald-500/20 bg-emerald-500/5"
                }`}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div
                            className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${
                                isBlocked
                                    ? "border-rose-500/20 bg-rose-500/10 text-rose-300"
                                    : isLow
                                      ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
                                      : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                            }`}
                        >
                            <Coins className="h-7 w-7" />
                        </div>
                        <div>
                            <div className="text-4xl font-bold tracking-tight text-white">
                                {isLoading ? "—" : credits.toLocaleString("pt-BR")}
                            </div>
                            <div className="mt-0.5 text-sm text-slate-400">créditos disponíveis</div>
                        </div>
                    </div>

                    <div className="text-right">
                        {planName ? (
                            <div className="flex items-center justify-end gap-1.5 text-sm font-medium text-slate-300">
                                <Crown size={14} className="text-amber-400" />
                                {planName}
                            </div>
                        ) : (
                            <div className="text-sm text-slate-500">Sem plano ativo</div>
                        )}
                        {subscriptionStatus === "active" && periodEnd && (
                            <div className="mt-1 text-xs text-slate-500">Renova em {periodEnd}</div>
                        )}
                        {subscriptionStatus === "canceled" && periodEnd && (
                            <div className="mt-1 text-xs text-rose-400">Cancela em {periodEnd}</div>
                        )}
                        {subscriptionStatus === "past_due" && (
                            <div className="mt-1 text-xs text-rose-400">Pagamento pendente</div>
                        )}
                    </div>
                </div>

                {isBlocked && (
                    <div className="mt-4 rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                        Seus créditos acabaram. Compre créditos avulsos para continuar enviando currículos.
                    </div>
                )}
            </div>

            {/* Manage subscription */}
            <div className="rounded-2xl border border-[#1C2333] bg-[#0F1520] p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-white">Gerenciar assinatura</h2>
                        <p className="mt-1 text-sm text-slate-400">
                            {hasActivePlan
                                ? "Altere seu plano, atualize o método de pagamento ou cancele sua assinatura pelo portal do Stripe."
                                : "Você não possui uma assinatura ativa no momento."}
                        </p>
                    </div>
                    {hasActivePlan && (
                        <a
                            href={STRIPE_PORTAL_URL}
                            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
                        >
                            <ExternalLink size={15} />
                            Abrir portal
                        </a>
                    )}
                </div>
            </div>

            {/* Credit packages */}
            <div>
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-white">Créditos avulsos</h2>
                    <Sparkles size={16} className="text-violet-400" />
                </div>
                <p className="mt-1 text-sm text-slate-400">
                    Precisa de mais créditos? Compre pacotes extras sem alterar seu plano.
                </p>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    {CREDIT_PACKAGES.map((pkg) => {
                        const pricePerCredit = Math.round((pkg.priceInCents / pkg.credits) * 100) / 100

                        return (
                            <div
                                key={pkg.slug}
                                className="rounded-2xl border border-[#1C2333] bg-[#0F1520] p-6 transition hover:border-[#2A3445]"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-300">
                                    <Package size={20} />
                                </div>
                                <h3 className="mt-4 text-xl font-bold text-white">
                                    {pkg.credits.toLocaleString("pt-BR")}
                                </h3>
                                <p className="text-sm text-slate-400">créditos</p>
                                <div className="mt-3 flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-white">
                                        {formatBRL(pkg.priceInCents)}
                                    </span>
                                </div>
                                <p className="mt-1 text-xs text-slate-500">
                                    {formatBRL(pricePerCredit * 100)}/crédito
                                </p>
                                <button
                                    type="button"
                                    onClick={() => purchaseCreditPackage(pkg.slug)}
                                    className="mt-4 w-full rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
                                >
                                    Comprar
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
