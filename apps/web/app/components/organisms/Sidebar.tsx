"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { SidebarLogo } from "../molecules/SidebarLogo";
import { SidebarNav } from "../molecules/SidebarNav";
import { SidebarCredits } from "../molecules/SidebarCredits";
import { SidebarSession } from "../molecules/SidebarSession";
import { ThemeToggle } from "../atoms/ThemeToggle";
import { PushToggle } from "../atoms/PushToggle";

// Fixa no desktop (lg+); no celular vira gaveta aberta pela barra do topo (§6.4, 375 px).
export function Sidebar() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    useEffect(() => setOpen(false), [pathname]);

    return (
        <>
            <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-surface px-4 lg:hidden">
                <SidebarLogo compact />
                <button type="button" aria-label="Abrir menu" onClick={() => setOpen(true)} className="rounded-lg p-2 text-fg hover:bg-sunken">
                    <Menu size={20} />
                </button>
            </header>
            {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} aria-hidden />}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col justify-between overflow-y-auto border-r border-line bg-surface px-4 py-6 transition-transform lg:translate-x-0 ${
                    open ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div>
                    <div className="flex items-start justify-between">
                        <SidebarLogo />
                        <button type="button" aria-label="Fechar menu" onClick={() => setOpen(false)} className="rounded-lg p-2 text-fg hover:bg-sunken lg:hidden">
                            <X size={18} />
                        </button>
                    </div>
                    <SidebarNav />
                    <SidebarCredits />
                </div>
                <div>
                    <PushToggle />
                    <ThemeToggle />
                    <SidebarSession />
                </div>
            </aside>
        </>
    );
}
