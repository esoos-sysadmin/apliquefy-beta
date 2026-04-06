export function formatDistanceToNow(date: string | Date | null | undefined) {
    if (!date) {
        return "never";
    }

    const timestamp = typeof date === "string" ? new Date(date).getTime() : date.getTime();

    if (Number.isNaN(timestamp)) {
        return "unknown";
    }

    const diff = Date.now() - timestamp;
    const minute = 60_000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;

    if (diff < minute) {
        return "just now";
    }

    if (diff < hour) {
        return `${Math.floor(diff / minute)}m ago`;
    }

    if (diff < day) {
        return `${Math.floor(diff / hour)}h ago`;
    }

    if (diff < week) {
        return `${Math.floor(diff / day)}d ago`;
    }

    return `${Math.floor(diff / week)}w ago`;
}

export function formatDateTime(date: string | null | undefined) {
    if (!date) {
        return "Unknown";
    }

    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(date));
}
