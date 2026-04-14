"use client";

import { SWRConfig } from "swr";
import { ToastProvider } from "../../lib/toast";
import { CreditGateProvider } from "./CreditGateProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
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
    );
}
