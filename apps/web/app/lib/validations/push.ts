import { z } from "zod"

// O servidor faz POST nesse endpoint (web-push): só serviço de push de navegador, nunca
// um host qualquer (SSRF). Chrome/Edge-Android → FCM; Firefox → Mozilla; Safari → Apple;
// Edge-Windows → WNS.
const PUSH_HOSTS = ["fcm.googleapis.com", "updates.push.services.mozilla.com", "web.push.apple.com"]
const PUSH_SUFFIXES = [".push.apple.com", ".notify.windows.com"]

export function isPushServiceUrl(url: string): boolean {
    let u: URL
    try {
        u = new URL(url)
    } catch {
        return false
    }
    const host = u.hostname.toLowerCase().replace(/\.$/, "")
    return u.protocol === "https:" && !u.username && !u.password && u.port === ""
        && (PUSH_HOSTS.includes(host) || PUSH_SUFFIXES.some((s) => host.endsWith(s)))
}

export const pushSubscribeSchema = z.object({
    endpoint: z.string().max(2000).refine(isPushServiceUrl, "Serviço de push desconhecido"),
    keys: z.object({ p256dh: z.string().min(1).max(500), auth: z.string().min(1).max(500) }),
})
