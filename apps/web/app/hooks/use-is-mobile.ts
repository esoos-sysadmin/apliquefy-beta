"use client";

import { useEffect, useState } from "react";

// UX, não regra de negócio: o backend continua aceitando qualquer plataforma.
// null = ainda não montou (renderiza como desktop, sem flash de bloqueio errado).
export function useIsMobile(): boolean | null {
    const [isMobile, setIsMobile] = useState<boolean | null>(null);
    useEffect(() => {
        const mq = window.matchMedia("(max-width: 767px), (pointer: coarse)");
        const update = () => setIsMobile(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);
    return isMobile;
}
