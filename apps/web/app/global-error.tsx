"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

/**
 * Último recurso do App Router: erro de render que escapa de todos os
 * `error.tsx`. Substitui o `<html>` inteiro, então precisa trazer as tags.
 */
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
    useEffect(() => {
        Sentry.captureException(error);
    }, [error]);

    return (
        <html lang="pt-BR">
            <body
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    gap: "0.75rem",
                    fontFamily: "system-ui, sans-serif",
                    textAlign: "center",
                    padding: "1.5rem",
                }}
            >
                <h1 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Algo deu errado</h1>
                <p style={{ color: "#666", maxWidth: "32rem" }}>
                    Já fomos avisados e estamos verificando. Tente recarregar a página.
                </p>
                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    style={{
                        marginTop: "0.5rem",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #d0d0d0",
                        cursor: "pointer",
                    }}
                >
                    Recarregar
                </button>
            </body>
        </html>
    );
}
