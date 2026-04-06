import { auth, currentUser } from "@clerk/nextjs/server";

export async function getAuthSession(): Promise<Awaited<ReturnType<typeof auth>>> {
    return auth();
}

export async function getCurrentSessionUser() {
    return currentUser();
}

export async function requireUserId() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("UNAUTHENTICATED");
    }

    return userId;
}

export async function getDesktopSessionToken() {
    const { getToken } = await auth();
    const tokenTemplate = process.env.CLERK_DESKTOP_JWT_TEMPLATE ?? "teste";

    return {
        tokenTemplate,
        token: await getToken({ template: tokenTemplate }),
    };
}
