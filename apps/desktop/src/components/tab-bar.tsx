import { Link2, Rocket, Settings2 } from "lucide-react";
import type { RunnerTab } from "../../shared/runner-types";

type TabBarProps = {
    activeTab: RunnerTab;
    onChange: (tab: RunnerTab) => void;
};

export function TabBar({ activeTab, onChange }: TabBarProps) {
    return (
        <nav className="tab-bar">
            <button
                type="button"
                onClick={() => onChange("campaigns")}
                className={`tab-bar__button no-drag ${activeTab === "campaigns" ? "tab-bar__button--active" : ""}`}
            >
                <Rocket size={14} />
                Campaigns
            </button>
            <button
                type="button"
                onClick={() => onChange("settings")}
                className={`tab-bar__button no-drag ${activeTab === "settings" ? "tab-bar__button--active" : ""}`}
            >
                <Settings2 size={14} />
                Settings
            </button>
            <button
                type="button"
                onClick={() => onChange("integration")}
                className={`tab-bar__button no-drag ${activeTab === "integration" ? "tab-bar__button--active" : ""}`}
            >
                <Link2 size={14} />
                Integração
            </button>
        </nav>
    );
}
