"use client";

import { useEffect, useState } from "react";
import { Bell, BellRing } from "lucide-react";
import { useAuthenticatedClient } from "../../lib/auth/client/clerk";

const VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function base64UrlToBytes(value: string): Uint8Array<ArrayBuffer> {
    const base64 = (value + "=".repeat((4 - (value.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/");
    return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

// Liga o aviso de "precisa de você" (§6.5). No iOS só existe com o app instalado na tela
// inicial; sem suporte ou sem chave VAPID o botão nem aparece (o aviso cai no e-mail).
export function PushToggle() {
    const { getClient } = useAuthenticatedClient();
    const [state, setState] = useState<"unsupported" | "off" | "on" | "busy" | "denied">("unsupported");

    useEffect(() => {
        if (!VAPID_KEY || !("serviceWorker" in navigator) || !("PushManager" in window)) return;
        if (Notification.permission === "denied") return setState("denied");
        navigator.serviceWorker
            .register("/sw.js")
            .then((reg) => reg.pushManager.getSubscription())
            .then((sub) => setState(sub ? "on" : "off"))
            .catch(() => setState("unsupported"));
    }, []);

    async function enable() {
        if (!VAPID_KEY) return;
        setState("busy");
        try {
            const reg = await navigator.serviceWorker.register("/sw.js");
            const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: base64UrlToBytes(VAPID_KEY) });
            await (await getClient()).post("/push/subscribe", sub.toJSON());
            setState("on");
        } catch {
            setState(Notification.permission === "denied" ? "denied" : "off");
        }
    }

    if (state === "unsupported") return null;
    return (
        <button
            type="button"
            onClick={enable}
            disabled={state !== "off"}
            className="mb-2 flex min-h-[44px] w-full lg:min-h-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-muted transition hover:bg-sunken hover:text-fg disabled:cursor-default disabled:hover:bg-transparent"
        >
            {state === "on" ? <BellRing size={16} /> : <Bell size={16} />}
            {state === "on" ? "Avisos ligados" : state === "denied" ? "Avisos bloqueados no navegador" : state === "busy" ? "Ativando…" : "Ativar avisos no celular"}
        </button>
    );
}
