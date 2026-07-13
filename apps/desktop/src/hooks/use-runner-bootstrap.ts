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

        async function refreshCredits() {
            if (!settingsStore.getState().auth.isAuthenticated) {
                return;
            }
            try {
                creditStore.setBalance(await electron.credits.getBalance());
            } catch {
                // Ignore polling errors
            }
        }

        // Saldo em quase tempo real: poll curto + refresh no evento "applied"
        // (é quando o crédito é de fato consumido pelo envio de uma candidatura).
        const pollCredits = setInterval(refreshCredits, 15_000);
        const unsubscribeRpa = electron.rpa.subscribe((event) => {
            if (event.type === "applied" || event.type === "finished") {
                void refreshCredits();
            }
            // "paused" pode ser sessão expirada detectada no run: o main já pausou a
            // campanha/removeu a sessão; re-sincroniza o feed para refletir o PAUSED.
            if (event.type === "paused") {
                electron.campaigns
                    .list()
                    .then(campaignStore.hydrateCampaigns)
                    .catch(() => {});
            }
        });

        return () => {
            isMounted = false;
            unsubscribeRpa();
            clearInterval(pollCredits);
        };
    }, [electron]);
}
