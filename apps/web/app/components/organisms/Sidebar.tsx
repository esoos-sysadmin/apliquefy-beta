import { SidebarLogo } from "../molecules/SidebarLogo";
import { SidebarNav } from "../molecules/SidebarNav";
import { SidebarCredits } from "../molecules/SidebarCredits";
import { SidebarSession } from "../molecules/SidebarSession";

export function Sidebar() {
    return (
        <aside style={{
            width: 264,
            minHeight: "100vh",
            // Mesma família dos cards (#111827), meio tom acima do canvas: o menu
            // lê como superfície da app, não como painel colado por cima.
            background: "linear-gradient(180deg, #161b28 0%, #11151f 100%)",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            padding: "24px 16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "fixed",
            top: 0,
            left: 0,
        }}>
            <div>
                <SidebarLogo />
                <SidebarNav />
                <SidebarCredits />
            </div>
            <SidebarSession />
        </aside>
    );
}
