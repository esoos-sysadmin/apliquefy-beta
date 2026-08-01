import * as Sentry from "@sentry/nextjs";
import { scrubEvent, scrubBreadcrumb } from "@repo/observability";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
    release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
    enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN) && process.env.NODE_ENV === "production",

    sendDefaultPii: false,
    tracesSampleRate: 0,
    // Session Replay é vetado neste produto (SDD §13): gravaria a tela de quem
    // está logado no LinkedIn.
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,

    maxBreadcrumbs: 50,
    beforeBreadcrumb: scrubBreadcrumb,
    beforeSend: scrubEvent,

    ignoreErrors: ["ResizeObserver loop limit exceeded", "Non-Error promise rejection captured"],
});

Sentry.setTag("surface", "web");

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
