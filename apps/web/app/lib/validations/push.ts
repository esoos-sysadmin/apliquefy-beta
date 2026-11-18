import { parse as legacyParse } from "node:url"
import { z } from "zod"

// O servidor faz POST nesse endpoint (web-push): só serviço de push de navegador, nunca
// um host qualquer (SSRF). Chrome/Edge-Android → FCM; Firefox → Mozilla; Safari → Apple;
// Edge-Windows → WNS.
const PUSH_HOSTS = ["fcm.googleapis.com", "updates.push.services.mozilla.com", "web.push.apple.com"]
const PUSH_SUFFIXES = [".push.apple.com", ".notify.windows.com"]

export function isPushServiceUrl(url: string): boolean {
    // "\\" é lido como "/" por um parser e como texto por outro: nenhum serviço de push usa.
    if (/[\\\s]/.test(url)) return false
    let u: URL
    try {
        u = new URL(url)
    } catch {
        return false
    }
    const host = u.hostname.toLowerCase().replace(/\.$/, "")
    // O web-push monta a requisição com o `url.parse` legado: os dois parsers têm que ler o
    // mesmo host, senão "\\", "@" e afins validam um host e enviam para outro.
    const legacy = legacyParse(url)
    return u.protocol === "https:" && !u.username && !u.password && u.port === ""
        && /^[a-z0-9.-]+$/.test(host)
        && legacy.protocol === "https:" && !legacy.auth && legacy.host?.toLowerCase() === u.host
        && (PUSH_HOSTS.includes(host) || PUSH_SUFFIXES.some((s) => host.endsWith(s)))
}

export const pushSubscribeSchema = z.object({
    endpoint: z.string().max(2000).refine(isPushServiceUrl, "Serviço de push desconhecido"),
    keys: z.object({ p256dh: z.string().min(1).max(500), auth: z.string().min(1).max(500) }),
})
