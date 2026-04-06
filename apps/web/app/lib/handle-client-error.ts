"use client";

import { ApiError } from "./api-client";
import { toast } from "./toast";

export function handleClientError(error: unknown, fallbackMessage = "Erro inesperado. Tente novamente.") {
    if (error instanceof ApiError) {
        switch (error.status) {
            case 400:
                toast.error(error.message || "Dados inválidos. Verifique os campos.");
                break;
            case 401:
                toast.error("Sessão expirada. Faça login novamente.");
                if (typeof window !== "undefined") {
                    window.setTimeout(() => {
                        window.location.assign("/login");
                    }, 300);
                }
                break;
            case 403:
                toast.error("Sem permissão para acessar este recurso.");
                break;
            case 404:
                toast.error("Recurso não encontrado.");
                break;
            case 409:
                toast.error("Registro duplicado.");
                break;
            default:
                toast.error(error.message || fallbackMessage);
        }
        return;
    }

    toast.error(fallbackMessage);
}
