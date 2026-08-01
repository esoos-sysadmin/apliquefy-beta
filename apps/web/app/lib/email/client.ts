import { Resend } from "resend";
import type { ReactElement } from "react";

const apiKey = process.env.RESEND_API_KEY;
// Domínio verificado no Resend. `onboarding@resend.dev` só entrega ao dono da conta (dev).
const from = process.env.EMAIL_FROM || "Apliquefy <onboarding@resend.dev>";

const resend = apiKey ? new Resend(apiKey) : null;

/**
 * Envia um email transacional. NUNCA lança: um erro de email não pode derrubar o
 * fluxo que o disparou (ex.: webhook do Stripe — se lançar, o Stripe re-tenta e
 * reenvia o email). Falhas são logadas e engolidas.
 */
export async function sendEmail(opts: { to: string; subject: string; react: ReactElement }): Promise<void> {
    if (!resend) {
        console.warn("[email] RESEND_API_KEY ausente — email não enviado:", opts.subject);
        return;
    }
    try {
        const { error } = await resend.emails.send({
            from,
            to: opts.to,
            subject: opts.subject,
            react: opts.react,
        });
        if (error) console.error("[email] falha ao enviar:", opts.subject, error);
    } catch (err) {
        console.error("[email] erro inesperado ao enviar:", opts.subject, err);
    }
}
