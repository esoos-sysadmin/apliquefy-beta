import { useEffect } from "react";
import type { ElectronAPI } from "../../shared/runner-types";
import { campaignStore } from "../stores/campaign-store";
import { creditStore } from "../stores/credit-store";
import { settingsStore } from "../stores/settings-store";

export function useRunnerBootstrap(electron: ElectronAPI) {
    useEffect(() => {
        let isMounted = true;

        async function hydrateRunner() {
            try {
                const [campaignList, accountState, authState, settings, engine, creditBalance] =
                    await Promise.all([
                        electron.campaigns.list(),
                        electron.accounts.get(),
                        electron.auth.getState(),
                        electron.settings.get(),
                        electron.engine.getStatus(),
                        electron.credits.getBalance(),
                    ]);

                if (!isMounted) {
                    return;
                }

                campaignStore.hydrateCampaigns(campaignList);
                creditStore.hydrate(creditBalance);
                settingsStore.hydrate({
                    account: accountState,
                    auth: authState,
                    settings,
                    engineStatus: engine,
                });
            } catch (error) {
                console.error("Failed to hydrate runner:", error);
                campaignStore.setLoading(false);
                creditStore.setLoading(false);
            }
        }

        void hydrateRunner();

        const unsubscribe = electron.engine.subscribe((status) => {
            settingsStore.setEngineStatus(status);
        });

        // Poll credit balance every 60s when authenticated
        const pollCredits = setInterval(async () => {
            if (settingsStore.getState().auth.isAuthenticated) {
                try {
                    const balance = await electron.credits.getBalance();
                    creditStore.setBalance(balance);
                } catch {
                    // Ignore polling errors
                }
            }
        }, 60_000);

        return () => {
            isMounted = false;
            unsubscribe();
            clearInterval(pollCredits);
        };
    }, [electron]);
}
