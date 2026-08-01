import { NavItem } from "../atoms/NavItem";
import { BarChart3, CreditCard, FileText, HelpCircle, Lightbulb, Map, Megaphone, MonitorDown } from "lucide-react";

// Roadmap e sugestões moram no portal do Featurebase, que já serve em pt-BR.
// O locale vai explícito na URL: sem ele o portal responde 307 pro idioma do browser.
const FEATUREBASE_URL = "https://apliquefy.featurebase.app/pt-BR";

const navItems = [
    { href: "/curriculos", label: "Resumes", icon: <FileText size={16} /> },
    { href: "/campanhas", label: "Campanhas", icon: <Megaphone size={16} /> },
    { href: "/relatorios", label: "Relatórios", icon: <BarChart3 size={16} /> },
    { href: "/desktop", label: "Desktop App", icon: <MonitorDown size={16} /> },
    { href: "/assinatura", label: "Assinatura", icon: <CreditCard size={16} /> },
    { href: `${FEATUREBASE_URL}/roadmap`, label: "Roadmap", icon: <Map size={16} /> },
    { href: FEATUREBASE_URL, label: "Sugestões", icon: <Lightbulb size={16} /> },
    { href: `${FEATUREBASE_URL}/help`, label: "Central de Ajuda", icon: <HelpCircle size={16} /> },
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
