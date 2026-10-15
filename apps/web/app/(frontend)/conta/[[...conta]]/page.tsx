"use client";

import { UserProfile, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

// Cores base vêm do ClerkProvider (tema claro/escuro); aqui só o layout de página inteira.
const profileAppearance = {
    elements: {
        rootBox: {
            width: "100%",
        },
        card: {
            width: "100%",
            maxWidth: "100%",
            background: "rgb(var(--c-surface))",
            border: "1px solid rgb(var(--c-line))",
            boxShadow: "0 18px 50px rgba(20, 18, 28, 0.08)",
        },
        navbar: {
            background: "rgb(var(--c-sunken))",
            borderRight: "1px solid rgb(var(--c-line))",
        },
        navbarButtonActive: {
            background: "rgb(var(--c-accent-soft))",
            color: "rgb(var(--c-accent-text))",
        },
        pageScrollBox: {
            background: "rgb(var(--c-surface))",
        },
        profileSectionTitle: {
            borderBottom: "1px solid rgb(var(--c-line))",
        },
        profileSectionPrimaryButton: {
            color: "rgb(var(--c-accent-text))",
        },
        badge: {
            color: "rgb(var(--c-accent-text))",
            background: "rgb(var(--c-accent-soft))",
        },
        profileSection__danger: {
            display: "none",
        },
    },
} as const;

export default function ContaPage() {
    const { signOut } = useClerk();
    const router = useRouter();

    const handleSignOut = () => {
        void signOut(() => router.push("/login"));
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                    <p style={{ margin: 0, color: "rgb(var(--c-muted))", fontSize: 13 }}>Conta</p>
                    <h1 style={{ margin: "8px 0 0", fontSize: 32, color: "rgb(var(--c-fg))" }}>Minha sessão</h1>
                </div>

                <button
                    type="button"
                    onClick={handleSignOut}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "10px 16px",
                        borderRadius: 10,
                        background: "transparent",
                        border: "1px solid rgb(var(--c-line-strong))",
                        color: "rgb(var(--c-rose-400))",
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: "pointer",
                        marginTop: 8,
                    }}
                >
                    <LogOut size={14} />
                    Sair da conta
                </button>
            </div>

            <UserProfile
                path="/conta"
                routing="path"
                appearance={profileAppearance}
            >
                <UserProfile.Page label="account" />
                <UserProfile.Page label="security" />
            </UserProfile>
        </div>
    );
}
