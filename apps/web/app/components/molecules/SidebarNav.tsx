import { NavItem } from "../atoms/NavItem";
import { CreditCard, FileText, Megaphone, MonitorDown } from "lucide-react";

const navItems = [
    { href: "/curriculos", label: "Resumes", icon: <FileText size={16} /> },
    { href: "/campanhas", label: "Campanhas", icon: <Megaphone size={16} /> },
    { href: "/desktop", label: "Desktop App", icon: <MonitorDown size={16} /> },
    { href: "/api/stripe", label: "Assinatura", icon: <CreditCard size={16} /> },
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
