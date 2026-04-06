import { NextResponse } from "next/server";
import { getAuthSession, getCurrentSessionUser, getDesktopSessionToken } from "../../../lib/auth/server/clerk";

export async function GET() {
    const { userId } = await getAuthSession();

    if (!userId) {
        return NextResponse.json(
            { authenticated: false, message: "User is not authenticated" },
            { status: 401 }
        );
    }

    const { tokenTemplate, token } = await getDesktopSessionToken();
    const user = await getCurrentSessionUser();

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
