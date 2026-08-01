import { useCallback, useEffect, useState } from "react";
import type {
    ElectronAPI,
    RunnerPlatform,
    RunnerSessionMap,
    SessionResult,
} from "../../shared/runner-types";

export function useSessions(electron: ElectronAPI) {
    const [sessions, setSessions] = useState<RunnerSessionMap>({});
    const [capturingPlatform, setCapturingPlatform] = useState<RunnerPlatform | null>(null);

    useEffect(() => {
        let mounted = true;

        // Assina ANTES de disparar o check(), senão o broadcast do status revalidado
        // pode chegar antes da assinatura e a UI fica presa no "ativo" defasado.
        const unsubscribe = electron.sessions.subscribe((map) => {
            if (mounted) setSessions(map);
        });

        electron.sessions.list().then((map) => {
            if (mounted) setSessions(map);
        });

        // list() só devolve o estado persistido (defasado). check() revalida o cookie
        // salvo; aplicamos o resultado direto (além do broadcast) para não depender de
        // timing — é o que corrige "Sessão Ativa" que não some ao reabrir.
        Promise.all([
            electron.sessions.check("linkedin"),
            electron.sessions.check("infojobs"),
        ])
            .then(([linkedin, infojobs]) => {
                if (!mounted) return;
                setSessions((prev) => ({
                    ...prev,
                    linkedin: linkedin ?? undefined,
                    infojobs: infojobs ?? undefined,
                }));
            })
            .catch(() => {});

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, [electron]);

    const isValid = useCallback(
        (platform: RunnerPlatform) => sessions[platform]?.status === "active",
        [sessions]
    );

    const capture = useCallback(
        async (platform: RunnerPlatform): Promise<SessionResult> => {
            setCapturingPlatform(platform);
            try {
                return await electron.sessions.capture(platform);
            } finally {
                setCapturingPlatform(null);
            }
        },
        [electron]
    );

    const remove = useCallback(
        async (platform: RunnerPlatform) => {
            await electron.sessions.remove(platform);
        },
        [electron]
    );

    return { sessions, isValid, capture, remove, capturingPlatform };
}
