import { SidebarLogo } from "../molecules/SidebarLogo";
import { SidebarNav } from "../molecules/SidebarNav";
import { SidebarCredits } from "../molecules/SidebarCredits";
import { SidebarSession } from "../molecules/SidebarSession";

export function Sidebar() {
    return (
        <aside style={{
            width: 220,
            minHeight: "100vh",
            background: "#0B111A",
            borderRight: "1px solid #1C2333",
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
