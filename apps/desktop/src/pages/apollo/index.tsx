import { useEffect, useRef, useState } from "react";
import { ArrowRight, Keyboard, Mic, Send, Sparkles, Square } from "lucide-react";
import type { ElectronAPI } from "../../../shared/runner-types";
import { TitleBar } from "../../components/atoms/TitleBar";
import { ApolloOrb } from "../../components/organisms/ApolloOrb";
import { useApollo } from "../../hooks/use-apollo";

type ApolloScreenProps = {
    electron: ElectronAPI;
    userName?: string | null;
    onClose: () => void;
    onOpenRunner: () => void;
};

const STATUS_LABEL: Record<string, string> = {
    idle: "Toque no orbe e dê um comando",
    listening: "Ouvindo…",
    thinking: "Processando…",
    speaking: "Respondendo…",
};

// As marcações de emoção ([sarcastic], [laughing]…) são instruções pro TTS da fish.audio,
// não fala: saem da bolha e ficam só no texto que vai pro speak().
function stripVoiceTags(text: string) {
    return text.replace(/\[[^\][]{1,24}\]/g, "").replace(/\s{2,}/g, " ").trim();
}

const SUGGESTIONS = [
    "Liste minhas campanhas",
    "Crie um currículo Dev Frontend",
    "Analise meu currículo",
];

export default function ApolloScreen({ electron, userName, onClose, onOpenRunner }: ApolloScreenProps) {
    const [mode, setMode] = useState<"voice" | "text">("voice");
    const [draft, setDraft] = useState("");
    const { messages, orbState, level, listening, busy, error, sendText, toggleListening } = useApollo(
        electron,
        mode === "voice",
    );

    const transcriptRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: "smooth" });
    }, [messages]);

    const firstName = userName?.split(" ")[0];
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");

    const handleSend = () => {
        sendText(draft);
        setDraft("");
    };

    return (
        <div className="apollo">
            <TitleBar onClose={onClose} />

            <button type="button" className="apollo__exit no-drag" onClick={onOpenRunner}>
                Campanhas <ArrowRight size={14} />
            </button>

            <div className="apollo__stage">
                <div className={`apollo__orb apollo__orb--${orbState}`} onClick={mode === "voice" ? toggleListening : undefined}>
                    <ApolloOrb level={level} state={orbState} size={300} />
                    <span className="apollo__wordmark">APOLLO</span>
                </div>

                <p className="apollo__status">
                    {orbState === "idle" && messages.length === 0
                        ? `Olá${firstName ? `, ${firstName}` : ""} — sou o Apollo. ${STATUS_LABEL.idle}.`
                        : (error ? error : STATUS_LABEL[orbState])}
                </p>

                {messages.length > 0 ? (
                    <div className="apollo__transcript" ref={transcriptRef}>
                        {messages.map((m, i) => (
                            <div key={i} className={`apollo__bubble apollo__bubble--${m.role}`}>
                                <span>{m.role === "assistant" ? stripVoiceTags(m.content) : m.content}</span>
                                {m.actions?.length ? (
                                    <div className="apollo__chips">
                                        {m.actions.map((a, j) => (
                                            <span key={j} className={`apollo__chip${a.ok ? "" : " apollo__chip--err"}`}>
                                                {a.label}
                                            </span>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="apollo__suggestions">
                        {SUGGESTIONS.map((s) => (
                            <button key={s} type="button" className="apollo__suggestion no-drag" onClick={() => sendText(s)} disabled={busy}>
                                <Sparkles size={13} /> {s}
                            </button>
                        ))}
                    </div>
                )}
                {lastAssistant && messages.length > 0 ? <div className="apollo__spacer" /> : null}
            </div>

            <div className="apollo__controls no-drag">
                <div className="apollo__modes">
                    <button
                        type="button"
                        className={`apollo__mode${mode === "voice" ? " apollo__mode--active" : ""}`}
                        onClick={() => setMode("voice")}
                        aria-label="Modo voz"
                    >
                        <Mic size={15} />
                    </button>
                    <button
                        type="button"
                        className={`apollo__mode${mode === "text" ? " apollo__mode--active" : ""}`}
                        onClick={() => setMode("text")}
                        aria-label="Modo texto"
                    >
                        <Keyboard size={15} />
                    </button>
                </div>

                {mode === "voice" ? (
                    <button
                        type="button"
                        className={`apollo__mic${listening ? " apollo__mic--live" : ""}`}
                        onClick={toggleListening}
                        disabled={busy && !listening}
                    >
                        {listening ? <Square size={18} /> : <Mic size={18} />}
                        {listening ? "Parar" : busy ? "Aguarde…" : "Falar"}
                    </button>
                ) : (
                    <div className="apollo__inputwrap">
                        <input
                            className="apollo__input"
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Peça algo ao Apollo…"
                            disabled={busy}
                        />
                        <button type="button" className="apollo__send" onClick={handleSend} disabled={busy || !draft.trim()}>
                            <Send size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
