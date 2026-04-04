import { useEffect } from "react";
import type { RunnerCampaign, RunnerSettings } from "../shared/runner-types";
import { useElectron } from "./hooks/use-electron";
import { AuthGate } from "./components/auth/auth-gate";
import { CampaignDetails } from "./components/campaigns/campaign-details";
import { CampaignList } from "./components/campaigns/campaign-list";
import { AccountCard } from "./components/settings/account-card";
import { ConnectAccounts } from "./components/settings/connect-accounts";
import { GeneralSettings } from "./components/settings/general-settings";
import { TitleBar } from "./components/titlebar";
import { TabBar } from "./components/tab-bar";
import { GradientButton } from "./components/ui/gradient-button";
import { StatusBar } from "./components/ui/status-bar";
import { campaignStore, useCampaignStore } from "./stores/campaign-store";
import { settingsStore, useSettingsStore } from "./stores/settings-store";

export default function App() {
    const electron = useElectron();
    const campaigns = useCampaignStore((state) => state.campaigns);
    const activeCampaign = useCampaignStore((state) => state.activeCampaign);
    const isCampaignsLoading = useCampaignStore((state) => state.isLoading);
    const activeTab = useSettingsStore((state) => state.activeTab);
    const auth = useSettingsStore((state) => state.auth);
    const draftSettings = useSettingsStore((state) => state.draftSettings);
    const engineStatus = useSettingsStore((state) => state.engineStatus);
    const isHydrated = useSettingsStore((state) => state.isHydrated);
    const isSaving = useSettingsStore((state) => state.isSaving);
    const isAuthenticating = useSettingsStore((state) => state.isAuthenticating);

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

    const handleClose = () => {
        void electron.window.close();
    };

    const handleToggleCampaign = async (campaign: RunnerCampaign) => {
        const nextCampaigns =
            campaign.status === "active"
                ? await electron.campaigns.pause(campaign.id)
                : await electron.campaigns.resume(campaign.id);

        campaignStore.replaceCampaigns(nextCampaigns);
    };

    const handleConnectAccount = async (platform: "linkedin" | "infojobs") => {
        const nextAccount = await electron.accounts.connect(platform);
        settingsStore.setAccount(nextAccount);
    };

    const handleSignIn = async () => {
        settingsStore.startAuthenticating();

        try {
            const nextAuth = await electron.auth.signIn();
            settingsStore.setAuth(nextAuth);
        } catch (error) {
            console.error("Failed to sign in through Clerk:", error);
        } finally {
            settingsStore.stopAuthenticating();
        }
    };

    const handleDisconnectAccount = async () => {
        const nextAuth = await electron.auth.signOut();
        settingsStore.setAuth(nextAuth);
        settingsStore.setActiveTab("settings");
    };

    const handleToggleSetting = (key: keyof RunnerSettings, value: boolean) => {
        settingsStore.setDraftSetting(key, value);

        if (key === "alwaysOnTop") {
            void electron.settings
                .save({ alwaysOnTop: value })
                .then(() => {
                    settingsStore.syncImmediateSetting("alwaysOnTop", value);
                })
                .catch((error) => {
                    console.error("Failed to toggle always on top:", error);
                });
        }
    };

    const handleSaveSettings = async () => {
        settingsStore.startSaving();

        try {
            const { draftSettings: currentSettings } = settingsStore.getState();
            const savedSettings = await electron.settings.save(currentSettings);
            settingsStore.finishSaving(savedSettings);
        } catch (error) {
            console.error("Failed to save runner settings:", error);
            settingsStore.stopSaving();
        }
    };

    return (
        <div className="runner-window">
            <TitleBar onClose={handleClose} />

            <div className="runner-shell">
                {auth.isAuthenticated ? (
                    <div className="runner-shell__top">
                        <TabBar activeTab={activeTab} onChange={settingsStore.setActiveTab} />
                    </div>
                ) : null}

                <main className="runner-main">
                    <div key={activeTab} className="runner-panel runner-panel--animate">
                        {!isHydrated ? (
                            <div className="loading-state">
                                <p className="loading-state__label">Initializing local runner...</p>
                            </div>
                        ) : !auth.isAuthenticated ? (
                            <AuthGate
                                isAuthenticating={isAuthenticating}
                                onSignIn={handleSignIn}
                            />
                        ) : activeTab === "campaigns" ? (
                            <CampaignList
                                campaigns={campaigns}
                                isLoading={isCampaignsLoading}
                                engineVersion={engineStatus?.engineVersion ?? "LOCAL ENGINE V1.0.4"}
                                onView={campaignStore.openCampaignDetails}
                                onToggleStatus={handleToggleCampaign}
                            />
                        ) : activeTab === "settings" ? (
                            <div className="settings-page">
                                <div className="settings-page__content">
                                    <AccountCard auth={auth} onDisconnect={handleDisconnectAccount} />
                                    <GeneralSettings
                                        settings={draftSettings}
                                        onToggle={handleToggleSetting}
                                    />
                                </div>

                                <div className="settings-page__footer">
                                    <GradientButton
                                        fullWidth
                                        onClick={handleSaveSettings}
                                        disabled={isSaving}
                                    >
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </GradientButton>
                                </div>
                            </div>
                        ) : (
                            <div className="integration-page">
                                <ConnectAccounts onConnect={handleConnectAccount} />
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <StatusBar status={engineStatus} />

            <CampaignDetails
                campaign={activeCampaign}
                onClose={campaignStore.closeCampaignDetails}
            />
        </div>
    );
}
