"use client";

import Link from "next/link";
import { UserAvatar } from "@clerk/nextjs";
import { useSessionUser } from "../../lib/auth/client/clerk";

export function SidebarSession() {
    const { user } = useSessionUser();

    return (
        <div style={{ paddingTop: 16, borderTop: "1px solid #1C2333" }}>
            <Link
                href="/conta"
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 8px",
                    borderRadius: 10,
                    cursor: "pointer",
                    textDecoration: "none",
                    transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "#121A28";
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                }}
            >
                <div
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 999,
                        overflow: "hidden",
                        flexShrink: 0,
                        border: "1px solid #243049",
                    }}
                >
                    <UserAvatar
                        appearance={{
                            elements: {
                                avatarBox: {
                                    width: "100%",
                                    height: "100%",
                                },
                            },
                        }}
                    />
                </div>

                <div style={{ minWidth: 0 }}>
                    <p
                        style={{
                            margin: 0,
                            color: "#F3F4F6",
                            fontSize: 13,
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {user?.fullName || user?.firstName || "Minha sessão"}
                    </p>
                    <p
                        style={{
                            margin: 0,
                            marginTop: 2,
                            color: "#7D8590",
                            fontSize: 11,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {user?.primaryEmailAddress?.emailAddress || "Conta autenticada"}
                    </p>
                </div>
            </Link>
        </div>
    );
}
