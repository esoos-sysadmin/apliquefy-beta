"use client"

import { X, Zap, Package } from "lucide-react"
import { formatBRL, getNextPlan, isMaxPlan, getPlanBySlug } from "../../lib/constants/plans"
import { useSubscription } from "../../hooks/use-subscription"

interface UpsellModalProps {
    open: boolean
    currentPlanSlug: string
    onClose: () => void
}

export function UpsellModal({ open, currentPlanSlug, onClose }: UpsellModalProps) {
    const { subscribeToPlan } = useSubscription()

    if (!open) return null

    const currentPlan = getPlanBySlug(currentPlanSlug)
    const nextPlan = getNextPlan(currentPlanSlug)
    const isOnMaxPlan = isMaxPlan(currentPlanSlug)

    const handleUpgrade = async () => {
        if (nextPlan) {
            await subscribeToPlan(nextPlan.slug)
        }
    }

    const handleDecline = () => {
        onClose()
        window.location.href = "/assinatura/pacotes"
    }

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#020817]/80 px-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-[24px] border border-[#273247] bg-[#111827] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-300">
                            <Zap className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Seus créditos acabaram!</h2>
                            <p className="text-sm text-slate-400">
                                {currentPlan
                                    ? `Plano atual: ${currentPlan.name} (${currentPlan.credits} créditos/mês)`
                                    : "Você não possui um plano ativo"}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl p-2 text-slate-500 transition hover:bg-[#172033] hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Upgrade offer (if not max plan) */}
                {!isOnMaxPlan && nextPlan && currentPlan && (
                    <div className="mt-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
                        <div className="flex items-center gap-2 text-blue-300">
                            <Zap size={16} />
                            <span className="text-sm font-semibold">Upgrade recomendado</span>
                        </div>
                        <h3 className="mt-2 text-xl font-bold text-white">{nextPlan.name}</h3>
                        <p className="mt-1 text-sm text-slate-300">
                            {nextPlan.credits.toLocaleString("pt-BR")} créditos por mês
                        </p>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-white">
                                {formatBRL(nextPlan.priceInCents - currentPlan.priceInCents)}
                            </span>
                            <span className="text-sm text-slate-400">/mês a mais</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Valor proporcional aplicado como desconto único neste ciclo
                        </p>
                        <button
                            type="button"
                            onClick={handleUpgrade}
                            className="mt-4 w-full rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
                        >
                            Fazer upgrade para {nextPlan.name}
                        </button>
                    </div>
                )}

                {/* Downsell link */}
                <div className="mt-4 flex flex-col items-center gap-3">
                    {isOnMaxPlan && (
                        <p className="text-center text-sm text-slate-400">
                            Você já está no plano máximo. Adquira créditos extras para continuar enviando.
                        </p>
                    )}
                    <button
                        type="button"
                        onClick={handleDecline}
                        className="flex items-center gap-2 rounded-xl border border-[#2A3445] px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-[#3A4A61] hover:text-white"
                    >
                        <Package size={14} />
                        {isOnMaxPlan ? "Comprar créditos avulsos" : "Prefiro comprar créditos avulsos"}
                    </button>
                </div>
            </div>
        </div>
    )
}
