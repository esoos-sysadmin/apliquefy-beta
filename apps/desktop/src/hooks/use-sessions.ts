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

        electron.sessions.list().then((map) => {
            if (mounted) setSessions(map);
        });

        const unsubscribe = electron.sessions.subscribe((map) => {
            setSessions(map);
        });

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
