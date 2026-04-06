import Link from "next/link";
import { desktopSteps } from "../../lib/constants/desktop-steps";

export function DesktopHowItWorksTab() {
    return (
        <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-[#1C2333] bg-[#131B2A] p-6">
                <h2 className="mb-2 text-lg font-bold text-white">Como o Apliquefy funciona</h2>
                <p className="text-sm leading-relaxed text-slate-400">
                    O Apliquefy é dividido em dois ambientes: o{" "}
                    <span className="font-medium text-slate-200">painel web</span> — onde você configura campanhas e currículos — e o{" "}
                    <span className="font-medium text-slate-200">app desktop</span> — que executa as candidaturas automaticamente no seu computador. Os dois se comunicam em tempo real.
                </p>
            </div>

            <div className="flex flex-col gap-3">
                {desktopSteps.map((step, index) => (
                    <div
                        key={step.number}
                        className="flex gap-5 rounded-2xl border border-[#1C2333] bg-[#131B2A] p-6 transition-colors hover:border-[#283349]"
                    >
                        <div className="flex flex-col items-center">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-blue-500/20 bg-[#1C2B46] text-sm font-bold text-blue-400">
                                {step.number}
                            </div>
                            {index < desktopSteps.length - 1 && (
                                <div className="mt-3 w-px flex-1 bg-[#1C2333]" />
                            )}
                        </div>

                        <div className="pb-2">
                            <p className="font-semibold text-white">{step.title}</p>
                            <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#1C2333] bg-[radial-gradient(circle_at_top,#1d2a42,transparent_60%),linear-gradient(180deg,#131B2A_0%,#0D1420_100%)] py-10 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                </div>
                <p className="text-lg font-bold text-white">Pronto para automatizar?</p>
                <p className="max-w-sm text-sm text-slate-400">
                    Configure sua primeira campanha no painel enquanto o app desktop não é lançado. Assim que estiver disponível, é só baixar e ativar.
                </p>
                <Link
                    href="/campanhas/nova"
                    className="mt-2 inline-flex h-11 items-center gap-2 rounded-xl bg-[#2563EB] px-6 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.28)] transition hover:bg-[#1d4ed8]"
                >
                    Criar primeira campanha
                </Link>
            </div>
        </div>
    );
}
