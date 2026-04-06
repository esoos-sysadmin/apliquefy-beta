"use client";

export function ResumeFormPopup({
    popup,
    onClose,
}: {
    popup: { type: "success" | "error"; message: string } | null;
    onClose: () => void;
}) {
    if (!popup) {
        return null;
    }

    const isSuccess = popup.type === "success";

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
            <div style={{ background: "#161C27", borderRadius: 12, padding: 32, maxWidth: 400, width: "90%", textAlign: "center", border: `1px solid ${isSuccess ? "#22c55e" : "#ef4444"}` }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{isSuccess ? "✅" : "❌"}</div>
                <h3 style={{ margin: "0 0 8px", fontSize: 18, color: "#fff" }}>{isSuccess ? "Sucesso!" : "Erro"}</h3>
                <p style={{ color: "#aaa", margin: "0 0 24px", fontSize: 14 }}>{popup.message}</p>
                <button
                    onClick={onClose}
                    style={{ background: isSuccess ? "#22c55e" : "#ef4444", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 600, cursor: "pointer", width: "100%" }}
                >
                    {isSuccess ? "Ver meus currículos" : "Fechar"}
                </button>
            </div>
        </div>
    );
}
