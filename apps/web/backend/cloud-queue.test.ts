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
    assert.deepEqual(up, { success: true, data: { upserted: 2, created: 2, rejected: 0 } })
    up = await jobPostingService.upsertPostings({ postings: [posting(1, { closed: true }), posting(3)] })
    assert.deepEqual(up, { success: true, data: { upserted: 2, created: 1, rejected: 0 } })
    assert.ok((await prisma.jobPosting.findUnique({ where: { canonicalUrl: posting(1).canonicalUrl } }))?.closedAt)
    // Uma vaga torta não derruba o lote; host que só PARECE o do ATS é recusado.
    const mixed = await jobPostingService.upsertPostings({ postings: [
        { ...posting(9), applyUrl: "javascript:alert(1)" },
        { ...posting(8), applyUrl: "https://boards.greenhouse.io.evil.example/acme/jobs/8" },
        { ...posting(7), title: "" },
        posting(2),
    ] })
    assert.deepEqual(mixed, { success: true, data: { upserted: 1, created: 0, rejected: 3 } })
    const [p1, , p3] = (await prisma.jobPosting.findMany({ orderBy: { externalId: "asc" } })) as [JP, JP, JP]

    // ── boards ──────────────────────────────────────────────────────────────────
    const b = { ats: "greenhouse", token: "acme", companyName: "Acme" }
    assert.deepEqual(await jobPostingService.upsertBoards({ boards: [b, b] }), { success: true, data: { created: 1 } })
    assert.deepEqual(await jobPostingService.upsertBoards({ boards: [b] }), { success: true, data: { created: 0 } })
    assert.equal((await jobPostingService.upsertBoards({ boards: [{ ats: "lever", token: "../x" }] })).success, false)
    assert.equal((await jobPostingService.listBoards("greenhouse")).length, 1)
    assert.equal((await jobPostingService.listBoards("lever")).length, 0)

    // ── campanhas ativas ────────────────────────────────────────────────────────
    process.env.CLOUD_COST_PER_APPLICATION = "3"
    let active = await campaignService.listActiveCloudCampaigns()
    assert.deepEqual(active.map((c) => c.campaignId), [c1.id]) // c2 sem saldo, c3 é desktop
    assert.equal(first(active).remainingToday, 3) // limite 5, mas o saldo (10) só paga 3 envios de 3
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
    assert.equal(first(active).remainingToday, 1) // dois pending já comprometem 6 dos 10 créditos
    // o saldo é do usuário, não da campanha: duas campanhas dividem a mesma folga
    const c4 = await prisma.campaign.create({
        data: { userId: "u1", resumeId: resume.id, name: "nuvem 2", platform: "ats", status: "active", atsConfig: { create: { searchTerms: "x" } } },
    })
    active = await campaignService.listActiveCloudCampaigns()
    assert.equal(active.reduce((n, c) => n + c.remainingToday, 0), 1)
    await campaignService.deleteCampaign("u1", c4.id)

    // ── candidatas ao matching ──────────────────────────────────────────────────
    // p1 e p3 já estão na fila do u1; p2 está aberta e é do greenhouse
    let cands = await jobPostingService.listCandidates("u1", ["greenhouse"], 100)
    assert.deepEqual(cands.map((c) => c.externalId), ["2"])
    assert.equal("description" in first(cands), false) // payload leve: a descrição não vai
    assert.equal((await jobPostingService.listCandidates("u2", ["greenhouse"], 100)).length, 2) // p1 fechou
    assert.equal((await jobPostingService.listCandidates("u2", ["lever"], 100)).length, 0)
    // termos filtram no banco: sem isso o corte de `limit` pegava só as vagas mais novas do mundo
    assert.equal((await jobPostingService.listCandidates("u2", ["greenhouse"], 100, "designer")).length, 0)
    assert.equal((await jobPostingService.listCandidates("u2", ["greenhouse"], 100, "designer, engenheiro de dados")).length, 2)
    await prisma.jobPosting.updateMany({ where: { externalId: "2" }, data: { lastSeenAt: new Date(Date.now() - 49 * 3600_000) } })
    cands = await jobPostingService.listCandidates("u2", ["greenhouse"], 100)
    assert.deepEqual(cands.map((c) => c.externalId), ["3"]) // não vista há 48 h: fora

    // ── claim ───────────────────────────────────────────────────────────────────
    // ATS pausado (fora de SUPPORTED_ATS no worker) não é pego nem gasta tentativa
    assert.equal((await jobApplicationService.claimCloud("w0", 10, ["lever"])).length, 0)
    assert.equal((await prisma.jobApplication.findUniqueOrThrow({ where: { id: app1.id } })).attempts, 0)
    // campanha pausada: a fila dela para de sair
    await prisma.campaign.update({ where: { id: c1.id }, data: { status: "paused" } })
    assert.equal((await jobApplicationService.claimCloud("wp", 10, ["greenhouse"])).length, 0)
    await prisma.campaign.update({ where: { id: c1.id }, data: { status: "active" } })
    // preço da nuvem retirado do env: nada sai (sairia de graça)
    delete process.env.CLOUD_COST_PER_APPLICATION
    assert.equal((await jobApplicationService.claimCloud("wq", 10, ["greenhouse"])).length, 0)
    process.env.CLOUD_COST_PER_APPLICATION = "3"
    assert.equal((await prisma.jobApplication.findUniqueOrThrow({ where: { id: app1.id } })).attempts, 0)
    let claimed = await jobApplicationService.claimCloud("w1", 10, ["greenhouse"])
    assert.equal(claimed.length, 1) // p3 tem runAfter no futuro
    assert.equal(first(claimed).application.id, app1.id)
    assert.equal(first(claimed).posting?.applyUrl, p1.applyUrl)
    assert.equal(first(claimed).campaign?.resumeId, resume.id)
    assert.equal(first(claimed).campaign?.userId, "u1")
    assert.equal(first(claimed).campaign?.config?.searchTerms, "engenheiro de dados")
    row = await prisma.jobApplication.findUniqueOrThrow({ where: { id: app1.id } })
    assert.equal(row.attempts, 1)
    assert.equal(row.lockedBy, "w1")
    assert.equal((await jobApplicationService.claimCloud("w2", 10, ["greenhouse"])).length, 0) // travado

    // concorrência: dois workers ao mesmo tempo, um item → só um leva
    await prisma.jobApplication.update({ where: { id: e3.success ? (e3 as { data: { id: string } }).data.id : "" }, data: { runAfter: null } })
    const [a, bb] = await Promise.all([jobApplicationService.claimCloud("wa", 10, ["greenhouse"]), jobApplicationService.claimCloud("wb", 10, ["greenhouse"])])
    assert.equal(a.length + bb.length, 1)

    // lock velho (worker morreu) volta para a fila; 3 tentativas não voltam
    await prisma.jobApplication.update({ where: { id: app1.id }, data: { lockedAt: new Date(Date.now() - 16 * 60_000) } })
    claimed = await jobApplicationService.claimCloud("w3", 10, ["greenhouse"])
    assert.deepEqual(claimed.map((c) => c.application.id), [app1.id])
    assert.equal((await prisma.jobApplication.findUniqueOrThrow({ where: { id: app1.id } })).attempts, 2)
    await prisma.jobApplication.update({ where: { id: app1.id }, data: { lockedAt: null, attempts: 3 } })
    assert.equal((await jobApplicationService.claimCloud("w4", 10, ["greenhouse"])).length, 0)
    // item esgotado não ocupa o limite do dia nem o saldo (senão a campanha emperra)
    assert.equal(first(await campaignService.listActiveCloudCampaigns()).remainingToday, 2)
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
    // worker atrasado (lock vencido, outro worker já enviou) não reverte applied nem reembolsa
    assert.equal(code(await jobApplicationService.patchCloud("u1", app1.id, { status: "failed", errorLog: "DESAFIO: x" })), "CONFLICT")
    assert.equal((await prisma.jobApplication.findUniqueOrThrow({ where: { id: app1.id } })).status, "applied")

    // release sem status: só solta o lock
    const other = await prisma.jobApplication.findFirstOrThrow({ where: { jobPostingId: p3.id } })
    assert.ok(other.lockedAt) // levado por wa ou wb acima
    await jobApplicationService.patchCloud("u1", other.id, { errorLog: "worker reiniciou" })
    const released = await prisma.jobApplication.findUniqueOrThrow({ where: { id: other.id } })
    assert.equal(released.lockedAt, null)
    assert.equal(released.status, "pending")
    // na 3ª tentativa o release vira failed (o varredor completo é da Fase 3)
    await prisma.jobApplication.update({ where: { id: other.id }, data: { attempts: 3, lockedAt: new Date() } })
    await jobApplicationService.patchCloud("u1", other.id, { errorLog: "ERRO: Timeout" })
    const exhausted = await prisma.jobApplication.findUniqueOrThrow({ where: { id: other.id } })
    assert.equal(exhausted.status, "failed")
    assert.equal(exhausted.errorLog, "TENTATIVAS: ERRO: Timeout")

    // ── débito da nuvem ─────────────────────────────────────────────────────────
    const key = `application:${app1.id}`
    // O preço vem da candidatura, não do chamador: a rota pública com channel=desktop
    // numa candidatura da nuvem paga o preço da nuvem.
    const debit = { campaignId: c1.id, jobApplicationId: app1.id, idempotencyKey: key, channel: "desktop" }
    assert.equal(code(await creditsService.debitFlat("u2", debit as never)), "NOT_FOUND") // candidatura de outro
    let d = await creditsService.debitFlat("u1", debit as never)
    assert.equal(d.success, true)
    assert.equal((d as { data: { creditsDebited: number } }).data.creditsDebited, 3)
    d = await creditsService.debitFlat("u1", debit as never)
    assert.equal((d as { data: { creditsDebited: number } }).data.creditsDebited, 0) // matar o worker e reprocessar não cobra 2x
    assert.equal((await prisma.user.findUniqueOrThrow({ where: { id: "u1" } })).credits, 7)
    // A chave é da candidatura: registrar "application:<nuvem>" apontando para uma
    // candidatura barata do desktop faria o débito real da nuvem sair idempotente (0).
    const cheap = await prisma.jobApplication.create({ data: { userId: "u1", campaignId: c3.id, platform: "linkedin", jobUrl: "https://linkedin.com/jobs/view/2" } })
    const other3 = await prisma.jobApplication.findFirstOrThrow({ where: { jobPostingId: p3.id } })
    d = await creditsService.debitFlat("u1", { campaignId: c3.id, jobApplicationId: cheap.id, idempotencyKey: `application:${other3.id}` } as never)
    assert.equal(code(d), "INVALID_KEY")
    // desktop continua 1 crédito por padrão
    const li = await prisma.jobApplication.create({ data: { userId: "u1", campaignId: c3.id, platform: "linkedin", jobUrl: "https://linkedin.com/jobs/view/1" } })
    d = await creditsService.debitFlat("u1", { campaignId: c3.id, jobApplicationId: li.id, idempotencyKey: `application:${li.id}` } as never)
    assert.equal((d as { data: { creditsDebited: number } }).data.creditsDebited, 1)
    delete process.env.CLOUD_COST_PER_APPLICATION
    d = await creditsService.debitFlat("u1", { ...debit, jobApplicationId: other3.id, idempotencyKey: `application:${other3.id}` } as never)
    assert.equal(d.success, false)
    assert.equal((d as { code?: string }).code, "CLOUD_PRICE_UNSET")

    // ── vaga reprovada no fit gate nasce skipped, numa escrita só (ADR-07) ─────────
    await prisma.jobPosting.create({ data: { ...posting(42), lastSeenAt: new Date() } as never })
    const p42 = await prisma.jobPosting.findUniqueOrThrow({ where: { canonicalUrl: posting(42).canonicalUrl } })
    const sk = await jobApplicationService.enqueueCloud("u1", { campaignId: c1.id, jobPostingId: p42.id, skipReason: "FIT: aderência 30/100" })
    assert.equal(sk.success, true)
    const skRow = await prisma.jobApplication.findUniqueOrThrow({ where: { id: (sk as { data: { id: string } }).data.id } })
    assert.equal(skRow.status, "skipped")
    assert.equal(skRow.errorLog, "FIT: aderência 30/100")
    assert.ok(!(await jobApplicationService.claimCloud("w9", 20, ["greenhouse"])).some((i) => i.application.id === skRow.id))

    // ── descrição para o fit gate (ADR-07) ──────────────────────────────────────
    assert.equal((await jobPostingService.getDescription(p1.id))?.description, p1.description)
    assert.equal(await jobPostingService.getDescription("nao-e-uuid"), null)

    // ── varredor (§7.6) ─────────────────────────────────────────────────────────
    const ago = (min: number) => new Date(Date.now() - min * 60_000)
    const mk = (jobUrl: string, data: object) => prisma.jobApplication.create({
        data: { userId: "u1", campaignId: c1.id, platform: "ats", ats: "greenhouse", jobUrl, ...data } as never,
    })
    const expiredH = await mk("https://s/1", { status: "needs_user", needsUserUntil: ago(6), liveViewUrl: "https://live/1", lockedAt: ago(16) })
    const graceH = await mk("https://s/2", { status: "needs_user", needsUserUntil: ago(1), liveViewUrl: "https://live/2", lockedAt: ago(11) })
    const dead = await mk("https://s/3", { status: "pending", attempts: 3, lockedAt: ago(16), errorLog: "ERRO: X" })
    const busy = await mk("https://s/4", { status: "pending", attempts: 3, lockedAt: ago(1) })
    const fresh = await mk("https://s/5", { status: "pending", attempts: 1 })
    assert.equal(await jobApplicationService.sweepCloud(), 2)
    const st = async (id: string) => prisma.jobApplication.findUniqueOrThrow({ where: { id } })
    const h = await st(expiredH.id)
    assert.equal(h.status, "failed")
    assert.equal(h.errorLog, "HANDOFF: tempo esgotado")
    assert.equal(h.liveViewUrl, null) // §9.2.5
    assert.equal((await st(graceH.id)).status, "needs_user") // o worker vivo encerra o próprio handoff
    const d2 = await st(dead.id)
    assert.equal(d2.status, "failed")
    assert.equal(d2.errorLog, "TENTATIVAS: ERRO: X")
    assert.equal((await st(busy.id)).status, "pending") // ainda na mão de um worker
    assert.equal((await st(fresh.id)).status, "pending")
    assert.equal(await jobApplicationService.sweepCloud(), 0) // reexecutar não mexe em nada
    assert.equal(await prisma.transaction.count({ where: { metadata: { path: ["jobApplicationId"], equals: expiredH.id } } }), 0)

    // ── assinatura de push: só serviço de push conhecido (SSRF) ─────────────────
    const { isPushServiceUrl } = await import("../app/lib/validations/push")
    assert.equal(isPushServiceUrl("https://fcm.googleapis.com/fcm/send/abc"), true)
    assert.equal(isPushServiceUrl("https://web.push.apple.com/QK"), true)
    assert.equal(isPushServiceUrl("https://wns2-par02p.notify.windows.com/w/?token=x"), true)
    assert.equal(isPushServiceUrl("https://169.254.169.254/latest"), false)
    assert.equal(isPushServiceUrl("https://fcm.googleapis.com.evil.example/x"), false)
    assert.equal(isPushServiceUrl("https://evil.example/?h=fcm.googleapis.com"), false)
    assert.equal(isPushServiceUrl("http://fcm.googleapis.com/x"), false)
    assert.equal(isPushServiceUrl("https://fcm.googleapis.com:8443/x"), false)
    // diferença entre parsers (o web-push usa url.parse legado)
    assert.equal(isPushServiceUrl("https://evil.example\\@fcm.googleapis.com/x"), false)
    assert.equal(isPushServiceUrl("https://evil.example\\.fcm.googleapis.com/x"), false)
    assert.equal(isPushServiceUrl("https://fcm.googleapis.com\\@evil.example/x"), false)
    assert.equal(isPushServiceUrl("https://xn--fcm-0na.googleapis.com.evil/x"), false)

    // ── aviso de needs_user: push, assinatura morta, fallback por e-mail (§6.5) ──
    const { notifyNeedsUser } = await import("./modules/notification/needs-user.service")
    await prisma.pushSubscription.createMany({ data: [
        { userId: "u1", endpoint: "https://fcm.googleapis.com/fcm/send/ok", p256dh: "k", auth: "a" },
        { userId: "u1", endpoint: "https://fcm.googleapis.com/fcm/send/gone", p256dh: "k", auth: "a" },
    ] })
    const pushed: string[] = []
    const mails: string[] = []
    const send = async (sub: { endpoint: string }, payload: string) => {
        if (sub.endpoint.endsWith("gone")) throw Object.assign(new Error("gone"), { statusCode: 410 })
        pushed.push(payload)
    }
    const email = async (o: { to: string }) => { mails.push(o.to) }
    await prisma.pushSubscription.create({ data: { userId: "u1", endpoint: "https://10.0.0.1/x", p256dh: "k", auth: "a" } })
    const target = { id: "00000000-0000-0000-0000-0000000000aa", jobTitle: "Dados", companyName: "Acme" }
    assert.equal(await notifyNeedsUser("u1", target, { send, email }), "push")
    assert.equal(mails.length, 0)
    const payload = JSON.parse(first(pushed)) as { url: string; title: string }
    assert.equal(payload.url, `/candidaturas/${target.id}/concluir`)
    assert.deepEqual((await prisma.pushSubscription.findMany({ where: { userId: "u1" } })).map((x) => x.endpoint), ["https://fcm.googleapis.com/fcm/send/ok"])
    // sem assinatura que funcione → e-mail
    await prisma.pushSubscription.deleteMany({})
    assert.equal(await notifyNeedsUser("u1", target, { send, email }), "email")
    assert.deepEqual(mails, ["u1@t"])
    // sem VAPID configurado também cai no e-mail; erro no e-mail nunca derruba o PATCH
    assert.equal(await notifyNeedsUser("u1", target, { send: null, email: async () => { throw new Error("x") } }), "none")

    // ── criar campanha ats (rota do usuário, Clerk) ─────────────────────────────
    const atsInput = {
        name: "Sites de empresas", resumeId: resume.id, dailyLimit: 10,
        atsConfig: { searchTerms: "engenheiro de dados", remoteOnly: true, atsAllowlist: ["greenhouse" as const] },
    }
    // §9.2.4: sem aceite do envio pela nuvem, não cria
    const noConsent = await campaignService.createAtsCampaign("u1", atsInput)
    assert.equal(noConsent.success, false)
    assert.equal(await prisma.campaign.count({ where: { userId: "u1", name: "Sites de empresas" } }), 0)
    const createdAts = await campaignService.createAtsCampaign("u1", { ...atsInput, consent: true })
    assert.equal(createdAts.success, true)
    const consentAt = (await prisma.user.findUniqueOrThrow({ where: { id: "u1" } })).cloudConsentAt
    assert.ok(consentAt) // aceite gravado com data
    // já aceitou: a próxima campanha não pede de novo, e a data do 1º aceite fica
    const second = await campaignService.createAtsCampaign("u1", { ...atsInput, name: "Sites 2", consent: true })
    assert.equal(second.success, true)
    assert.equal((await prisma.user.findUniqueOrThrow({ where: { id: "u1" } })).cloudConsentAt?.getTime(), consentAt.getTime())
    assert.equal((await campaignService.createAtsCampaign("u1", { ...atsInput, name: "Sites 3" })).success, true)
    const newCampaign = await prisma.campaign.findFirstOrThrow({
        where: { userId: "u1", name: "Sites de empresas" }, include: { atsConfig: true },
    })
    assert.equal(newCampaign.platform, "ats")
    assert.equal(newCampaign.status, "inactive")
    assert.equal(newCampaign.atsConfig?.fitMinScore, 0) // gate desligado por padrão (ADR-07)
    assert.deepEqual(newCampaign.atsConfig?.atsAllowlist, ["greenhouse"])
    // currículo de outro usuário → recusa
    const foreign = await campaignService.createAtsCampaign("u2", {
        name: "x x x", resumeId: resume.id, atsConfig: { searchTerms: "dados" }, consent: true,
    })
    assert.equal(foreign.success, false)
    // ATS fora da lista conhecida → recusa na validação
    const unknownAts = await campaignService.createAtsCampaign("u1", {
        name: "x x x", resumeId: resume.id, atsConfig: { searchTerms: "dados", atsAllowlist: ["workday"] }, consent: true,
    } as never)
    assert.equal(unknownAts.success, false)
    // apagar a campanha apaga a config (FK RESTRICT)
    assert.equal((await campaignService.deleteCampaign("u1", newCampaign.id)).success, true)

    await prisma.$disconnect()
    console.log("cloud-queue: ok")
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})
