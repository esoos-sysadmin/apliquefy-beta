"use client"

import Link from "next/link"
import { Coins } from "lucide-react"
import { useCredits } from "../../hooks/use-credits"

export function SidebarCredits() {
    const { balance, isLoading } = useCredits()

    const credits = balance?.balance ?? 0
    const isBlocked = credits <= 0 && !isLoading
    const isLow = credits > 0 && credits <= 50 && !isLoading

    const bgColor = isBlocked
        ? "rgba(239, 68, 68, 0.1)"
        : isLow
          ? "rgba(234, 179, 8, 0.1)"
          : "rgba(16, 185, 129, 0.1)"

    const borderColor = isBlocked
        ? "rgba(239, 68, 68, 0.25)"
        : isLow
          ? "rgba(234, 179, 8, 0.25)"
          : "rgba(16, 185, 129, 0.25)"

    const textColor = isBlocked
        ? "#fca5a5"
        : isLow
          ? "#fde047"
          : "#6ee7b7"

    return (
        <Link
            href="/assinatura"
            style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 12px",
                marginTop: 16,
                borderRadius: 10,
                background: isLoading ? "rgba(255,255,255,0.03)" : bgColor,
                border: `1px solid ${isLoading ? "rgba(255,255,255,0.06)" : borderColor}`,
                textDecoration: "none",
                transition: "all 0.2s",
            }}
        >
            <Coins size={16} style={{ color: isLoading ? "#555" : textColor, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
                <div
                    style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: isLoading ? "#555" : textColor,
                        lineHeight: 1,
                    }}
                >
                    {isLoading ? "—" : credits}
                </div>
                <div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>créditos</div>
            </div>
        </Link>
    )
}
