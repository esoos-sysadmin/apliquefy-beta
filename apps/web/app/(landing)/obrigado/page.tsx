import { CheckCircle2, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ObrigadoPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B111A] px-4">
            <div className="flex w-full max-w-lg flex-col items-center gap-6 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
                    <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Pagamento confirmado!
                    </h1>
                    <p className="text-base text-slate-400">
                        Sua assinatura foi ativada com sucesso. Seus créditos já estão disponíveis.
                    </p>
                </div>

                <div className="w-full rounded-2xl border border-[#1C2333] bg-[#0F1520] p-6 text-left">
                    <h2 className="text-sm font-medium uppercase tracking-wider text-slate-500">
                        Próximos passos
                    </h2>
                    <ul className="mt-4 space-y-3">
                        <li className="flex items-start gap-3 text-sm text-slate-300">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-xs font-bold text-blue-400">
                                1
                            </span>
                            Baixe o Desktop App para automatizar suas candidaturas
                        </li>
                        <li className="flex items-start gap-3 text-sm text-slate-300">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-xs font-bold text-blue-400">
                                2
                            </span>
                            Crie seu currículo na plataforma
                        </li>
                        <li className="flex items-start gap-3 text-sm text-slate-300">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-xs font-bold text-blue-400">
                                3
                            </span>
                            Configure sua primeira campanha e comece a enviar
                        </li>
                    </ul>
                </div>

                <Link
                    href="/desktop?tab=como-funciona"
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-6 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(37,99,235,0.3)] transition hover:bg-[#1d4ed8]"
                >
                    Acessar plataforma
                    <ArrowRight size={15} />
                </Link>

                <p className="text-xs text-slate-600">
                    Um recibo foi enviado para o seu email.
                </p>
            </div>
        </div>
    )
}
