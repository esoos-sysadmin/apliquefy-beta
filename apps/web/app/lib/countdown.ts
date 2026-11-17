/** "m:ss" até `until`; "0:00" quando venceu. */
export function timeLeft(until: string | null | undefined, now: number): string {
    const s = until ? Math.max(0, Math.floor((new Date(until).getTime() - now) / 1000)) : 0
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}
