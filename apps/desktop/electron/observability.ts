import { app } from "electron";
import * as Sentry from "@sentry/electron/main";
import { scrubEvent, scrubBreadcrumb } from "@repo/observability";
import { getRunnerState } from "./store";

/**
 * Error tracking do processo main (SDD §5.2).
 *
 * Precisa rodar antes de qualquer código de aplicação, mas depois do
 * `loadEnvFile` do main.ts — é de lá que o DSN vem em desenvolvimento.
 *
 * O `enabled` é a única chave do consentimento para main e renderer; o engine
 * Python é desligado separadamente, em `buildEnv` (§7.7).
 */
export function initObservability() {
    const consent = getRunnerState().settings.errorReports;

    Sentry.init({
        dsn: process.env.SENTRY_DSN_RUNNER,
        environment: app.isPackaged ? "production" : "development",
        // Erro de desenvolvimento não queima cota. Para testar localmente, apontar
        // o DSN para um projeto `-dev` e trocar esta linha temporariamente.
        enabled: app.isPackaged && consent,

        release: `apliquefy-runner@${app.getVersion()}`,
        dist: process.env.BUILD_NUMBER,

        // Sem PII automática, sem tracing, sem replay.
        sendDefaultPii: false,
        tracesSampleRate: 0,

        // Release health (crash-free session rate) vem ligado por padrão no
        // @sentry/electron 7 — a antiga opção `autoSessionTracking` não existe
        // mais no core v10 e passá-la seria ignorada em silêncio.

        maxBreadcrumbs: 50,
        beforeBreadcrumb: scrubBreadcrumb,
        beforeSend: scrubEvent,

        ignoreErrors: ["ResizeObserver loop limit exceeded", "Non-Error promise rejection captured"],
    });

    Sentry.setTag("surface", "runner_main");
    Sentry.setTag("runner_version", app.getVersion());
    Sentry.setTag("os", process.platform);
    identifyUser(getRunnerState().auth.userId);
}

/** UUID interno e nada além disso — nunca e-mail, nome ou IP (SDD §5.6). */
export function identifyUser(userId: string | null) {
    Sentry.setUser(userId ? { id: userId } : null);
}

export { Sentry };
