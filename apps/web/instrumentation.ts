import * as Sentry from "@sentry/nextjs";

export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        await import("./sentry.server.config");
    }
    // Sem `sentry.edge.config`: o projeto não tem rota edge. O middleware do Next 16
    // é o `proxy.ts` (clerkMiddleware) e roda no runtime Node (SDD §9.1).
}

// Rotas que o engine RPA chama de volta (WebApiClient). São o contrato com o
// Runner: um pico de 5xx aqui e um pico de `surface:runner_engine` são o mesmo
// incidente visto dos dois lados, e a tag é o que permite cruzar os dois (§9.3).
const RUNNER_API = [
    /^\/api\/campaigns\/[^/]+\/(runtime|daily-status)/,
    /^\/api\/job-applications/,
    /^\/api\/credits\/debit-flat/,
];

/** Captura erros de Server Components, proxy e route handlers. */
export const onRequestError: typeof Sentry.captureRequestError = (error, request, context) => {
    Sentry.withScope((scope) => {
        const path = request.path ?? "";
        scope.setTag("surface", RUNNER_API.some((route) => route.test(path)) ? "runner_api" : "web");
        Sentry.captureRequestError(error, request, context);
    });
};
