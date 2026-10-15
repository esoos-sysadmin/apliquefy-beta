export default function DesktopAuthSuccessPage() {
    return (
        <main
            style={{
                minHeight: "100vh",
                display: "grid",
                placeItems: "center",
                background: "rgb(var(--c-canvas))",
                color: "rgb(var(--c-fg))",
                fontFamily: "Inter, system-ui, sans-serif",
                padding: 24,
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: 420,
                    borderRadius: 20,
                    border: "1px solid rgb(var(--c-line))",
                    background: "rgb(var(--c-surface))",
                    padding: 28,
                    textAlign: "center",
                }}
            >
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Autenticação concluída</h1>
                <p style={{ margin: "12px 0 0", color: "rgb(var(--c-slate-400))", lineHeight: 1.6 }}>
                    Você já pode voltar para o Apliquefy Runner. O app desktop continua a sessão automaticamente.
                </p>
            </div>
        </main>
    );
}
