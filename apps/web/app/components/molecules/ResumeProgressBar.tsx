"use client";

export function ResumeProgressBar({ progress }: { progress: number }) {
    return (
        <div style={{ background: "#161C27", borderRadius: 12, padding: 20, marginBottom: 24, border: "1px solid #1C2333" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div>
                    <p style={{ margin: 0, fontWeight: 600, color: "#fff" }}>Preenchimento do perfil</p>
                    {progress < 90 && (
                        <p style={{ margin: 0, fontSize: 12, color: "#888" }}>
                            Preencha mais {Math.ceil((90 - progress) / 7)} campos para chegar a 90%
                        </p>
                    )}
                </div>
                <span style={{ fontSize: 22, fontWeight: 700, color: "#3b82f6" }}>{progress}%</span>
            </div>
            <div style={{ background: "#1C2333", borderRadius: 99, height: 8 }}>
                <div style={{ width: `${progress}%`, background: "#3b82f6", borderRadius: 99, height: 8, transition: "width 0.3s" }} />
            </div>
        </div>
    );
}
