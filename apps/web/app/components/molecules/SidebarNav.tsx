import { NavItem } from "../atoms/NavItem";
import { FileText, Megaphone } from "lucide-react";

const navItems = [
    { href: "/curriculos", label: "Currículos", icon: <FileText size={16} /> },
    { href: "/campanhas", label: "Campanhas", icon: <Megaphone size={16} /> },
];

export function SidebarNav() {
    return (
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {navItems.map(item => (
                <NavItem key={item.href} href={item.href} label={item.label} icon={item.icon} />
            ))}
        </nav>
    );
}
