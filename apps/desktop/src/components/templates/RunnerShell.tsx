import type { ReactNode } from "react";
import type { RunnerEngineStatus, RunnerTab } from "../../../shared/runner-types";
import { TabBar } from "../atoms/TabBar";
import { TitleBar } from "../atoms/TitleBar";
import { StatusBar } from "../organisms/StatusBar";

type RunnerShellProps = {
    activeTab: RunnerTab;
    engineStatus: RunnerEngineStatus | null;
    isAuthenticated: boolean;
    onClose: () => void;
    onChangeTab: (tab: RunnerTab) => void;
    children: ReactNode;
    overlay?: ReactNode;
};

export function RunnerShell({
    activeTab,
    engineStatus,
    isAuthenticated,
    onClose,
    onChangeTab,
    children,
    overlay,
}: RunnerShellProps) {
    return (
        <div className="runner-window">
            <TitleBar onClose={onClose} />

            <div className="runner-shell">
                {isAuthenticated ? (
                    <div className="runner-shell__top">
                        <TabBar activeTab={activeTab} onChange={onChangeTab} />
                    </div>
                ) : null}

                <main className="runner-main">{children}</main>
            </div>

            <StatusBar status={engineStatus} />
            {overlay}
        </div>
    );
}
