import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import type { RunnerCreditBalance, RunnerTab } from "../../../shared/runner-types";
import { TabBar } from "../atoms/TabBar";
import { TitleBar } from "../atoms/TitleBar";
import { StatusBar } from "../organisms/StatusBar";
import { LivePreview } from "../organisms/LivePreview";

type RunnerShellProps = {
    activeTab: RunnerTab;
    creditBalance: RunnerCreditBalance | null;
    isAuthenticated: boolean;
    onClose: () => void;
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
    onChangeTab,
    onOpenApollo,
    children,
    overlay,
}: RunnerShellProps) {
    return (
        <div className="runner-window">
            <TitleBar onClose={onClose} />

            <div className={`runner-body${isAuthenticated ? " runner-body--split" : ""}`}>
                <div className="runner-col">
                    <div className="runner-shell">
                        {isAuthenticated ? (
                            <div className="runner-shell__top runner-shell__top--row">
                                <TabBar activeTab={activeTab} onChange={onChangeTab} />
                                {onOpenApollo ? (
                                    <button type="button" className="apollo-return no-drag" onClick={onOpenApollo}>
                                        <Sparkles size={13} /> Apollo
                                    </button>
                                ) : null}
                            </div>
                        ) : null}

                        <main className="runner-main">{children}</main>
                    </div>

                    {isAuthenticated ? <StatusBar creditBalance={creditBalance} /> : null}
                </div>

                {isAuthenticated ? (
                    <aside className="runner-preview">
                        <LivePreview />
                    </aside>
                ) : null}
            </div>

            {overlay}
        </div>
    );
}
