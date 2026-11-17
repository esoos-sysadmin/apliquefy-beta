"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { ExternalLink } from "lucide-react";
import { useAuthenticatedClient } from "../../../../lib/auth/client/clerk";
import { timeLeft } from "../../../../lib/countdown";
import type { ApplicationStatus } from "../../../../types/job";

type CloudApplication = {
    id: string;
    status: ApplicationStatus | null;
    jobTitle: string | null;
    companyName: string | null;
    liveViewUrl: string | null;
    needsUserUntil: string | null;
    errorLog: string | null;
};

// Handoff (§8): o worker segura a sessão aberta e checa a página a cada 5 s. O usuário só
// resolve o desafio no live view; quem conclui e debita é o worker. O live view abre em
// aba nova porque o provedor pode bloquear iframe pelo CSP dele.
export default function ConcluirPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { getClient } = useAuthenticatedClient();
    const { data, error, isLoading } = useSWR(
        ["application", id],
        async () => (await getClient()).get<{ data: CloudApplication }>(`/job-applications/${id}`),
        { refreshInterval: (d) => (d?.data.status === "needs_user" ? 5_000 : 0) },
    );
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(t);
    }, []);

    const app = data?.data;
    const where = app ? `${app.jobTitle ?? "a vaga"}${app.companyName ? ` na ${app.companyName}` : ""}` : "";

    return (
        <section className="mx-auto flex w-full max-w-lg flex-col gap-5 text-fg">
            {isLoading ? (
                <p className="text-muted">Carregando…</p>
            ) : error || !app ? (
                <p className="text-muted">Candidatura não encontrada.</p>
            ) : app.status === "needs_user" && app.liveViewUrl ? (
                <>
                    <h1 className="text-xl font-semibold">Sua candidatura precisa de você</h1>
                    <p className="text-muted">
                        O site da candidatura para <strong className="text-fg">{where}</strong> pediu uma verificação que o
                        robô não resolve (captcha ou código). Abra o navegador, resolva e volte aqui: o envio termina sozinho.
                    </p>
                    <p className="text-sm text-muted">
                        Tempo restante: <span className="font-mono text-fg">{timeLeft(app.needsUserUntil, now)}</span>
                    </p>
                    <a
                        href={app.liveViewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 font-medium text-white transition hover:bg-accent-hover"
                    >
                        Abrir o navegador <ExternalLink size={16} />
                    </a>
                    <p className="text-xs text-muted">
                        No celular, tocar funciona; digitar pode falhar no navegador remoto. Se o site pedir um código, prefira o computador.
                    </p>
                </>
            ) : app.status === "applied" ? (
                <>
                    <h1 className="text-xl font-semibold">Candidatura enviada</h1>
                    <p className="text-muted">Pronto: a candidatura para {where} foi concluída.</p>
                    <Link href="/relatorios" className="text-accent-text">Ver relatórios</Link>
                </>
            ) : app.status === "pending" ? (
                <p className="text-muted">Esta candidatura está na fila da nuvem.</p>
            ) : (
                <>
                    <h1 className="text-xl font-semibold">Não foi possível concluir</h1>
                    <p className="text-muted">
                        {app.errorLog?.startsWith("HANDOFF:")
                            ? "O prazo para resolver a verificação acabou. Nenhum crédito foi cobrado."
                            : "Esta candidatura não foi enviada. Nenhum crédito foi cobrado."}
                    </p>
                    <Link href="/relatorios" className="text-accent-text">Ver relatórios</Link>
                </>
            )}
        </section>
    );
}
