"use client";

import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";
import { createApiClient } from "../lib/api-client";
import { getClerkToken } from "../lib/auth/client/clerk";
import { handleClientError } from "../lib/handle-client-error";
import { toast } from "../lib/toast";
import type {
    Campaign,
    CreateInfojobsCampaignInput,
    CreateLinkedinCampaignInput,
    UpdateCampaignInput,
} from "../types/campaign";
import {
    activateCampaign as activateCampaignRequest,
    createInfojobsCampaign as createInfojobsCampaignRequest,
    createLinkedinCampaign as createLinkedinCampaignRequest,
    deleteCampaign as deleteCampaignRequest,
    getCampaigns as getCampaignsRequest,
    pauseCampaign as pauseCampaignRequest,
    updateCampaign as updateCampaignRequest,
} from "../client/campaign.service";

export function useCampaigns() {
    const { getToken } = useAuth();

    const { data, error, isLoading, mutate } = useSWR<Campaign[]>(
        "campaigns",
        async () => {
            const token = await getClerkToken(getToken);

            if (!token) {
                throw new Error("Missing token");
            }

            return getCampaignsRequest(createApiClient({ token }));
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
        campaigns: data ?? [],
        error,
        isLoading,
        refetch: () => mutate(),
        async createLinkedinCampaign(input: CreateLinkedinCampaignInput) {
            const created = await withClient(async (api) => createLinkedinCampaignRequest(api, input));
            await mutate();
            toast.success("Campanha LinkedIn criada com sucesso!");
            return created;
        },
        async createInfojobsCampaign(input: CreateInfojobsCampaignInput) {
            const created = await withClient(async (api) => createInfojobsCampaignRequest(api, input));
            await mutate();
            toast.success("Campanha InfoJobs criada com sucesso!");
            return created;
        },
        async updateCampaign(id: string, input: UpdateCampaignInput) {
            const updated = await withClient(async (api) => updateCampaignRequest(api, id, input));
            await mutate((current) => current?.map((campaign) => (campaign.id === id ? { ...campaign, ...updated } : campaign)), false);
            toast.success("Campanha atualizada com sucesso!");
            return updated;
        },
        async pauseCampaign(id: string) {
            const previous = data ?? [];
            await mutate((current) => current?.map((campaign) => (campaign.id === id ? { ...campaign, status: "paused" } : campaign)), false);

            try {
                const updated = await withClient(async (api) => pauseCampaignRequest(api, id));
                await mutate((current) => current?.map((campaign) => (campaign.id === id ? { ...campaign, ...updated } : campaign)), false);
                toast.success("Campanha pausada com sucesso!");
                return updated;
            } catch (error) {
                await mutate(previous, false);
                throw error;
            }
        },
        async activateCampaign(id: string) {
            const previous = data ?? [];
            await mutate((current) => current?.map((campaign) => (campaign.id === id ? { ...campaign, status: "active" } : campaign)), false);

            try {
                const updated = await withClient(async (api) => activateCampaignRequest(api, id));
                await mutate((current) => current?.map((campaign) => (campaign.id === id ? { ...campaign, ...updated } : campaign)), false);
                toast.success("Campanha ativada com sucesso!");
                return updated;
            } catch (error) {
                await mutate(previous, false);
                throw error;
            }
        },
        async deleteCampaign(id: string) {
            await withClient(async (api) => deleteCampaignRequest(api, id));
            await mutate((current) => current?.filter((campaign) => campaign.id !== id), false);
            toast.success("Campanha removida com sucesso!");
        },
    };
}
