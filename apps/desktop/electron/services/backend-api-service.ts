import { getDesktopWebUrl, getRunnerState } from "../store";

function getAuthToken() {
    const token = getRunnerState().auth.token;

    if (!token) {
        throw new Error("Desktop auth token is missing");
    }

    return token;
}

function getApiUrl(path: string) {
    return `${getDesktopWebUrl()}${path}`;
}

/** Request autenticado cru — para respostas que não são JSON (ex.: o PDF do currículo). */
export async function apiFetch(path: string, options: RequestInit = {}) {
    return fetch(getApiUrl(path), {
        ...options,
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            "Content-Type": "application/json",
            ...options.headers,
        },
    });
}

export async function apiRequest<T>(path: string, options: RequestInit = {}) {
    const response = await apiFetch(path, options);

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
        const message =
            payload && typeof payload === "object" && "message" in payload
                ? String(payload.message)
                : `Request failed with status ${response.status}`;
        throw new Error(message);
    }

    // Resposta ok mas sem JSON = o middleware do Clerk devolveu o HTML do /login (sessão
    // expirada). Sem isso o null vaza pros callers e estoura como ".data of null" longe daqui.
    if (payload === null) {
        throw new Error(`Resposta inválida de ${path} — sessão do desktop expirada, faça login novamente.`);
    }

    return payload as T;
}
