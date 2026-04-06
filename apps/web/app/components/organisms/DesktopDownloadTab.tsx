import { desktopPlatforms } from "../../lib/constants/desktop-platforms";

export function DesktopDownloadTab() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>
                <div>
                    <p className="font-semibold text-blue-300">Aplicativo em desenvolvimento</p>
                    <p className="mt-1 text-sm text-slate-400">
                        O Apliquefy Desktop ainda está sendo desenvolvido. Assim que a primeira versão for lançada, você receberá uma notificação e os botões de download serão ativados automaticamente.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {desktopPlatforms.map((platform) => (
                    <div
                        key={platform.name}
                        className="flex flex-col gap-5 rounded-2xl border border-[#1C2333] bg-[#131B2A] p-6 transition-colors hover:border-[#283349]"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#2A3445] bg-[#101826] text-slate-400">
                                {platform.icon}
                            </div>
                            <div>
                                <p className="text-base font-semibold text-white">{platform.name}</p>
                                <p className="text-xs text-slate-500">{platform.version}</p>
                            </div>
                        </div>

                        <p className="text-xs text-slate-500">{platform.requirement}</p>

                        <button
                            disabled
                            className="mt-auto flex h-10 items-center justify-center gap-2 rounded-xl border border-[#2A3445] bg-[#101826] text-sm font-semibold text-slate-600 cursor-not-allowed opacity-50"
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            Em breve
                        </button>
                    </div>
                ))}
            </div>

            <div className="rounded-2xl border border-[#1C2333] bg-[#131B2A] p-6">
                <h2 className="mb-4 text-base font-bold text-white">Requisitos do sistema</h2>
                <div className="grid gap-4 text-sm text-slate-400 sm:grid-cols-3">
                    {desktopPlatforms.map((platform) => (
                        <div key={platform.name}>
                            <p className="mb-1 font-semibold text-slate-300">{platform.name}</p>
                            <ul className="space-y-1 text-slate-500">
                                {platform.systemRequirements.map((req) => (
                                    <li key={req}>{req}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
