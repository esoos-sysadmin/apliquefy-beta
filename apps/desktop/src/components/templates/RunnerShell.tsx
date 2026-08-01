import type { ReactNode } from "react";
import { Minus, Sparkles, X } from "lucide-react";
import type { RunnerCreditBalance, RunnerTab } from "../../../shared/runner-types";
import { TabBar } from "../atoms/TabBar";
import { StatusBar } from "../organisms/StatusBar";
import { LivePreview } from "../organisms/LivePreview";

type RunnerShellProps = {
    activeTab: RunnerTab;
    creditBalance: RunnerCreditBalance | null;
    isAuthenticated: boolean;
    onClose: () => void;
    onMinimize: () => void;
    onChangeTab: (tab: RunnerTab) => void;
    onOpenApollo?: () => void;
    children: ReactNode;
    overlay?: ReactNode;
};

export function RunnerShell({
    activeTab,
    creditBalance,
    isAuthenticated,
    onClose,
    onMinimize,
    onChangeTab,
    onOpenApollo,
    children,
    overlay,
}: RunnerShellProps) {
    // A prévia ao vivo pertence às campanhas; nas outras abas o conteúdo ocupa a janela inteira.
    const showPreview = isAuthenticated && activeTab === "campaigns";

    return (
        <div className="runner-window">
            <header className="titlebar">
                <div className="titlebar__inner">
                    <span className="titlebar__brand">Apliquefy</span>
                    {isAuthenticated ? (
                        <nav className="titlebar__nav">
                            <TabBar activeTab={activeTab} onChange={onChangeTab} />
                            {onOpenApollo ? (
                                <button type="button" className="apollo-return no-drag" onClick={onOpenApollo}>
                                    <Sparkles size={13} /> Apollo
                                </button>
                            ) : null}
                        </nav>
                    ) : null}
                    <div className="titlebar__actions">
                        <button
                            type="button"
                            onClick={onMinimize}
                            aria-label="Minimizar janela do runner"
                            className="titlebar__close no-drag"
                        >
                            <Minus size={18} />
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Fechar janela do runner"
                            className="titlebar__close no-drag"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
            </header>

            <div className={`runner-body${showPreview ? " runner-body--split" : ""}`}>
                <div className="runner-col">
                    <div className="runner-shell">
                        <main className="runner-main">{children}</main>
                    </div>

                    {isAuthenticated ? <StatusBar creditBalance={creditBalance} /> : null}
                </div>

                {showPreview ? (
                    <aside className="runner-preview">
                        <LivePreview />
                    </aside>
                ) : null}
            </div>

            {overlay}
        </div>
    );
}
