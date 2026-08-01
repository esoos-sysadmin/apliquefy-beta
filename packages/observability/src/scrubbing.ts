/**
 * Redação de PII antes do evento sair da máquina (SDD §7).
 *
 * Esta é a barreira do lado TypeScript. A do engine Python é separada e mais
 * crítica — o formato do evento é outro e é lá que estão currículo, cookie e
 * screenshot (ver `apps/robots/src/rpa_engine/observability.py`).
 *
 * Os tipos abaixo são estruturais de propósito, sem importar `@sentry/core`: o
 * desktop usa @sentry/electron e o web usa @sentry/nextjs, cada um com a sua
 * cópia do core na árvore. Tipar contra uma delas faz o `beforeSend` do outro
 * parar de compilar por identidade nominal de tipo, sem nenhum problema real.
 */

/** O mínimo que `scrubEvent` toca. `Event` e `ErrorEvent` do Sentry satisfazem. */
export type ScrubbableEvent = {
    user?: { id?: string | number } | null;
    request?: {
        cookies?: unknown;
        headers?: unknown;
        data?: unknown;
        query_string?: unknown;
    };
    extra?: Record<string, unknown>;
    contexts?: Record<string, unknown>;
};

export type ScrubbableBreadcrumb = {
    category?: string;
    data?: Record<string, unknown>;
};

// Substring match, case-insensitive: pega `personalInfo`, `personal_info`,
// `resumeData`, `authorizationHeader` etc. sem precisar listar cada variante.
const DENY_KEYS = [
    "password",
    "senha",
    "token",
    "jwt",
    "authorization",
    "cookie",
    "session",
    "sessao",
    "storagestate",
    "storage_state",
    "cpf",
    "rg",
    "email",
    "phone",
    "telefone",
    "endereco",
    "address",
    "personalinfo",
    "personal_info",
    "resume",
    "curriculo",
    "education",
    "experience",
    "skills",
    "idioms",
    "apikey",
    "api_key",
    "secret",
];

const REDACTED = "[Filtered]";

// Teto de profundidade porque o payload pode ser cíclico ou absurdamente
// aninhado; 6 cobre `contexts.automation.foo.bar` com folga.
const MAX_DEPTH = 6;

function isDenied(key: string): boolean {
    const lower = key.toLowerCase();
    return DENY_KEYS.some((denied) => lower.includes(denied));
}

function redact(value: unknown, depth = 0): unknown {
    if (depth > MAX_DEPTH || value === null || typeof value !== "object") return value;
    if (Array.isArray(value)) return value.map((item) => redact(item, depth + 1));

    return Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([key, item]) => [
            key,
            isDenied(key) ? REDACTED : redact(item, depth + 1),
        ]),
    );
}

/**
 * `beforeSend`: última barreira local antes do envelope subir.
 *
 * Genérico e mutando in-place: o SDK espera receber de volta exatamente o tipo
 * que passou (`ErrorEvent`), não um `Event` largo.
 */
export function scrubEvent<T extends ScrubbableEvent>(event: T): T {
    const target = event as ScrubbableEvent & { attachments?: unknown };

    // Nenhum anexo binário, nunca: um screenshot de página logada carrega PII de
    // terceiros que não consentiram nada (SDD §7.6).
    delete target.attachments;

    if (target.request) {
        delete target.request.cookies;
        delete target.request.headers;
        delete target.request.data;
        delete target.request.query_string;
    }

    // Só o UUID interno. Nunca e-mail, nome ou IP.
    if (target.user) target.user = { id: target.user.id };

    if (target.extra) target.extra = redact(target.extra) as Record<string, unknown>;
    if (target.contexts) target.contexts = redact(target.contexts) as Record<string, unknown>;

    return event;
}

/** `beforeBreadcrumb`: o rastro é tão sensível quanto o evento. */
export function scrubBreadcrumb<T extends ScrubbableBreadcrumb>(breadcrumb: T): T | null {
    // console.log de objeto grande é o caminho mais curto para um dump de dados
    // do usuário virar breadcrumb. Descarta a categoria inteira.
    if (breadcrumb.category === "console") return null;

    // Query string de URL de vaga/API pode carregar identificador de sessão.
    const url = breadcrumb.data?.url;
    if (breadcrumb.data && typeof url === "string") {
        breadcrumb.data.url = url.split("?")[0];
    }

    return breadcrumb;
}
