import { useState } from "react";
import { useElectron } from "../../hooks/use-electron";
import { AuthGate } from "../../components/organisms/AuthGate";
import { CampaignDetails } from "../../components/organisms/CampaignDetails";
import { CampaignList } from "../../components/organisms/CampaignList";
import { GeneralSettings } from "../../components/organisms/GeneralSettings";
import { AccountCard } from "../../components/molecules/AccountCard";
import { ConnectAccounts } from "../../components/molecules/ConnectAccounts";
import { SessionRequiredModal } from "../../components/molecules/SessionRequiredModal";
import { RunnerShell } from "../../components/templates/RunnerShell";
import { SettingsTemplate } from "../../components/templates/SettingsTemplate";
import { useRunnerBootstrap } from "../../hooks/use-runner-bootstrap";
import { useCampaignActions } from "../../hooks/use-campaign-actions";
import { useAuthActions } from "../../hooks/use-auth-actions";
import { useSessions } from "../../hooks/use-sessions";
import { useSettingsActions } from "../../hooks/use-settings-actions";
import { campaignStore, useCampaignStore } from "../../stores/campaign-store";
import { useCreditStore } from "../../stores/credit-store";
import { settingsStore, useSettingsStore } from "../../stores/settings-store";
import type { RunnerPlatform } from "../../../shared/runner-types";

export default function RunnerPage() {
    const electron = useElectron();
    const campaigns = useCampaignStore((state) => state.campaigns);
    const activeCampaign = useCampaignStore((state) => state.activeCampaign);
    const isCampaignsLoading = useCampaignStore((state) => state.isLoading);
    const creditBalance = useCreditStore((state) => state.creditBalance);
    const activeTab = useSettingsStore((state) => state.activeTab);
    const auth = useSettingsStore((state) => state.auth);
    const draftSettings = useSettingsStore((state) => state.draftSettings);
    const engineStatus = useSettingsStore((state) => state.engineStatus);
    const isHydrated = useSettingsStore((state) => state.isHydrated);
    const isSaving = useSettingsStore((state) => state.isSaving);
    const isAuthenticating = useSettingsStore((state) => state.isAuthenticating);

    useRunnerBootstrap(electron);
    const { sessions, isValid, capture, capturingPlatform } = useSessions(electron);
    const [sessionModalPlatform, setSessionModalPlatform] = useState<RunnerPlatform | null>(null);
    const { handleToggleCampaign, handleViewCampaign, handleRefreshCampaigns } = useCampaignActions(electron, {
        isSessionValid: isValid,
        onSessionMissing: (platform) => setSessionModalPlatform(platform),
    });
    const { handleSignIn, handleDisconnectAccount } = useAuthActions(electron);
    const { handleToggleSetting, handleSaveSettings } = useSettingsActions(electron);

    const handleClose = () => {
        void electron.window.close();
    };

    const handleConnectAccount = async (platform: RunnerPlatform) => {
        const result = await capture(platform);
        if (result.success) {
            const nextAccount = await electron.accounts.connect(platform);
            settingsStore.setAccount(nextAccount);
        } else {
            console.error(`Session capture failed (${result.code}): ${result.message}`);
        }
    };

    const handleSessionLoginRequest = async (platform: RunnerPlatform) => {
        setSessionModalPlatform(null);
        await handleConnectAccount(platform);
    };

    return (
        <RunnerShell
            activeTab={activeTab}
            engineStatus={engineStatus}
            creditBalance={creditBalance}
            isAuthenticated={auth.isAuthenticated}
            onClose={handleClose}
            onChangeTab={settingsStore.setActiveTab}
            overlay={
                <CampaignDetails
                    campaign={activeCampaign}
                    onClose={campaignStore.closeCampaignDetails}
                />
            }
        >
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
                        engineVersion={engineStatus?.engineVersion}
                        isSessionValid={isValid}
                        onView={handleViewCampaign}
                        onToggleStatus={handleToggleCampaign}
                        onRefresh={handleRefreshCampaigns}
                    />
                ) : activeTab === "settings" ? (
                    <SettingsTemplate
                        isSaving={isSaving}
                        onSave={handleSaveSettings}
                    >
                        <AccountCard auth={auth} onDisconnect={handleDisconnectAccount} />
                        <GeneralSettings
                            settings={draftSettings}
                            onToggle={handleToggleSetting}
                        />
                    </SettingsTemplate>
                ) : (
                    <div className="integration-page">
                        <ConnectAccounts
                            sessions={sessions}
                            capturingPlatform={capturingPlatform}
                            onConnect={handleConnectAccount}
                        />
                    </div>
                )}
            </div>
            <SessionRequiredModal
                open={sessionModalPlatform !== null}
                platform={sessionModalPlatform}
                onClose={() => setSessionModalPlatform(null)}
                onLogin={handleSessionLoginRequest}
            />
        </RunnerShell>
    );
}
