"use client";

import { ClerkProvider } from "@clerk/nextjs";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider
            signInUrl="/login"
            signUpUrl="/cadastro"
            afterSignOutUrl="/login"
        >
            {children}
        </ClerkProvider>
    );
}
