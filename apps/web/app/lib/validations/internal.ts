import { z } from "zod"

// Corpos das rotas /api/internal/* (worker da nuvem, SDD-candidatura-nuvem §6.2).
// O worker é confiável quanto à identidade (token), não quanto ao conteúdo: o que vem de
// fonte externa (vaga do Apify/ATS) é validado como entrada de terceiro.

const httpsUrl = z.string().url().max(2048).refine((u) => u.startsWith("https://"), "URL precisa ser https")
const text = (max: number) => z.string().trim().max(max)
// Token de board vira caminho de URL na descoberta: só slug simples.
const boardToken = z.string().regex(/^[A-Za-z0-9_-]{1,100}$/, "token de board inválido")

export const jobPostingInputSchema = z.object({
    canonicalUrl: httpsUrl,
    applyUrl: httpsUrl,
    ats: text(40).min(1),
    boardToken: boardToken.optional().nullable(),
    externalId: text(200).optional().nullable(),
    title: text(500).min(1),
    companyName: text(300).optional().nullable(),
    location: text(500).optional().nullable(),
    isRemote: z.boolean().optional().nullable(),
    // Texto puro; corta em vez de recusar: descrição longa não invalida a vaga.
    description: z.string().optional().nullable().transform((d) => (d ? d.slice(0, 20_000) : d)),
    postedAt: z.string().datetime({ offset: true }).optional().nullable(),
    closed: z.boolean().optional(),
    source: z.enum(["ats_api", "apify_linkedin"]),
    sourceRef: text(200).optional().nullable(),
})

export const upsertPostingsSchema = z.object({ postings: z.array(jobPostingInputSchema).min(1).max(500) })

export const upsertBoardsSchema = z.object({
    boards: z
        .array(z.object({ ats: text(40).min(1), token: boardToken, companyName: text(300).optional().nullable() }))
        .min(1)
        .max(500),
})

export const enqueueSchema = z.object({
    campaignId: z.string().uuid(),
    jobPostingId: z.string().uuid(),
    runAfter: z.string().datetime({ offset: true }).optional().nullable(),
})

export const claimSchema = z.object({
    workerId: text(200).min(1),
    limit: z.coerce.number().int().min(1).max(20),
    // ATS que o worker envia hoje (SUPPORTED_ATS): pausado não é pego nem gasta tentativa.
    ats: z.array(text(40).min(1)).min(1).max(20),
})

export const candidatesQuerySchema = z.object({
    userId: z.string().min(1).max(200),
    ats: z.string().transform((s) => s.split(",").map((x) => x.trim()).filter(Boolean)).pipe(z.array(z.string().max(40)).min(1).max(20)),
    limit: z.coerce.number().int().min(1).max(2000).default(1000),
})

export const patchCloudApplicationSchema = z.object({
    status: z.enum(["pending", "applied", "failed", "skipped", "needs_user"]).optional(),
    errorLog: z.string().max(4000).optional().nullable(),
    liveViewUrl: httpsUrl.optional().nullable(),
    needsUserUntil: z.string().datetime({ offset: true }).optional().nullable(),
    runAfter: z.string().datetime({ offset: true }).optional().nullable(),
})

// userId no corpo/query: o worker atende vários usuários e não tem sessão de nenhum.
// O service refaz a checagem de dono com ele (§6.1).
export const userIdSchema = z.string().min(1).max(200)

export type JobPostingInput = z.input<typeof jobPostingInputSchema>
export type EnqueueInput = z.input<typeof enqueueSchema>
export type PatchCloudApplicationInput = z.input<typeof patchCloudApplicationSchema>
