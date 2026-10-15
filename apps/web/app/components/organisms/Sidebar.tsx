import { SidebarLogo } from "../molecules/SidebarLogo";
import { SidebarNav } from "../molecules/SidebarNav";
import { SidebarCredits } from "../molecules/SidebarCredits";
import { SidebarSession } from "../molecules/SidebarSession";
import { ThemeToggle } from "../atoms/ThemeToggle";

export function Sidebar() {
    return (
        <aside style={{
            width: 264,
            minHeight: "100vh",
            background: "rgb(var(--c-surface))",
            borderRight: "1px solid rgb(var(--c-line))",
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
            <div>
                <ThemeToggle />
                <SidebarSession />
            </div>
        </aside>
    );
}
