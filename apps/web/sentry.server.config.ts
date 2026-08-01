import * as Sentry from "@sentry/nextjs";
import { scrubEvent, scrubBreadcrumb } from "@repo/observability";

Sentry.init({
    dsn: process.env.SENTRY_DSN_WEB,
    // VERCEL_ENV só existe na Vercel; o fallback mantém isto correto se o deploy
    // mudar de host (SDD §9.1 — o repositório não tem vercel.json que confirme).
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
    release: process.env.VERCEL_GIT_COMMIT_SHA,
    enabled: Boolean(process.env.SENTRY_DSN_WEB) && process.env.NODE_ENV === "production",

    sendDefaultPii: false,
    tracesSampleRate: 0,

    maxBreadcrumbs: 50,
    beforeBreadcrumb: scrubBreadcrumb,
    beforeSend: scrubEvent,
});

Sentry.setTag("surface", "web");
