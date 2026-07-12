"use client"

import { ArrowLeft, Package, Sparkles } from "lucide-react"
import { CREDIT_PACKAGES, formatBRL } from "../../../lib/constants/plans"
import { useSubscription } from "../../../hooks/use-subscription"
import { useCredits } from "../../../hooks/use-credits"
import Link from "next/link"

export default function PacotesPage() {
    const { purchaseCreditPackage } = useSubscription()
    const { balance } = useCredits()

    const credits = balance?.balance ?? 0
    const isBlocked = credits <= 0

    return (
        <div>
            <Link
                href="/assinatura"
                className="mb-4 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
            >
                <ArrowLeft size={14} />
                Voltar para Assinatura
            </Link>

            <h1 className="text-2xl font-bold text-white">Créditos Avulsos</h1>
            <p className="mt-1 text-sm text-slate-400">
                Compre pacotes de créditos extras para continuar enviando currículos.
                Créditos avulsos expiram no fim do ciclo atual.
            </p>

            {isBlocked && (
                <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-200">
                    <div className="flex items-center gap-2">
                        <Sparkles size={14} />
                        Seus créditos acabaram. Escolha um pacote para continuar.
                    </div>
                </div>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {CREDIT_PACKAGES.map((pkg) => (
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
                            {formatBRL(Math.round(pkg.priceInCents / pkg.credits * 100) / 100 * 100)}/crédito
                        </p>
                        <button
                            type="button"
                            onClick={() => purchaseCreditPackage(pkg.slug)}
                            className="mt-4 w-full rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
                        >
                            Comprar
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
