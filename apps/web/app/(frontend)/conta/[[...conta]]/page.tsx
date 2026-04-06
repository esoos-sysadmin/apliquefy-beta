"use client";

import { UserProfile, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

const profileAppearance = {
    variables: {
        colorBackground: "#152234",
        colorText: "#F1F5F9",
        colorTextSecondary: "#94A3B8",
        colorInputBackground: "#0F172A",
        colorInputText: "#F1F5F9",
        colorPrimary: "#2563EB",
        colorNeutral: "#CBD5E1",
        colorShimmer: "#1E2D45",
        borderRadius: "10px",
        fontFamily: "inherit",
    },
    elements: {
        rootBox: {
            width: "100%",
        },
        card: {
            width: "100%",
            maxWidth: "100%",
            background: "#152234",
            border: "1px solid #243049",
            boxShadow: "0 18px 50px rgba(0, 0, 0, 0.3)",
        },
        navbar: {
            background: "#0F172A",
            borderRight: "1px solid #1E2D45",
        },
        navbarButton: {
            color: "#CBD5E1",
        },
        navbarButtonActive: {
            background: "#1D3A6B",
            color: "#FFFFFF",
        },
        pageScrollBox: {
            background: "#152234",
        },
        profileSectionTitle: {
            borderBottom: "1px solid #1E2D45",
        },
        profileSectionPrimaryButton: {
            color: "#93C5FD",
        },
        formFieldInput: {
            background: "#0F172A",
            border: "1px solid #243049",
            color: "#F1F5F9",
        },
        formButtonPrimary: {
            background: "#2563EB",
            color: "#FFFFFF",
        },
        formButtonReset: {
            color: "#94A3B8",
        },
        badge: {
            color: "#93C5FD",
            background: "#1E3A5F",
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
                    <p style={{ margin: 0, color: "#64748B", fontSize: 13 }}>Conta</p>
                    <h1 style={{ margin: "8px 0 0", fontSize: 32, color: "#F8FAFC" }}>Minha sessão</h1>
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
                        border: "1px solid #3B4F6B",
                        color: "#F87171",
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
