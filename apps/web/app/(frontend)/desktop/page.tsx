"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { DesktopDownloadTab } from "../../components/organisms/DesktopDownloadTab";
import { DesktopHowItWorksTab } from "../../components/organisms/DesktopHowItWorksTab";

type Tab = "download" | "como-funciona";

const tabs: { value: Tab; label: string }[] = [
    { value: "download", label: "Download" },
    { value: "como-funciona", label: "Como funciona" },
];

export default function DesktopPage() {
    const searchParams = useSearchParams();
    const tabParam = searchParams.get("tab") as Tab | null;

    const [activeTab, setActiveTab] = useState<Tab>(
        tabParam === "como-funciona" ? "como-funciona" : "download"
    );

    useEffect(() => {
        if (tabParam === "como-funciona") {
            setActiveTab("como-funciona");
        }
    }, [tabParam]);

    return (
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 text-white">
            <div className="flex flex-col gap-4 border-b border-[#1C2333] pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                        <span>Dashboard</span>
                        <span>/</span>
                        <span className="text-slate-300">Desktop App</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Desktop App</h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
                            Automatize suas candidaturas com o aplicativo Apliquefy rodando no seu computador.
                        </p>
                    </div>
                </div>

                <div className="inline-flex h-9 shrink-0 items-center gap-2 self-start rounded-full border border-amber-500/20 bg-amber-500/10 px-4 text-sm font-semibold text-amber-300">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    Em breve
                </div>
            </div>

            <div className="flex gap-1 rounded-xl border border-[#1C2333] bg-[#0D1420] p-1 sm:w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={`rounded-lg px-5 py-2 text-sm font-semibold transition-colors ${
                            activeTab === tab.value
                                ? "bg-[#1C2B46] text-white shadow"
                                : "text-slate-500 hover:text-slate-300"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === "download" ? <DesktopDownloadTab /> : <DesktopHowItWorksTab />}
        </section>
    );
}
