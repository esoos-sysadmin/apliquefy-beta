import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { prisma } from "@repo/database";

type ClerkUserCreatedEvent = {
    type: "user.created";
    data: {
        id: string;
        email_addresses: { email_address: string }[];
    };
};

export async function POST(request: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        return NextResponse.json({ message: "Webhook secret não configurado" }, { status: 500 });
    }

    const headersList = await headers();
    const svix_id = headersList.get("svix-id");
    const svix_timestamp = headersList.get("svix-timestamp");
    const svix_signature = headersList.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return NextResponse.json({ message: "Headers do svix ausentes" }, { status: 400 });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(WEBHOOK_SECRET);

    let event: ClerkUserCreatedEvent;

    try {
        event = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as ClerkUserCreatedEvent;
    } catch {
        return NextResponse.json({ message: "Assinatura do webhook inválida" }, { status: 400 });
    }

    if (event.type === "user.created") {
        const { id, email_addresses } = event.data;
        const email = email_addresses[0]?.email_address;

        if (!email) {
            return NextResponse.json({ message: "Evento de teste, sem email" }, { status: 200 });
        }

        await prisma.user.create({
            data: {
                id,
                email,
                credits: 100,
                gatewayCustomerId: "",
            },
        });
    }

    return NextResponse.json({ message: "ok" }, { status: 200 });
}
