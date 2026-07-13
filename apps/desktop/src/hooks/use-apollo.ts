import { useCallback, useEffect, useRef, useState } from "react";
import type { AssistantAction, AssistantMessage, ElectronAPI } from "../../shared/runner-types";
import type { OrbState } from "../components/organisms/ApolloOrb";

export type ApolloTurn = AssistantMessage & { actions?: AssistantAction[] };

function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(String(reader.result).split(",")[1] ?? "");
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

function speak(text: string, onStart: () => void, onEnd: () => void) {
    if (typeof window === "undefined" || !window.speechSynthesis) {
        onEnd();
        return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "pt-BR";
    utter.rate = 1.05;
    utter.onstart = onStart;
    utter.onend = onEnd;
    utter.onerror = onEnd;
    window.speechSynthesis.speak(utter);
}

export function useApollo(electron: ElectronAPI, voiceReplies: boolean) {
    const [messages, setMessages] = useState<ApolloTurn[]>([]);
    const [orbState, setOrbState] = useState<OrbState>("idle");
    const [level, setLevel] = useState(0);
    const [listening, setListening] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const streamRef = useRef<MediaStream | null>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const rafRef = useRef<number | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    // guarda a conversa mais recente para o áudio ser enviado com o histórico certo
    const messagesRef = useRef<ApolloTurn[]>([]);
    messagesRef.current = messages;

    const cleanupAudio = useCallback(() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        void audioCtxRef.current?.close().catch(() => undefined);
        audioCtxRef.current = null;
        setLevel(0);
    }, []);

    useEffect(() => cleanupAudio, [cleanupAudio]);

    const runChat = useCallback(
        async (userText: string) => {
            const history: AssistantMessage[] = [
                ...messagesRef.current.map((m) => ({ role: m.role, content: m.content })),
                { role: "user", content: userText },
            ];
            setBusy(true);
            setOrbState("thinking");
            try {
                const { reply, actions } = await electron.assistant.chat(history);
                setMessages((prev) => [...prev, { role: "assistant", content: reply, actions }]);
                if (voiceReplies) {
                    speak(reply, () => setOrbState("speaking"), () => setOrbState("idle"));
                } else {
                    setOrbState("idle");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Falha ao falar com o Apollo.");
                setOrbState("idle");
            } finally {
                setBusy(false);
            }
        },
        [electron, voiceReplies],
    );

    const sendText = useCallback(
        (text: string) => {
            const trimmed = text.trim();
            if (!trimmed || busy) return;
            setError(null);
            setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
            void runChat(trimmed);
        },
        [busy, runChat],
    );

    const stopListening = useCallback(() => {
        if (recorderRef.current && recorderRef.current.state !== "inactive") {
            recorderRef.current.stop();
        }
        setListening(false);
    }, []);

    const startListening = useCallback(async () => {
        if (busy || listening) return;
        setError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const audioCtx = new AudioContext();
            audioCtxRef.current = audioCtx;
            const source = audioCtx.createMediaStreamSource(stream);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 512;
            source.connect(analyser);
            const data = new Uint8Array(analyser.frequencyBinCount);

            const tick = () => {
                analyser.getByteTimeDomainData(data);
                let sum = 0;
                for (let i = 0; i < data.length; i++) {
                    const v = (data[i] - 128) / 128;
                    sum += v * v;
                }
                const rms = Math.sqrt(sum / data.length);
                setLevel(Math.min(1, rms * 3.2)); // ganho para a fala normal encher o orbe
                rafRef.current = requestAnimationFrame(tick);
            };
            tick();

            chunksRef.current = [];
            const recorder = new MediaRecorder(stream);
            recorderRef.current = recorder;
            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) chunksRef.current.push(event.data);
            };
            recorder.onstop = async () => {
                cleanupAudio();
                const blob = new Blob(chunksRef.current, { type: "audio/webm" });
                if (blob.size < 800) {
                    setOrbState("idle");
                    return; // clique sem fala real
                }
                setBusy(true);
                setOrbState("thinking");
                try {
                    const base64 = await blobToBase64(blob);
                    const text = await electron.assistant.transcribe(base64);
                    if (!text) {
                        setOrbState("idle");
                        setBusy(false);
                        return;
                    }
                    setMessages((prev) => [...prev, { role: "user", content: text }]);
                    setBusy(false);
                    await runChat(text);
                } catch (err) {
                    setError(err instanceof Error ? err.message : "Falha ao transcrever.");
                    setOrbState("idle");
                    setBusy(false);
                }
            };
            recorder.start();
            setListening(true);
            setOrbState("listening");
        } catch {
            setError("Não consegui acessar o microfone. Verifique a permissão.");
            cleanupAudio();
            setOrbState("idle");
        }
    }, [busy, listening, cleanupAudio, electron, runChat]);

    const toggleListening = useCallback(() => {
        if (listening) stopListening();
        else void startListening();
    }, [listening, startListening, stopListening]);

    return { messages, orbState, level, listening, busy, error, sendText, toggleListening };
}
