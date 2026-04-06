import { useEffect } from "react";
import type { ElectronAPI } from "../../shared/runner-types";
import { campaignStore } from "../stores/campaign-store";
import { settingsStore } from "../stores/settings-store";

export function useRunnerBootstrap(electron: ElectronAPI) {
    useEffect(() => {
        let isMounted = true;

        async function hydrateRunner() {
            try {
                const [campaignList, accountState, authState, settings, engine] = await Promise.all([
                    electron.campaigns.list(),
                    electron.accounts.get(),
                    electron.auth.getState(),
                    electron.settings.get(),
                    electron.engine.getStatus(),
                ]);

                if (!isMounted) {
                    return;
                }

                campaignStore.hydrateCampaigns(campaignList);
                settingsStore.hydrate({
                    account: accountState,
                    auth: authState,
                    settings,
                    engineStatus: engine,
                });
            } catch (error) {
                console.error("Failed to hydrate runner:", error);
                campaignStore.setLoading(false);
            }
        }

        void hydrateRunner();

        const unsubscribe = electron.engine.subscribe((status) => {
            settingsStore.setEngineStatus(status);
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, [electron]);
}
