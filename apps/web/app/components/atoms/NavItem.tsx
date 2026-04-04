"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItemProps = {
    href: string;
    label: string;
    icon: React.ReactNode;
};

export function NavItem({ href, label, icon }: NavItemProps) {
    const pathname = usePathname();
    const isActive = pathname === href || pathname.startsWith(href + "/");

    return (
        <Link
            href={href}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 12px",
                borderRadius: 8,
                color: isActive ? "#fff" : "#888",
                background: isActive ? "#1C2B46" : "transparent",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                transition: "background 0.15s, color 0.15s",
            }}
        >
            <span style={{ fontSize: 16, opacity: isActive ? 1 : 0.6 }}>{icon}</span>
            {label}
        </Link>
    );
}
