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
        ? "rgb(var(--c-red-500) / 0.1)"
        : isLow
          ? "rgb(var(--c-yellow-500) / 0.1)"
          : "rgb(var(--c-emerald-500) / 0.1)"

    const borderColor = isBlocked
        ? "rgb(var(--c-red-500) / 0.25)"
        : isLow
          ? "rgb(var(--c-yellow-500) / 0.25)"
          : "rgb(var(--c-emerald-500) / 0.25)"

    const textColor = isBlocked
        ? "rgb(var(--c-rose-300))"
        : isLow
          ? "rgb(var(--c-yellow-300))"
          : "rgb(var(--c-emerald-300))"

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
                background: isLoading ? "rgb(var(--c-fg) / 0.03)" : bgColor,
                border: `1px solid ${isLoading ? "rgb(var(--c-fg) / 0.06)" : borderColor}`,
                textDecoration: "none",
                transition: "all 0.2s",
            }}
        >
            <Coins size={16} style={{ color: isLoading ? "rgb(var(--c-slate-600))" : textColor, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
                <div
                    style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: isLoading ? "rgb(var(--c-slate-600))" : textColor,
                        lineHeight: 1,
                    }}
                >
                    {isLoading ? "—" : credits}
                </div>
                <div style={{ fontSize: 10, color: "rgb(var(--c-muted))", marginTop: 2 }}>créditos</div>
            </div>
        </Link>
    )
}
