import { useCallback, useEffect, useRef, useState } from "react";
import type { AssistantAction, AssistantMessage, ElectronAPI, PersonaId } from "../../shared/runner-types";
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

// RMS do sinal a cada frame, normalizado em 0..1. Serve tanto pro microfone quanto
// pra saída do TTS — os dois viram a "amplitude" que faz o orbe respirar.
function trackLevel(analyser: AnalyserNode, gain: number, onLevel: (v: number) => void): () => void {
    const data = new Uint8Array(analyser.frequencyBinCount);
    let raf = 0;
    const tick = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            const v = (data[i] - 128) / 128;
            sum += v * v;
        }
        onLevel(Math.min(1, Math.sqrt(sum / data.length) * gain));
        raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
}

// Toca o mp3 que a fish.audio devolveu (base64 via IPC). Resolve quando a fala
// termina — ou na hora, se o áudio falhar: o texto já está na tela, voz muda não
// pode travar a conversa.
function playSpeech(
    base64: string,
    onStart: () => void,
    onLevel: (v: number) => void,
): { audio: HTMLAudioElement; done: Promise<void> } {
    // blob: em vez de data: — createMediaElementSource só entrega amostras se a mídia
    // for same-origin; com data: o analyser corre o risco de só ler silêncio.
    const url = URL.createObjectURL(
        new Blob([Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))], { type: "audio/mpeg" }),
    );
    const audio = new Audio(url);

    // Mede a própria saída do TTS: é o que sincroniza o orbe com a fala de verdade.
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    audioCtx.createMediaElementSource(audio).connect(analyser);
    analyser.connect(audioCtx.destination); // sem isto o áudio emudece: o source deixa de chegar na saída
    const stopLevel = trackLevel(analyser, 3.2, onLevel);

    const done = new Promise<void>((resolve) => {
        audio.onplay = onStart;
        audio.onended = () => resolve();
        audio.onerror = () => resolve();
        audio.onpause = () => resolve(); // fala cortada por uma nova: não deixa o await pendurado
    }).finally(() => {
        stopLevel();
        onLevel(0);
        URL.revokeObjectURL(url);
        void audioCtx.close().catch(() => undefined);
    });

    void audio.play().catch(() => undefined);
    return { audio, done };
}

export function useApollo(electron: ElectronAPI, voiceReplies: boolean, persona: PersonaId) {
    const [messages, setMessages] = useState<ApolloTurn[]>([]);
    const [orbState, setOrbState] = useState<OrbState>("idle");
    const [level, setLevel] = useState(0);
    const [listening, setListening] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const streamRef = useRef<MediaStream | null>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const stopLevelRef = useRef<(() => void) | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const speechRef = useRef<HTMLAudioElement | null>(null);
    // guarda a conversa mais recente para o áudio ser enviado com o histórico certo
    const messagesRef = useRef<ApolloTurn[]>([]);
    messagesRef.current = messages;

    const cleanupAudio = useCallback(() => {
        stopLevelRef.current?.();
        stopLevelRef.current = null;
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
                const { reply, actions } = await electron.assistant.chat(history, persona);
                setMessages((prev) => [...prev, { role: "assistant", content: reply, actions }]);
                if (!voiceReplies) {
                    setOrbState("idle");
                    return;
                }
                // Corta a fala anterior antes de começar a próxima.
                speechRef.current?.pause();
                const base64 = await electron.assistant.speak(reply, persona);
                const { audio, done } = playSpeech(base64, () => setOrbState("speaking"), setLevel);
                speechRef.current = audio;
                await done;
                setOrbState("idle");
            } catch (err) {
                setError(err instanceof Error ? err.message : "Falha ao falar com o Apollo.");
                setOrbState("idle");
            } finally {
                setBusy(false);
            }
        },
        [electron, voiceReplies, persona],
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
            stopLevelRef.current = trackLevel(analyser, 3.2, setLevel); // ganho p/ a fala normal encher o orbe

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
