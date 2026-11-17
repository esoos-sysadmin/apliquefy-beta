import { Sidebar } from "../components/organisms/Sidebar";
import { NeedsUserBanner } from "../components/molecules/NeedsUserBanner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "transparent" }}>
            <Sidebar />
            <main style={{ marginLeft: 264, flex: 1, padding: "32px" }}>
                <NeedsUserBanner />
                {children}
            </main>
        </div>
    );
}
