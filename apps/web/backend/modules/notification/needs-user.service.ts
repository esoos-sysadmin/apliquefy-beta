import webpush from "web-push"
import { prisma } from "@repo/database"
import { sendEmail } from "../../../app/lib/email/client"
import { NeedsUser } from "../../../app/lib/email/templates/NeedsUser"

type PushTarget = { endpoint: string; keys: { p256dh: string; auth: string } }
type Send = (sub: PushTarget, payload: string) => Promise<unknown>
type Email = (opts: { to: string; subject: string; react: ReturnType<typeof NeedsUser> }) => Promise<void>

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

function vapidSender(): Send | null {
    const { VAPID_PUBLIC_KEY: publicKey, VAPID_PRIVATE_KEY: privateKey, VAPID_SUBJECT: subject } = process.env
    if (!publicKey || !privateKey || !subject) return null
    // TTL curto: depois do prazo do handoff o aviso não serve para nada.
    return (sub, payload) => webpush.sendNotification(sub, payload, { vapidDetails: { subject, publicKey, privateKey }, TTL: 600 })
}

/**
 * Avisa que uma candidatura da nuvem entrou em `needs_user` (§8, passo 3): push em todas
 * as assinaturas do usuário; assinatura que responde 404/410 é apagada; nenhuma entregue →
 * e-mail. NUNCA lança: o aviso não pode derrubar o PATCH do worker que o disparou.
 * O payload só leva vaga e empresa (vai cifrado pelo protocolo de push).
 */
export async function notifyNeedsUser(
    userId: string,
    app: { id: string; jobTitle: string | null; companyName: string | null },
    deps: { send: Send | null; email: Email } = { send: vapidSender(), email: sendEmail },
): Promise<"push" | "email" | "none"> {
    try {
        const title = "Sua candidatura precisa de você"
        const vaga = `${app.jobTitle ?? "Uma vaga"}${app.companyName ? ` (${app.companyName})` : ""}`
        const url = `/candidaturas/${app.id}/concluir`
        let delivered = 0
        if (deps.send) {
            const subs = await prisma.pushSubscription.findMany({ where: { userId } })
            for (const s of subs) {
                try {
                    await deps.send(
                        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
                        JSON.stringify({ title, body: `${vaga}: resolva a verificação para concluir o envio.`, url }),
                    )
                    delivered++
                } catch (err) {
                    const code = (err as { statusCode?: number }).statusCode
                    if (code === 404 || code === 410) {
                        await prisma.pushSubscription.delete({ where: { id: s.id } }).catch(() => undefined)
                    } else {
                        console.error("[push] falha ao enviar:", code ?? (err as Error).name)
                    }
                }
            }
        }
        if (delivered > 0) return "push"

        const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } })
        if (!user?.email) return "none"
        await deps.email({
            to: user.email,
            subject: title,
            react: NeedsUser({ jobTitle: app.jobTitle, companyName: app.companyName, url: `${APP_URL}${url}` }),
        })
        return "email"
    } catch (err) {
        console.error("[notify] needs_user:", (err as Error).name)
        return "none"
    }
}
