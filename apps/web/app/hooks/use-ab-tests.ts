"use client";

import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";
import { createApiClient } from "../lib/api-client";
import { getClerkToken } from "../lib/auth/client/clerk";
import { handleClientError } from "../lib/handle-client-error";
import { toast } from "../lib/toast";
import {
    createAbTest as createAbTestRequest,
    deleteAbTest as deleteAbTestRequest,
    getAbTest as getAbTestRequest,
    getAbTests as getAbTestsRequest,
    setApplicationOutcome as setApplicationOutcomeRequest,
    updateAbTest as updateAbTestRequest,
} from "../client/ab-test.service";
import type { AbTest, AbTestDetail, AbTestWinner, CreateAbTestInput } from "../types/ab-test";

async function withToken<T>(getToken: ReturnType<typeof useAuth>["getToken"], callback: (api: ReturnType<typeof createApiClient>) => Promise<T>) {
    const token = await getClerkToken(getToken);
    if (!token) throw new Error("Missing token");
    return callback(createApiClient({ token }));
}

export function useAbTests() {
    const { getToken } = useAuth();

    const { data, error, isLoading, mutate } = useSWR<AbTest[]>("ab-tests", () =>
        withToken(getToken, (api) => getAbTestsRequest(api)),
    );

    async function guarded<T>(callback: (api: ReturnType<typeof createApiClient>) => Promise<T>) {
        try {
            return await withToken(getToken, callback);
        } catch (error) {
            handleClientError(error);
            throw error;
        }
    }

    return {
        abTests: data ?? [],
        error,
        isLoading,
        refetch: () => mutate(),
        async createAbTest(input: CreateAbTestInput) {
            const created = await guarded((api) => createAbTestRequest(api, input));
            await mutate();
            toast.success("Teste A/B criado com sucesso!");
            return created;
        },
        async deleteAbTest(id: string) {
            await guarded((api) => deleteAbTestRequest(api, id));
            await mutate((current) => current?.filter((t) => t.id !== id), false);
            toast.success("Teste A/B removido com sucesso!");
        },
    };
}

export function useAbTest(id: string | null) {
    const { getToken } = useAuth();

    const { data, error, isLoading, mutate } = useSWR<AbTestDetail>(
        id ? ["ab-test", id] : null,
        () => withToken(getToken, (api) => getAbTestRequest(api, id as string)),
    );

    async function guarded<T>(callback: (api: ReturnType<typeof createApiClient>) => Promise<T>) {
        try {
            return await withToken(getToken, callback);
        } catch (error) {
            handleClientError(error);
            throw error;
        }
    }

    return {
        abTest: data,
        error,
        isLoading,
        refetch: () => mutate(),
        async setOutcome(applicationId: string, outcome: { gotResponse?: boolean; gotInterview?: boolean }) {
            await guarded((api) => setApplicationOutcomeRequest(api, applicationId, outcome));
            await mutate();
        },
        async setWinner(winner: AbTestWinner) {
            if (!id) return;
            await guarded((api) => updateAbTestRequest(api, id, { winner }));
            await mutate();
            toast.success("Resultado do teste registrado!");
        },
    };
}
