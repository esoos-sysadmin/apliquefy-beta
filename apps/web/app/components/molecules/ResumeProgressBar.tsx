"use client";

export function ResumeProgressBar({ progress }: { progress: number }) {
    return (
        <div className="mb-6 rounded-xl border border-line bg-surface p-4 sm:p-5">
            <div className="mb-2 flex justify-between max-sm:gap-3">
                <div>
                    <p style={{ margin: 0, fontWeight: 600, color: "rgb(var(--c-fg))" }}>Preenchimento do perfil</p>
                    {progress < 90 && (
                        <p style={{ margin: 0, fontSize: 12, color: "rgb(var(--c-muted))" }}>
                            Preencha mais {Math.ceil((90 - progress) / 7)} campos para chegar a 90%
                        </p>
                    )}
                </div>
                <span style={{ fontSize: 22, fontWeight: 700, color: "rgb(var(--c-accent-text))" }}>{progress}%</span>
            </div>
            <div style={{ background: "rgb(var(--c-raised))", borderRadius: 99, height: 8 }}>
                <div style={{ width: `${progress}%`, background: "rgb(var(--c-accent))", borderRadius: 99, height: 8, transition: "width 0.3s" }} />
            </div>
        </div>
    );
}
