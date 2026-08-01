const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export interface ApiClientOptions {
    token: string;
}

export class ApiError extends Error {
    status: number;
    details?: unknown;

    constructor(status: number, message: string, details?: unknown) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.details = details;
    }
}

export function createApiClient({ token }: ApiClientOptions) {
    async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const headers: Record<string, string> = {
            Authorization: `Bearer ${token}`,
            ...(options.headers as Record<string, string> | undefined),
        };
        // FormData define o próprio Content-Type (com boundary); só JSON é forçado aqui
        if (!(options.body instanceof FormData)) {
            headers["Content-Type"] = headers["Content-Type"] ?? "application/json";
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

        const isJson = response.headers.get("content-type")?.includes("application/json");
        const payload = isJson ? await response.json().catch(() => null) : await response.text().catch(() => null);

        if (!response.ok) {
            const message =
                typeof payload === "object" && payload && "message" in payload
                    ? String(payload.message)
                    : typeof payload === "string" && payload
                      ? payload
                      : "Request failed";

            const details =
                typeof payload === "object" && payload
                    ? ("errorS" in payload ? payload.errorS : "errorDesc" in payload ? payload.errorDesc : undefined)
                    : undefined;

            throw new ApiError(response.status, message, details);
        }

        return payload as T;
    }

    return {
        get: <T>(endpoint: string) => request<T>(endpoint),
        post: <T>(endpoint: string, body: unknown) =>
            request<T>(endpoint, { method: "POST", body: JSON.stringify(body) }),
        postForm: <T>(endpoint: string, body: FormData) => request<T>(endpoint, { method: "POST", body }),
        put: <T>(endpoint: string, body: unknown) =>
            request<T>(endpoint, { method: "PUT", body: JSON.stringify(body) }),
        patch: <T>(endpoint: string, body?: unknown) =>
            request<T>(endpoint, {
                method: "PATCH",
                ...(body === undefined ? {} : { body: JSON.stringify(body) }),
            }),
        delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
    };
}

export type ApiClient = ReturnType<typeof createApiClient>;
