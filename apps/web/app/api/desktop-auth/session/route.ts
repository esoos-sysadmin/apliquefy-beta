import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function GET() {
    const { userId, getToken } = await auth();

    if (!userId) {
        return NextResponse.json(
            { authenticated: false, message: "User is not authenticated" },
            { status: 401 }
        );
    }

    const tokenTemplate = process.env.CLERK_DESKTOP_JWT_TEMPLATE ?? "teste";
    const token = await getToken({ template: tokenTemplate });
    const user = await currentUser();

    if (!token) {
        return NextResponse.json(
            {
                authenticated: false,
                message: `No Clerk JWT template available for desktop auth: ${tokenTemplate}`,
            },
            { status: 401 }
        );
    }

    const email = user?.emailAddresses[0]?.emailAddress ?? null;
    const displayName =
        [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
        user?.username ||
        email;

    return NextResponse.json({
        authenticated: true,
        userId,
        email,
        displayName,
        token,
    });
}
