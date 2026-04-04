export default function DesktopAuthSuccessPage() {
    return (
        <main
            style={{
                minHeight: "100vh",
                display: "grid",
                placeItems: "center",
                background: "#0D1117",
                color: "#E6EDF3",
                fontFamily: "Inter, system-ui, sans-serif",
                padding: 24,
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: 420,
                    borderRadius: 20,
                    border: "1px solid #30363D",
                    background: "#161B22",
                    padding: 28,
                    textAlign: "center",
                }}
            >
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Authentication complete</h1>
                <p style={{ margin: "12px 0 0", color: "#8B949E", lineHeight: 1.6 }}>
                    You can return to the Apliquefy Runner now. The desktop app will continue the session automatically.
                </p>
            </div>
        </main>
    );
}
