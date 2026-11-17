/**
 * Fila da nuvem contra um Postgres DESCARTÁVEL (nunca o Neon): apaga as tabelas no início.
 *
 *   docker run -d --rm --name apliquefy-nuvem-test -e POSTGRES_PASSWORD=test \
 *     -e POSTGRES_DB=apliquefy -p 127.0.0.1:55432:5432 postgres:16-alpine
 *   (cd ../../packages/database && DATABASE_URL=$URL npx prisma migrate deploy)
 *   DATABASE_URL=postgresql://postgres:test@127.0.0.1:55432/apliquefy npx tsx backend/cloud-queue.test.ts
 *
 * Trava o que é dinheiro ou exclusividade: o claim pega cada item uma vez só, o débito
 * da nuvem usa o preço do servidor e é idempotente, e o token interno não aceita parecido.
 */
import assert from "node:assert/strict"

const url = process.env.DATABASE_URL ?? ""
if (!/@(127\.0\.0\.1|localhost):55432\//.test(url)) {
    console.error("Recusado: este teste apaga tabelas. Use o Postgres descartável em 127.0.0.1:55432.")
    process.exit(2)
}

async function main() {
    const { prisma } = await import("@repo/database")
    type JP = NonNullable<Awaited<ReturnType<typeof prisma.jobPosting.findFirst>>>
    const code = (r: unknown) => (r as { code?: string }).code
    const first = <T,>(xs: T[]): T => { assert.ok(xs[0]); return xs[0] }
    const { isWorkerToken } = await import("../app/lib/auth/server/worker")
    const { creditsService, flatCost } = await import("./modules/credits/credits.service")
    const { jobPostingService } = await import("./modules/job-posting/job-posting.service")
    const { campaignService } = await import("./modules/campaign/campaign.service")
    const { jobApplicationService } = await import("./modules/job-application/job-application.service")

    // ── token interno ───────────────────────────────────────────────────────────
    const token = "t".repeat(40)
    assert.equal(isWorkerToken(token, token), true)
    assert.equal(isWorkerToken("u".repeat(40), token), false)
    assert.equal(isWorkerToken("t".repeat(39), token), false)
    assert.equal(isWorkerToken(null, token), false)
    assert.equal(isWorkerToken("", ""), false) // env vazio nunca libera
    assert.equal(isWorkerToken(token, undefined), false)

    // ── custo por canal (ADR-08) ────────────────────────────────────────────────
    assert.equal(flatCost("desktop", 0, {}), 1)
    assert.equal(flatCost("cloud", 0, { CLOUD_COST_PER_APPLICATION: "3" }), 3)
    assert.equal(flatCost("cloud", 0, {}), null) // sem preço definido, recusa
    assert.equal(flatCost("cloud", 4, { CLOUD_COST_PER_APPLICATION: "3", CREDIT_COST_PER_QUESTION: "0.5" }), 5)

    // ── dados ───────────────────────────────────────────────────────────────────
    await prisma.$executeRawUnsafe(
        `TRUNCATE "Transaction", job_applications, job_postings, ats_boards, campaign_ats, campaign_linkedin, campaigns, resumes, users CASCADE`,
    )
    await prisma.user.createMany({
        data: [
            { id: "u1", email: "u1@t", credits: 10 },
            { id: "u2", email: "u2@t", credits: 0 },
        ],
    })
    const resume = await prisma.resume.create({ data: { userId: "u1", title: "CV" } as never })
    const c1 = await prisma.campaign.create({
        data: {
            userId: "u1", resumeId: resume.id, name: "nuvem", platform: "ats", status: "active", dailyLimit: 5,
            atsConfig: { create: { searchTerms: "engenheiro de dados", remoteOnly: true, atsAllowlist: ["greenhouse"] } },
        },
    })
    await prisma.campaign.create({
        data: { userId: "u2", name: "sem saldo", platform: "ats", status: "active", resumeId: null, atsConfig: { create: { searchTerms: "x" } } },
    })
    const c3 = await prisma.campaign.create({ data: { userId: "u1", resumeId: resume.id, name: "li", platform: "linkedin", status: "active" } })

    // ── catálogo de vagas ───────────────────────────────────────────────────────
    const posting = (n: number, extra: Record<string, unknown> = {}) => ({
        canonicalUrl: `https://greenhouse.io/acme/jobs/${n}`,
        applyUrl: `https://job-boards.greenhouse.io/embed/job_app?for=acme&token=${n}`,
        ats: "greenhouse", boardToken: "acme", externalId: String(n), title: `Engenheiro de Dados ${n}`,
        companyName: "Acme", source: "ats_api", ...extra,
    })
    let up = await jobPostingService.upsertPostings({ postings: [posting(1), posting(2)] })
    assert.deepEqual(up, { success: true, data: { upserted: 2, created: 2 } })
    up = await jobPostingService.upsertPostings({ postings: [posting(1, { closed: true }), posting(3)] })
    assert.deepEqual(up, { success: true, data: { upserted: 2, created: 1 } })
    assert.ok((await prisma.jobPosting.findUnique({ where: { canonicalUrl: posting(1).canonicalUrl } }))?.closedAt)
    const bad = await jobPostingService.upsertPostings({ postings: [{ ...posting(9), applyUrl: "javascript:alert(1)" }] })
    assert.equal(bad.success, false)
    const [p1, , p3] = (await prisma.jobPosting.findMany({ orderBy: { externalId: "asc" } })) as [JP, JP, JP]

    // ── boards ──────────────────────────────────────────────────────────────────
    const b = { ats: "greenhouse", token: "acme", companyName: "Acme" }
    assert.deepEqual(await jobPostingService.upsertBoards({ boards: [b, b] }), { success: true, data: { created: 1 } })
    assert.deepEqual(await jobPostingService.upsertBoards({ boards: [b] }), { success: true, data: { created: 0 } })
    assert.equal((await jobPostingService.listBoards("greenhouse")).length, 1)
    assert.equal((await jobPostingService.listBoards("lever")).length, 0)

    // ── campanhas ativas ────────────────────────────────────────────────────────
    process.env.CLOUD_COST_PER_APPLICATION = "3"
    let active = await campaignService.listActiveCloudCampaigns()
    assert.deepEqual(active.map((c) => c.campaignId), [c1.id]) // c2 sem saldo, c3 é desktop
    assert.equal(first(active).remainingToday, 5)
    assert.equal(first(active).userId, "u1")
    assert.equal(first(active).resumeId, resume.id)
    assert.deepEqual(first(active).config.atsAllowlist, ["greenhouse"])
    delete process.env.CLOUD_COST_PER_APPLICATION
    assert.deepEqual(await campaignService.listActiveCloudCampaigns(), []) // sem preço, nada enfileira
    process.env.CLOUD_COST_PER_APPLICATION = "3"

    // ── enqueue ─────────────────────────────────────────────────────────────────
    const e1 = await jobApplicationService.enqueueCloud("u1", { campaignId: c1.id, jobPostingId: p1.id })
    assert.equal(e1.success, true)
    const app1 = (e1 as { data: { id: string } }).data
    let row = await prisma.jobApplication.findUniqueOrThrow({ where: { id: app1.id } })
    assert.equal(row.status, "pending")
    assert.equal(row.platform, "ats")
    assert.equal(row.jobUrl, p1.canonicalUrl)
    assert.equal(row.ats, "greenhouse")
    assert.equal(row.jobPostingId, p1.id)
    assert.equal(row.companyName, "Acme")
    assert.equal(code(await jobApplicationService.enqueueCloud("u1", { campaignId: c1.id, jobPostingId: p1.id })), "DUPLICATE")
    assert.equal(code(await jobApplicationService.enqueueCloud("u2", { campaignId: c1.id, jobPostingId: p1.id })), "FORBIDDEN")
    assert.equal(code(await jobApplicationService.enqueueCloud("u1", { campaignId: c3.id, jobPostingId: p1.id })), "FORBIDDEN")
    assert.equal(
        code(await jobApplicationService.enqueueCloud("u1", { campaignId: c1.id, jobPostingId: "00000000-0000-0000-0000-000000000000" })),
        "NOT_FOUND",
    )
    const later = new Date(Date.now() + 3600_000).toISOString()
    const e3 = await jobApplicationService.enqueueCloud("u1", { campaignId: c1.id, jobPostingId: p3.id, runAfter: later })
    assert.equal(e3.success, true)
    active = await campaignService.listActiveCloudCampaigns()
    assert.equal(first(active).remainingToday, 3) // dois pending ocupam vaga do dia

    // ── claim ───────────────────────────────────────────────────────────────────
    let claimed = await jobApplicationService.claimCloud("w1", 10)
    assert.equal(claimed.length, 1) // p3 tem runAfter no futuro
    assert.equal(first(claimed).application.id, app1.id)
    assert.equal(first(claimed).posting?.applyUrl, p1.applyUrl)
    assert.equal(first(claimed).campaign?.resumeId, resume.id)
    assert.equal(first(claimed).campaign?.userId, "u1")
    assert.equal(first(claimed).campaign?.config?.searchTerms, "engenheiro de dados")
    row = await prisma.jobApplication.findUniqueOrThrow({ where: { id: app1.id } })
    assert.equal(row.attempts, 1)
    assert.equal(row.lockedBy, "w1")
    assert.equal((await jobApplicationService.claimCloud("w2", 10)).length, 0) // travado

    // concorrência: dois workers ao mesmo tempo, um item → só um leva
    await prisma.jobApplication.update({ where: { id: e3.success ? (e3 as { data: { id: string } }).data.id : "" }, data: { runAfter: null } })
    const [a, bb] = await Promise.all([jobApplicationService.claimCloud("wa", 10), jobApplicationService.claimCloud("wb", 10)])
    assert.equal(a.length + bb.length, 1)

    // lock velho (worker morreu) volta para a fila; 3 tentativas não voltam
    await prisma.jobApplication.update({ where: { id: app1.id }, data: { lockedAt: new Date(Date.now() - 16 * 60_000) } })
    claimed = await jobApplicationService.claimCloud("w3", 10)
    assert.deepEqual(claimed.map((c) => c.application.id), [app1.id])
    assert.equal((await prisma.jobApplication.findUniqueOrThrow({ where: { id: app1.id } })).attempts, 2)
    await prisma.jobApplication.update({ where: { id: app1.id }, data: { lockedAt: null, attempts: 3 } })
    assert.equal((await jobApplicationService.claimCloud("w4", 10)).length, 0)
    await prisma.jobApplication.update({ where: { id: app1.id }, data: { lockedAt: new Date(), lockedBy: "w3", attempts: 2 } })

    // ── PATCH interno ───────────────────────────────────────────────────────────
    const until = new Date(Date.now() + 600_000).toISOString()
    let patched = await jobApplicationService.patchCloud("u1", app1.id, {
        status: "needs_user", liveViewUrl: "https://live/x", needsUserUntil: until,
    })
    assert.equal(patched.success, true)
    row = await prisma.jobApplication.findUniqueOrThrow({ where: { id: app1.id } })
    assert.equal(row.status, "needs_user")
    assert.equal(row.liveViewUrl, "https://live/x")
    assert.equal(row.lockedBy, "w3") // a sessão segue aberta: o lock fica
    assert.equal(code(await jobApplicationService.patchCloud("u2", app1.id, { status: "failed" })), "NOT_FOUND")
    patched = await jobApplicationService.patchCloud("u1", app1.id, { status: "applied" })
    row = await prisma.jobApplication.findUniqueOrThrow({ where: { id: app1.id } })
    assert.equal(row.status, "applied")
    assert.ok(row.appliedAt)
    assert.equal(row.lockedAt, null)
    assert.equal(row.liveViewUrl, null) // §9.2.5: live view some no status final
    assert.equal(row.needsUserUntil, null)

    // release sem status: só solta o lock
    const other = await prisma.jobApplication.findFirstOrThrow({ where: { jobPostingId: p3.id } })
    assert.ok(other.lockedAt) // levado por wa ou wb acima
    await jobApplicationService.patchCloud("u1", other.id, { errorLog: "worker reiniciou" })
    const released = await prisma.jobApplication.findUniqueOrThrow({ where: { id: other.id } })
    assert.equal(released.lockedAt, null)
    assert.equal(released.status, "pending")

    // ── débito da nuvem ─────────────────────────────────────────────────────────
    const key = `application:${app1.id}`
    const debit = { campaignId: c1.id, jobApplicationId: app1.id, idempotencyKey: key, channel: "cloud" as const }
    let d = await creditsService.debitFlat("u1", debit as never)
    assert.equal(d.success, true)
    assert.equal((d as { data: { creditsDebited: number } }).data.creditsDebited, 3)
    d = await creditsService.debitFlat("u1", debit as never)
    assert.equal((d as { data: { creditsDebited: number } }).data.creditsDebited, 0) // matar o worker e reprocessar não cobra 2x
    assert.equal((await prisma.user.findUniqueOrThrow({ where: { id: "u1" } })).credits, 7)
    delete process.env.CLOUD_COST_PER_APPLICATION
    d = await creditsService.debitFlat("u1", { ...debit, idempotencyKey: "outra" } as never)
    assert.equal(d.success, false)
    assert.equal((d as { code?: string }).code, "CLOUD_PRICE_UNSET")

    await prisma.$disconnect()
    console.log("cloud-queue: ok")
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})
