"use client";

import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";
import { createApiClient } from "../lib/api-client";
import { getClerkToken } from "../lib/auth/client/clerk";
import { handleClientError } from "../lib/handle-client-error";
import { toast } from "../lib/toast";
import type { CreateResumeInput, Resume, UpdateResumeInput } from "../types/resume";
import {
    createResume as createResumeRequest,
    deleteResume as deleteResumeRequest,
    getResume as getResumeRequest,
    getResumes as getResumesRequest,
    updateResume as updateResumeRequest,
} from "../client/resume.service";

export function useResumes() {
    const { getToken } = useAuth();

    const { data, error, isLoading, mutate } = useSWR<Resume[]>(
        "resumes",
        async () => {
            const token = await getClerkToken(getToken);

            if (!token) {
                throw new Error("Missing token");
            }

            return getResumesRequest(createApiClient({ token }));
        },
    );

    async function withClient<T>(callback: (api: ReturnType<typeof createApiClient>) => Promise<T>) {
        try {
            const token = await getClerkToken(getToken);

            if (!token) {
                throw new Error("Missing token");
            }

            return await callback(createApiClient({ token }));
        } catch (error) {
            handleClientError(error);
            throw error;
        }
    }

    return {
        resumes: data ?? [],
        error,
        isLoading,
        refetch: () => mutate(),
        async createResume(input: CreateResumeInput) {
            const created = await withClient(async (api) => createResumeRequest(api, input));
            await mutate();
            toast.success("Currículo criado com sucesso!");
            return created;
        },
        async updateResume(id: string, input: UpdateResumeInput) {
            const updated = await withClient(async (api) => updateResumeRequest(api, id, input));
            await mutate((current) => current?.map((resume) => (resume.id === id ? updated : resume)), false);
            toast.success("Currículo atualizado com sucesso!");
            return updated;
        },
        async deleteResume(id: string) {
            await withClient(async (api) => deleteResumeRequest(api, id));
            await mutate((current) => current?.filter((resume) => resume.id !== id), false);
            toast.success("Currículo removido com sucesso!");
        },
    };
}

export function useResume(id: string) {
    const { getToken } = useAuth();

    const swr = useSWR<Resume>(
        id ? `resume:${id}` : null,
        async () => {
            const token = await getClerkToken(getToken);

            if (!token) {
                throw new Error("Missing token");
            }

            return getResumeRequest(createApiClient({ token }), id);
        },
    );

    return swr;
}
