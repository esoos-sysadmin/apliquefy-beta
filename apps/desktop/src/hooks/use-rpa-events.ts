import { useEffect, useState } from "react";
import type { RpaEvent } from "../../shared/runner-types";

/**
 * Subscribes to RPA events emitted by the engine via Electron IPC.
 * Returns the latest event seen.
 */
export function useRpaEvents(): RpaEvent | null {
    const [event, setEvent] = useState<RpaEvent | null>(null);

    useEffect(() => {
        const api = window.electronAPI?.rpa;
        if (!api?.subscribe) return;
        return api.subscribe((next) => setEvent(next));
    }, []);

    return event;
}
