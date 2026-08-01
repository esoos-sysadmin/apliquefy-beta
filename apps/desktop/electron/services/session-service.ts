import { app } from "electron";
import fs from "node:fs";
import path from "node:path";
import { chromium, type BrowserContext, type Cookie } from "playwright";
import type {
    RunnerPlatform,
    RunnerSessionState,
    SessionResult,
} from "../../shared/runner-types";

const LOGIN_NAV_TIMEOUT_MS = 15_000;
const LOGIN_COMPLETION_TIMEOUT_MS = 5 * 60_000;
const LOGIN_POLL_INTERVAL_MS = 1_500;

type PlatformConfig = {
    // Página onde o usuário inicia o login.
    loginUrl: string;
    // Rótulos de botões de consentimento de cookies/termos a fechar no 1º acesso.
    consentButtons: string[];
    // Sinal rápido (cookie) de que o login provavelmente concluiu — dispara a
    // verificação definitiva. NÃO é fonte de verdade sozinho.
    isLoggedIn: (cookies: Cookie[]) => boolean;
    // Página autenticada usada na verificação definitiva por navegação.
    verifyUrl: string;
    // Fonte de verdade: dada a URL final após navegar até verifyUrl e se há form
    // de login na página, decide se está logado. Deslogado é redirecionado ao IdP.
    isVerified: (finalUrl: string, hasLoginForm: boolean) => boolean;
};

function isInfojobsDomain(domain: string) {
    const host = domain.replace(/^\./, "");
    return host === "infojobs.com.br" || host.endsWith(".infojobs.com.br");
}

const PLATFORM_CONFIG: Record<RunnerPlatform, PlatformConfig> = {
    linkedin: {
        loginUrl: "https://www.linkedin.com/login",
        consentButtons: [],
        // li_at só é setado após login real (visitante anônimo não recebe).
        isLoggedIn: (cookies) => cookies.some((c) => c.name === "li_at" && !!c.value),
        verifyUrl: "https://www.linkedin.com/feed/",
        // Deslogado, /feed mostra o form de login (session_key) ou redireciona a /login.
        isVerified: (finalUrl, hasLoginForm) => !hasLoginForm && /linkedin\.com\/feed/.test(finalUrl),
    },
    infojobs: {
        // A home dispara o fluxo de login (login.infojobs.com.br) e exibe o popup
        // de consentimento no primeiro acesso.
        loginUrl: "https://www.infojobs.com.br/",
        consentButtons: [
            "Agree and close",
            "Aceitar e fechar",
            "Aceitar todos os cookies",
            "Concordar",
            "Aceitar",
        ],
        // Cookie httpOnly do OWIN/OIDC em www.infojobs.com.br após login. NÃO casar
        // "session/auth/login": o visitante anônimo já recebe `ab_session_id`
        // (httpOnly), que casava "session" e dava falso positivo (marcava ativo sem
        // login). Restrito aos cookies de auth reais (.AspNet.*/.ASPXAUTH/idsrv).
        isLoggedIn: (cookies) =>
            cookies.some(
                (c) =>
                    c.httpOnly &&
                    isInfojobsDomain(c.domain) &&
                    c.domain.replace(/^\./, "") !== "login.infojobs.com.br" &&
                    /aspxauth|aspnet|applicationcookie|idsrv/i.test(c.name)
            ),
        verifyUrl: "https://www.infojobs.com.br/candidate/",
        // Deslogado, /candidate/ redireciona para login.infojobs.com.br (form de senha).
        isVerified: (finalUrl, hasLoginForm) =>
            !hasLoginForm && /^https:\/\/www\.infojobs\.com\.br\/candidate/i.test(finalUrl),
    },
};

export function getSessionsRoot() {
    return path.join(app.getPath("userData"), "sessions");
}

export function getPlatformSessionDir(platform: RunnerPlatform) {
    return path.join(getSessionsRoot(), platform);
}

export function getStorageStatePath(platform: RunnerPlatform) {
    return path.join(getPlatformSessionDir(platform), "storage-state.json");
}

export function hasStoredSession(platform: RunnerPlatform) {
    return fs.existsSync(getStorageStatePath(platform));
}

function isValidPlatform(platform: unknown): platform is RunnerPlatform {
    return platform === "linkedin" || platform === "infojobs";
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// Tenta fechar o popup de consentimento de cookies/termos. Best-effort: cada
// clique espera o botão por um curto período e, se não aparecer, tenta o próximo
// rótulo. Plataformas sem consentimento (lista vazia) não sofrem atraso.
async function dismissConsentPopup(
    page: import("playwright").Page,
    labels: string[],
    platform: RunnerPlatform
) {
    for (const name of labels) {
        try {
            await page.getByRole("button", { name }).first().click({ timeout: 2_000 });
            console.log(`[capture:${platform}] consentimento fechado via "${name}".`);
            return;
        } catch {
            // botão não encontrado com esse rótulo; tenta o próximo
        }
    }
}

// Aguarda o usuário concluir o login observando os cookies vivos do contexto,
// sem depender de casar URL (a home tem a mesma URL logado/deslogado) nem de
// requisição crua (bloqueada por anti-bot). Loga os cookies quando o conjunto
// muda, para facilitar diagnóstico.
async function waitForLogin(
    context: BrowserContext,
    config: PlatformConfig,
    platform: RunnerPlatform
): Promise<boolean> {
    const deadline = Date.now() + LOGIN_COMPLETION_TIMEOUT_MS;
    let lastSignature = "";

    while (Date.now() < deadline) {
        let cookies: Cookie[] = [];
        try {
            cookies = await context.cookies();
        } catch {
            // contexto ocupado durante navegação; tenta de novo
        }

        const signature = cookies.map((c) => c.name).sort().join(",");
        if (signature !== lastSignature) {
            const relevant = cookies
                .filter((c) => c.httpOnly)
                .map((c) => `${c.domain}|${c.name}`);
            console.log(`[capture:${platform}] cookies httpOnly: ${relevant.join("  ") || "(nenhum)"}`);
            lastSignature = signature;
        }

        if (config.isLoggedIn(cookies)) {
            return true;
        }

        await sleep(LOGIN_POLL_INTERVAL_MS);
    }

    console.error(`[capture:${platform}] login não detectado dentro do tempo limite.`);
    return false;
}

// Verificação definitiva: navega até a área autenticada na janela HEADED (Chrome
// real — não dispara o anti-bot como headless) e confirma que não foi redirecionado
// ao login. Cookie sozinho engana (InfoJobs seta ab_session_id pra anônimo).
async function verifyLogin(
    page: import("playwright").Page,
    config: PlatformConfig,
    platform: RunnerPlatform
): Promise<boolean> {
    try {
        await page.goto(config.verifyUrl, { waitUntil: "domcontentloaded", timeout: LOGIN_NAV_TIMEOUT_MS });
        await page.waitForTimeout(1_500);
    } catch (error) {
        const message = error instanceof Error ? error.message.split("\n")[0] : "";
        console.error(`[capture:${platform}] verificação de login falhou ao navegar: ${message}`);
        return false;
    }

    const hasLoginForm =
        (await page.locator("input[name='session_key'], input[type='password']").count()) > 0;
    const verified = config.isVerified(page.url(), hasLoginForm);
    console.log(
        `[capture:${platform}] verificação: url=${page.url()} loginForm=${hasLoginForm} => ${verified ? "LOGADO" : "DESLOGADO"}`
    );
    return verified;
}

export async function captureSession(platform: RunnerPlatform): Promise<SessionResult> {
    if (!isValidPlatform(platform)) {
        return { success: false, code: 400, message: "Plataforma inválida." };
    }

    const config = PLATFORM_CONFIG[platform];
    const sessionDir = getPlatformSessionDir(platform);

    try {
        fs.mkdirSync(sessionDir, { recursive: true });
    } catch (error) {
        console.error("Failed to create session dir:", error);
        return { success: false, code: 500, message: "Não foi possível salvar a sessão." };
    }

    let context: BrowserContext | null = null;

    try {
        context = await chromium.launchPersistentContext(sessionDir, {
            channel: "chrome",
            headless: false,
            viewport: null,
            args: ["--disable-blink-features=AutomationControlled"],
            ignoreDefaultArgs: ["--enable-automation"],
        });
    } catch (error) {
        console.error("Playwright launch failed:", error);
        return {
            success: false,
            code: 500,
            message: "Não foi possível iniciar o navegador. Verifique se o Chrome está instalado.",
        };
    }

    const page = context.pages()[0] ?? (await context.newPage());

    try {
        // "commit" não estoura exceção se a página fizer redirect durante a
        // navegação (comum no fluxo OIDC do InfoJobs).
        const response = await page.goto(config.loginUrl, {
            waitUntil: "commit",
            timeout: LOGIN_NAV_TIMEOUT_MS,
        });
        console.log(
            `[capture:${platform}] goto status=${response?.status() ?? "?"} url=${page.url()}`
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : "";
        console.error(`[capture:${platform}] goto FALHOU: ${message.split("\n")[0]}`);
        await context.close();
        if (/Timeout/i.test(message)) {
            return { success: false, code: 408, message: "Tempo de espera para carregar excedido." };
        }
        return { success: false, code: 404, message: "Não foi possível acessar a página de login." };
    }

    // Fecha o popup de consentimento (aparece no 1º acesso e bloqueia o clique).
    await dismissConsentPopup(page, config.consentButtons, platform);

    const loggedIn = await waitForLogin(context, config, platform);
    if (!loggedIn) {
        await context.close();
        return {
            success: false,
            code: 408,
            message: "Tempo de espera para login excedido. Tente novamente.",
        };
    }

    // Confirma o login de verdade navegando à área autenticada. Evita marcar
    // "ativo" quando o cookie engana (ex.: ab_session_id anônimo no InfoJobs).
    const verified = await verifyLogin(page, config, platform);
    if (!verified) {
        await context.close();
        return {
            success: false,
            code: 401,
            message: "Login não confirmado. Conclua o login na janela e tente novamente.",
        };
    }
    console.log(`[capture:${platform}] login confirmado.`);

    try {
        await context.storageState({ path: getStorageStatePath(platform) });
    } catch (error) {
        console.error("Failed to persist storage state:", error);
        await context.close();
        return { success: false, code: 500, message: "Falha ao salvar a sessão." };
    }

    await context.close();

    const session: RunnerSessionState = {
        platform,
        status: "active",
        capturedAt: new Date().toISOString(),
        lastValidatedAt: new Date().toISOString(),
        storagePath: getStorageStatePath(platform),
    };

    return { success: true, code: 200, message: "Sessão capturada.", session };
}

type StoredCookie = {
    name: string;
    value: string;
    domain: string;
    path: string;
    httpOnly?: boolean;
    secure?: boolean;
    expires?: number;
};

export async function validateSession(platform: RunnerPlatform): Promise<SessionResult> {
    if (!isValidPlatform(platform)) {
        return { success: false, code: 400, message: "Plataforma inválida." };
    }

    const storagePath = getStorageStatePath(platform);
    if (!fs.existsSync(storagePath)) {
        return { success: false, code: 401, message: "Sessão inexistente." };
    }

    const config = PLATFORM_CONFIG[platform];

    // Valida lendo os cookies salvos e checando o cookie de autenticação (não
    // expirado). Não navega: o LinkedIn/InfoJobs detectam browser headless e
    // requisição crua, derrubando sessões válidas (falso-negativo). O cookie de
    // auth presente e dentro da validade é o sinal confiável.
    try {
        const raw = JSON.parse(fs.readFileSync(storagePath, "utf8")) as {
            cookies?: StoredCookie[];
        };
        const nowSec = Date.now() / 1000;
        const cookies: Cookie[] = (raw.cookies ?? [])
            .filter((c) => c.expires === undefined || c.expires === -1 || c.expires > nowSec)
            .map((c) => ({
                name: c.name,
                value: c.value,
                domain: c.domain,
                path: c.path,
                httpOnly: !!c.httpOnly,
                secure: !!c.secure,
            }));

        if (config.isLoggedIn(cookies)) {
            const session: RunnerSessionState = {
                platform,
                status: "active",
                capturedAt: null,
                lastValidatedAt: new Date().toISOString(),
                storagePath,
            };
            return { success: true, code: 200, message: "Sessão válida.", session };
        }

        return { success: false, code: 401, message: "Sessão expirada." };
    } catch (error) {
        console.error("Session validation failed:", error);
        return { success: false, code: 500, message: "Erro ao validar sessão." };
    }
}

export function removeSessionFiles(platform: RunnerPlatform) {
    if (!isValidPlatform(platform)) {
        return;
    }
    const dir = getPlatformSessionDir(platform);
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
    }
}
