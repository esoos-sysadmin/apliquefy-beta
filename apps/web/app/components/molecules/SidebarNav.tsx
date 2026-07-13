import { NavItem } from "../atoms/NavItem";
import { BarChart3, CreditCard, FileText, Megaphone, MonitorDown } from "lucide-react";

const navItems = [
    { href: "/curriculos", label: "Resumes", icon: <FileText size={16} /> },
    { href: "/campanhas", label: "Campanhas", icon: <Megaphone size={16} /> },
    { href: "/relatorios", label: "Relatórios", icon: <BarChart3 size={16} /> },
    { href: "/desktop", label: "Desktop App", icon: <MonitorDown size={16} /> },
    { href: "/assinatura", label: "Assinatura", icon: <CreditCard size={16} /> },
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
