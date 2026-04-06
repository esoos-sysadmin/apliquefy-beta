"use client";

import { SWRConfig } from "swr";
import { ToastProvider } from "../../lib/toast";

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <SWRConfig
            value={{
                revalidateOnFocus: false,
                shouldRetryOnError: false,
            }}
        >
            <ToastProvider>{children}</ToastProvider>
        </SWRConfig>
    );
}
