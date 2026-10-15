"use client";

import Link from "next/link";
import { UserAvatar } from "@clerk/nextjs";
import { useSessionUser } from "../../lib/auth/client/clerk";

export function SidebarSession() {
    const { user } = useSessionUser();

    return (
        <div style={{ paddingTop: 16, borderTop: "1px solid rgb(var(--c-line))" }}>
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
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgb(var(--c-raised))";
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
                        border: "1px solid rgb(var(--c-line))",
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
                            color: "rgb(var(--c-fg))",
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
                            color: "rgb(var(--c-muted))",
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
