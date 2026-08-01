"use client";

import { SWRConfig } from "swr";
import { FeaturebaseProvider } from "featurebase-js/react";
import { ToastProvider } from "../../lib/toast";
import { CreditGateProvider } from "./CreditGateProvider";

// Phase 1: boot anônimo. Os módulos ligados no dashboard (General → Manage modules)
// sobem sozinhos. Identidade via JWT é aditiva (Phase 3), quando for a hora.
const FEATUREBASE_APP_ID = "6a5fc564e2655b0239a6a7e5";

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <FeaturebaseProvider appId={FEATUREBASE_APP_ID}>
            <SWRConfig
                value={{
                    revalidateOnFocus: false,
                    shouldRetryOnError: false,
                }}
            >
                <ToastProvider>
                    <CreditGateProvider>{children}</CreditGateProvider>
                </ToastProvider>
            </SWRConfig>
        </FeaturebaseProvider>
    );
}
