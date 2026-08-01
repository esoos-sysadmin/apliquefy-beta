import { Sidebar } from "../components/organisms/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "transparent" }}>
            <Sidebar />
            <main style={{ marginLeft: 264, flex: 1, padding: "32px" }}>
                {children}
            </main>
        </div>
    );
}
