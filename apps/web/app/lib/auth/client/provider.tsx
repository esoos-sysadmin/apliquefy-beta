"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { clerkAppearance, useTheme } from "../../theme";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const theme = useTheme();
    return (
        <ClerkProvider
            appearance={clerkAppearance[theme]}
            signInUrl="/login"
            signUpUrl="/cadastro"
            afterSignOutUrl="/login"
        >
            {children}
        </ClerkProvider>
    );
}
