export function SidebarLogo() {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 0", marginBottom: 24 }}>
            <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: "#3b82f6",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, fontSize: 16, color: "#fff",
                flexShrink: 0,
            }}>
                A
            </div>
            <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#fff" }}>Apliquefy</p>
                <p style={{ margin: 0, fontSize: 11, color: "#555" }}>Local-First Agent</p>
            </div>
        </div>
    );
}
