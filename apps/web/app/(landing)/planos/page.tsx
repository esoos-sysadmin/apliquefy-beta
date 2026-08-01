import Link from "next/link"
import { Check, Zap } from "lucide-react"
import { PLANS, formatBRL } from "../../lib/constants/plans"

export default function PlanosPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-20">
            {/* Header */}
            <div className="mb-12 text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-300">
                    <Zap size={13} className="fill-blue-400 text-blue-400" />
                    Automatize suas candidaturas
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                    Escolha seu plano
                </h1>
                <p className="mt-4 max-w-xl text-base text-slate-400">
                    Comece a enviar currículos automaticamente no LinkedIn e InfoJobs.
                    Pague mensalmente e cancele quando quiser.
                </p>
            </div>

            {/* Plans grid */}
            <div className="grid w-full max-w-4xl gap-5 sm:grid-cols-3">
                {PLANS.map((plan, index) => {
                    const isHighlighted = index === 1

                    return (
                        <div
                            key={plan.slug}
                            className={`relative flex flex-col rounded-2xl border p-6 transition ${
                                isHighlighted
                                    ? "border-blue-500/40 bg-blue-500/5 ring-1 ring-blue-500/20"
                                    : "border-[#1C2333] bg-[#0F1520]"
                            }`}
                        >
                            {isHighlighted && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-0.5 text-xs font-semibold text-white">
                                    Mais popular
                                </div>
                            )}

                            <div className="flex-1">
                                <h2 className="text-lg font-semibold text-white">{plan.name}</h2>

                                <div className="mt-3 flex items-baseline gap-1">
                                    <span className="text-3xl font-bold text-white">
                                        {formatBRL(plan.priceInCents)}
                                    </span>
                                    <span className="text-sm text-slate-500">/mês</span>
                                </div>

                                <ul className="mt-5 space-y-2.5">
                                    <li className="flex items-center gap-2 text-sm text-slate-300">
                                        <Check size={15} className="shrink-0 text-emerald-400" />
                                        {plan.credits.toLocaleString("pt-BR")} créditos por mês
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-slate-300">
                                        <Check size={15} className="shrink-0 text-emerald-400" />
                                        LinkedIn Easy Apply
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-slate-300">
                                        <Check size={15} className="shrink-0 text-emerald-400" />
                                        InfoJobs automático
                                    </li>
                                    {index >= 1 && (
                                        <li className="flex items-center gap-2 text-sm text-slate-300">
                                            <Check size={15} className="shrink-0 text-emerald-400" />
                                            Múltiplas campanhas
                                        </li>
                                    )}
                                    {index >= 2 && (
                                        <li className="flex items-center gap-2 text-sm text-slate-300">
                                            <Check size={15} className="shrink-0 text-emerald-400" />
                                            Suporte prioritário
                                        </li>
                                    )}
                                </ul>
                            </div>

                            <Link
                                href={`/cadastro?plan=${plan.slug}`}
                                className={`mt-6 flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition ${
                                    isHighlighted
                                        ? "bg-[#2563EB] text-white shadow-[0_8px_24px_rgba(37,99,235,0.3)] hover:bg-[#1d4ed8]"
                                        : "border border-[#2A3445] text-slate-300 hover:border-[#3A4A61] hover:text-white"
                                }`}
                            >
                                Começar com {plan.name}
                            </Link>
                        </div>
                    )
                })}
            </div>

            {/* Footer note */}
            <p className="mt-10 text-center text-xs text-slate-600">
                Pagamento seguro via Stripe · Cancele quando quiser · Sem taxas ocultas
            </p>
        </div>
    )
}
