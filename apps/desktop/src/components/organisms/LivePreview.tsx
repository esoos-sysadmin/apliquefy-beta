import { useEffect, useState } from "react";
import type { RpaEvent } from "../../../shared/runner-types";

const STATUS_LABELS: Record<string, string> = {
    job_found: "Vaga encontrada",
    applying: "Preenchendo candidatura…",
    applied: "Candidatura enviada",
    skipped: "Vaga pulada",
    paused: "Pausado",
    finished: "Execução finalizada",
};

/**
 * Painel de prévia ao vivo: assina os eventos do engine e renderiza o último
 * frame JPEG. Subscrição própria (não `useRpaEvents`) para isolar o re-render
 * de ~2.5fps de frames deste componente e não repintar o feed de campanhas.
 */
export function LivePreview() {
    const [frame, setFrame] = useState<string | null>(null);
    const [status, setStatus] = useState("Aguardando execução");

    useEffect(() => {
        const api = window.electronAPI?.rpa;
        if (!api?.subscribe) return;
        return api.subscribe((event: RpaEvent) => {
            if (event.type === "frame") {
                setFrame(event.data);
                return;
            }
            const label = STATUS_LABELS[event.type];
            if (label) setStatus(label);
            if (event.type === "finished" || event.type === "paused") setFrame(null);
        });
    }, []);

    return (
        <div className="live-preview">
            <div className="live-preview__header">
                <span className={`live-preview__dot${frame ? " live-preview__dot--live" : ""}`} />
                <span className="live-preview__status">{status}</span>
            </div>
            <div className="live-preview__stage">
                {frame ? (
                    <img className="live-preview__img" src={`data:image/jpeg;base64,${frame}`} alt="Execução ao vivo" />
                ) : (
                    <p className="live-preview__idle">
                        A prévia da automação aparece aqui enquanto uma campanha está rodando.
                    </p>
                )}
            </div>
        </div>
    );
}
