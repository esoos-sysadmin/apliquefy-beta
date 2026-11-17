"use client";

import Link from "next/link";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { useAuthenticatedClient } from "../../lib/auth/client/clerk";
import { getApplicationMetrics } from "../../client/job.service";
import { timeLeft } from "../../lib/countdown";

// Faixa do topo (§6.4): candidatura da nuvem esperando o usuário resolver um desafio.
// ponytail: reaproveita a listagem de /relatorios (pesada para um banner); rota enxuta se pesar.
export function NeedsUserBanner() {
    const { getClient } = useAuthenticatedClient();
    const { data } = useSWR(
        "needs-user",
        async () => getApplicationMetrics(await getClient(), { status: "needs_user", limit: 5 }),
        { refreshInterval: 30_000 },
    );
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(t);
    }, []);

    const waiting = (data?.data.history ?? []).filter((a) => a.needsUserUntil && new Date(a.needsUserUntil).getTime() > now);
    const first = waiting[0];
    if (!first) return null;

    return (
        <div role="status" className="mb-6 flex flex-col gap-3 rounded-xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-fg sm:flex-row sm:items-center sm:justify-between">
            <span>
                {waiting.length === 1
                    ? `Sua candidatura para ${first.jobTitle ?? "uma vaga"}${first.companyName ? ` (${first.companyName})` : ""} precisa de você.`
                    : `${waiting.length} candidaturas precisam de você.`}{" "}
                <span className="font-mono text-muted">{timeLeft(first.needsUserUntil, now)}</span>
            </span>
            <Link
                href={`/candidaturas/${first.id}/concluir`}
                className="inline-flex justify-center rounded-lg bg-accent px-3 py-1.5 font-medium text-white transition hover:bg-accent-hover"
            >
                Concluir
            </Link>
        </div>
    );
}
