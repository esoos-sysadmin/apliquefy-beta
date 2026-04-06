"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import type { GetToken } from "@clerk/types";
import { createApiClient } from "../../api-client";

export async function getClerkToken(getToken: GetToken) {
    const template = process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE;
    return template ? getToken({ template }) : getToken();
}

export function useAuthenticatedClient() {
    const { getToken } = useAuth();

    async function getClient() {
        const token = await getClerkToken(getToken);

        if (!token) {
            throw new Error("Missing token");
        }

        return createApiClient({ token });
    }

    return { getClient };
}

export function useSessionUser() {
    const { user, isLoaded, isSignedIn } = useUser();

    return {
        user,
        isLoaded,
        isSignedIn,
    };
}
