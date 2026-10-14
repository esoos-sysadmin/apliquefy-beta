"use client"

import Link from "next/link"
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react"
import { desktopPlatforms } from "../lib/constants/desktop-platforms"
import { formatBRL, PLANS, type Plan } from "../lib/constants/plans"
import { analyzeCv, extractText, findings, MIN_WORDS, type CvAnalysis } from "./cv"
import {
    BUMPS,
    brl,
    COST_PER_APPLICATION,
    canRunDesktop,
    cartTotal,
    dailyLimitFor,
    destination,
    fmt1,
    formatDuration,
    horizonWeeks,
    hoursPerMonth,
    hoursSoFar,
    OTOS,
    planAppsPerWeek,
    responseRate,
    SEGMENT_OPTIONS,
    segmentBump,
    targetSalary,
    weeksTo,
    type Answers,
    type FunnelState,
    type OtoId,
} from "./funnel"
import type { Nav } from "./quiz"
import { Btn, Kicker, Line, Section, Stamp, Title } from "./ui"

export default function Report(nav: Nav) {
    switch (nav.s.screen) {
        case "analysis":
            return <Analysis {...nav} />
        case "gate":
            return <Gate {...nav} />
        case "report":
            return <Diagnosis {...nav} />
        case "bump_cv":
            return <BumpCv {...nav} />
        case "bump_segment":
            return <BumpSegment {...nav} />
        case "checkout":
            return <Checkout {...nav} />
        case "oto":
        case "downsell":
            return <Oto key={nav.s.screen} {...nav} />
        case "thanks":
            return <Thanks {...nav} />
    }
    return null
}

const WEEKS_PER_MONTH = 52 / 12
const countWords = (t: string) => t.split(/\s+/).filter(Boolean).length
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const pct = (r: number) => `${(r * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`
const PRO = PLANS[1]

// ── 4. Análise: cada linha é um trabalho que acontece de verdade, com o resultado real ──

type Step = { label: string; result?: string; bad?: boolean }

function Analysis({ s, go, patch, file }: Nav) {
    const [steps, setSteps] = useState<Step[]>([])
    const [phase, setPhase] = useState<"running" | "unreadable" | "done">("running")
    const started = useRef(false)

    useEffect(() => {
        if (started.current) return
        started.current = true
        const a = s.answers
        const cv = a.cv ?? { kind: "none" as const }

        const step = async (label: string, work: () => Promise<Omit<Step, "label">> | Omit<Step, "label">) => {
            setSteps((p) => [...p, { label }])
            const t0 = performance.now()
            let r: Omit<Step, "label">
            try {
                r = await work()
            } catch (e) {
                r = { result: e instanceof Error ? e.message : "Não consegui ler o arquivo.", bad: true }
            }
            // O trabalho é real, mas rápido demais para alguém acompanhar: tempo mínimo de leitura por linha.
            await sleep(Math.max(0, 650 - (performance.now() - t0)))
            setSteps((p) => p.map((x, i) => (i === p.length - 1 ? { label, ...r } : x)))
        }

        void (async () => {
            let text = cv.kind === "none" ? "" : cv.text
            if (cv.kind === "file" && !text) {
                const f = file.current
                if (!f) return go("cv")
                await step("Abrindo o arquivo", () => ({ result: `${f.name} · ${Math.max(1, Math.round(f.size / 1024))} KB` }))
                await step("Extraindo o texto", async () => {
                    const r = await extractText(f)
                    text = r.text
                    const w = countWords(text)
                    patch({ answers: { ...a, cv: { ...cv, text, pages: r.pages } } })
                    return {
                        result: `${r.pages ? `${r.pages} ${r.pages === 1 ? "página" : "páginas"} · ` : ""}${w} palavras`,
                        bad: w < MIN_WORDS,
                    }
                })
            } else if (cv.kind !== "none") {
                await step("Lendo o currículo", () => ({ result: `${countWords(text)} palavras` }))
            }

            let analysis: CvAnalysis | null = null
            if (cv.kind !== "none") {
                analysis = analyzeCv(text, { targetRole: a.targetRole ?? "", segment: a.segment ?? "varejo", english: a.english })
                if (!analysis) return setPhase("unreadable")
                const c = (id: string) => analysis!.criteria.find((x) => x.id === id)!
                const show = (id: string) => () => ({ result: c(id).evidence, bad: !c(id).pass })
                await step(`Procurando “${a.targetRole}” no texto`, show("role"))
                await step("Conferindo as seções", show("sections"))
                await step("Procurando resultados com números", show("results"))
                await step("Conferindo contato e tamanho", () => ({
                    result: `${c("contact").evidence} ${c("length").evidence}`,
                    bad: !c("contact").pass || !c("length").pass,
                }))
                await step("Somando os critérios", () => ({ result: `Nota ${analysis!.score}/100 em ${analysis!.criteria.length} critérios` }))
            }
            const h = hoursPerMonth(a)
            await step("Calculando seu tempo", () => ({ result: h ? `pelo menos ${fmt1(h)} h por mês` : "sem candidaturas semanais para somar" }))
            await step("Montando a projeção", () => ({ result: `destino: ${destination(a).apps} candidaturas` }))
            patch({ analysis })
            setPhase("done")
        })()
        // Roda uma vez por entrada na tela; s/go/patch daquele momento bastam.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="lp-enter pt-8">
            <Kicker>Análise</Kicker>
            <Title className="mt-2">{phase === "done" ? "Laudo pronto." : "Lendo seu currículo e suas respostas…"}</Title>
            <ol className="mt-6 border-t-2 border-lp-ink" aria-live="polite">
                {steps.map((st, i) => (
                    <li key={i} className="border-b border-lp-rule py-3">
                        <div className="flex items-baseline justify-between gap-3 font-lp-mono text-sm">
                            <span>{st.label}</span>
                            <span className={st.result ? "text-lp-ink2" : "animate-pulse text-lp-ink2"}>{st.result ? "feito" : "lendo…"}</span>
                        </div>
                        {st.result && <p className={`mt-1 text-[0.9375rem] ${st.bad ? "text-lp-bad" : "text-lp-ink2"}`}>{st.result}</p>}
                    </li>
                ))}
            </ol>
            {phase === "unreadable" && (
                <div className="mt-6 space-y-2" role="alert">
                    <p>
                        Não deu para ler texto suficiente neste arquivo. Isso acontece com currículo escaneado ou salvo como imagem: o texto não está
                        acessível.
                    </p>
                    <Btn onClick={() => go("cv")}>Colar o texto do currículo</Btn>
                    <Btn variant="secondary" onClick={() => go("gate", { analysis: null, answers: { ...s.answers, cv: { kind: "none" } } })}>
                        Seguir sem a nota do currículo
                    </Btn>
                </div>
            )}
            {phase === "done" && (
                <Btn className="mt-8" onClick={() => go("gate")}>
                    Ver resultado
                </Btn>
            )}
        </div>
    )
}

// ── 5. Gate: manchete à mostra, o resto borrado até entregar o contato ──

const field = "mt-1 h-[3.25rem] w-full border-2 border-lp-ink bg-lp-field px-3 text-lg"

function Gate({ s, go }: Nav) {
    const an = s.analysis
    const h = hoursPerMonth(s.answers)
    const fs = an ? findings(an) : []
    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const f = new FormData(e.currentTarget)
        // ponytail: o lead fica só no estado da página; gravar via POST /api/leads antes de ligar o anúncio.
        go("report", {
            issuedAt: Date.now(),
            contact: {
                name: String(f.get("name")).trim(),
                email: String(f.get("email")).trim(),
                whatsapp: String(f.get("whatsapp") ?? "").trim(),
                marketing: f.get("marketing") === "on",
            },
        })
    }
    return (
        <div className="lp-enter pt-8">
            <Kicker>Laudo pronto</Kicker>
            <Title className="mt-2">
                {an ? (
                    <>
                        Seu currículo tirou <span className="whitespace-nowrap">{an.score}/100</span>.
                    </>
                ) : (
                    "Seu laudo está pronto."
                )}
            </Title>
            <p className="mt-3">
                {an && (fs.length ? `Encontramos ${fs.length} ${fs.length === 1 ? "problema" : "problemas"} que dá para corrigir. ` : "Nenhum problema grave nos critérios. ")}
                {h && `Você gasta pelo menos ${fmt1(h)} h por mês se candidatando.`}
            </p>

            <div aria-hidden className="lp-blur mt-5 select-none border-y-2 border-lp-ink py-3 font-lp-mono text-sm">
                <p>§ 1 Currículo · problema 1 ··········· título</p>
                <p>§ 1 Currículo · problema 2 ··········· seções</p>
                <p>§ 2 Seu tempo ························ horas</p>
                <p>§ 3 Projeção ···················· semanas</p>
            </div>

            <form onSubmit={submit} className="mt-6 space-y-4">
                <p className="font-semibold">Para quem é este laudo?</p>
                <label className="block">
                    <span className="font-lp-mono text-sm">Seu nome</span>
                    <input name="name" required autoComplete="given-name" defaultValue={s.contact?.name} className={field} />
                </label>
                <label className="block">
                    <span className="font-lp-mono text-sm">E-mail</span>
                    <input name="email" type="email" required autoComplete="email" inputMode="email" defaultValue={s.contact?.email} className={field} />
                </label>
                <label className="block">
                    <span className="font-lp-mono text-sm">WhatsApp (opcional)</span>
                    <input name="whatsapp" type="tel" autoComplete="tel" inputMode="tel" placeholder="(11) 91234-5678" defaultValue={s.contact?.whatsapp} className={field} />
                </label>
                <label className="flex items-start gap-3">
                    <input name="marketing" type="checkbox" defaultChecked={s.contact?.marketing} className="mt-1 h-5 w-5 shrink-0 accent-[#1b1a17]" />
                    <span className="text-[0.9375rem]">Quero receber dicas e novidades por e-mail.</span>
                </label>
                <p className="text-sm text-lp-ink2">
                    Usamos seu contato para falar com você sobre o laudo e enviar o link de instalação, se você contratar.{" "}
                    <a href="/politica-de-privacidade" className="underline" target="_blank">
                        Política de privacidade
                    </a>
                    .
                </p>
                <Btn type="submit">Ver laudo completo</Btn>
            </form>
        </div>
    )
}

// ── 6–8. Diagnóstico, as quatro dúvidas e os planos ──

const nextAfterPlan = (s: FunnelState) => (s.analysis && findings(s.analysis).length === 0 ? "bump_segment" : "bump_cv")

function Diagnosis({ s, go }: Nav) {
    const a = s.answers
    const an = s.analysis ?? null
    const fs = an ? findings(an) : []
    const h = hoursPerMonth(a)
    const sofar = hoursSoFar(a)
    const rate = responseRate(a)
    const dest = destination(a)
    const manualWeeks = weeksTo(dest.apps, a.appsPerWeek ?? 0)
    const salary = targetSalary(a)
    const firstName = s.contact?.name.split(" ")[0]
    let n = 0
    const sec = () => String(++n)

    return (
        <div className="lp-enter space-y-10 pt-8">
            <header>
                <Kicker>Laudo de candidatura</Kicker>
                <Title className="mt-1">{firstName ? `${firstName}, aqui está o seu laudo.` : "Seu laudo"}</Title>
                <div className="mt-4 border-y-2 border-lp-ink py-2">
                    <Line label="Nº" value={`AP-${(s.issuedAt ?? 0).toString(36).slice(-6).toUpperCase()}`} />
                    <Line label="Emitido em" value={new Date(s.issuedAt ?? Date.now()).toLocaleDateString("pt-BR")} />
                    <Line label="Cargo-alvo" value={a.targetRole} />
                    <Line label="Busca" value={`${SEGMENT_OPTIONS.find((o) => o.value === a.segment)?.label} · ${a.area}`} />
                </div>
                <p className="mt-3 text-[0.9375rem] text-lp-ink2">
                    Todo número deste laudo vem das suas respostas, do texto do seu currículo ou dos planos do Apliquefy. O que é estimativa leva o
                    carimbo <Stamp />.
                </p>
            </header>

            <Section n={sec()} title="Currículo">
                {an ? (
                    <>
                        <div className="flex items-end gap-2">
                            <span className="font-lp-serif text-[4.5rem] leading-none">{an.score}</span>
                            <span className="pb-2 font-lp-mono">/100</span>
                        </div>
                        <p className="text-[0.9375rem] text-lp-ink2">
                            Nota Apliquefy: a soma de {an.criteria.length} critérios verificáveis, com os pesos abaixo. Não é a nota de nenhuma empresa.
                        </p>
                        {fs.length > 0 && (
                            <ol className="space-y-5">
                                {fs.map((c, i) => (
                                    <li key={c.id} className="border-l-4 border-lp-bad pl-3">
                                        <p className="font-lp-mono text-xs uppercase tracking-[0.14em] text-lp-bad">Problema {i + 1}</p>
                                        <p className="font-semibold">{c.label}</p>
                                        <p className="mt-1 font-lp-mono text-sm">{c.evidence}</p>
                                        <p className="mt-1 text-[0.9375rem] text-lp-ink2">{c.problem}</p>
                                    </li>
                                ))}
                            </ol>
                        )}
                        <details>
                            <summary className="cursor-pointer font-lp-mono text-sm underline">Ver todos os critérios</summary>
                            <div className="mt-2">
                                {an.criteria.map((c) => (
                                    <Line key={c.id} label={`${c.label} · ${c.weight} pts`} value={c.pass ? "ok" : "não"} tone={c.pass ? "ok" : "bad"} />
                                ))}
                            </div>
                        </details>
                    </>
                ) : (
                    <p>Não avaliado: você não enviou um currículo com texto legível. O resto do laudo usa as suas respostas.</p>
                )}
            </Section>

            <Section n={sec()} title="Seu tempo">
                {h ? (
                    <>
                        <p className="font-lp-serif text-[1.75rem] leading-tight">
                            Pelo menos <b>{fmt1(h)} horas</b> por mês se candidatando.
                        </p>
                        <Formula>
                            {a.appsPerWeek} candidaturas por semana × {a.minutesPerApp} min × 4,33 semanas por mês.
                        </Formula>
                        {sofar !== null && <Line label="Desde que começou a busca" value={`pelo menos ${fmt1(sofar)} h`} tone="est" />}
                    </>
                ) : (
                    <p>Você ainda não envia candidaturas toda semana, então não há horas para somar. A pergunta é com que ritmo começar.</p>
                )}
                <Week manual={(a.appsPerWeek ?? 0) / 7} auto={Math.floor(planAppsPerWeek(PRO) / 7)} />
            </Section>

            {rate !== null && (
                <Section n={sec()} title="Retorno">
                    <div className="border-y border-lp-rule py-1">
                        <Line label="Respostas no último mês" value={a.responsesLastMonth} />
                        <Line label="Candidaturas no mês (aprox.)" value={Math.round((a.appsPerWeek ?? 0) * WEEKS_PER_MONTH)} />
                        <Line label="Taxa de resposta" value={pct(rate)} tone={rate === 0 ? "bad" : undefined} />
                    </div>
                    <p>
                        Não projetamos respostas nem entrevistas: elas dependem da vaga, do currículo e de você. O que dá para projetar com honestidade é
                        volume e tempo.
                    </p>
                </Section>
            )}

            <Section n={sec()} title="Mesmo destino, outra velocidade">
                <p>
                    Destino: <b>{dest.apps.toLocaleString("pt-BR")} candidaturas</b>
                    {dest.own ? ", o que você enviaria em 1 ano no ritmo de hoje." : ". É uma referência: você ainda não tem um ritmo semanal para projetarmos."}
                </p>
                <Bars
                    rows={[
                        { label: "No seu ritmo", weeks: manualWeeks },
                        ...PLANS.map((p) => ({ label: `Plano ${p.name}`, weeks: weeksTo(dest.apps, planAppsPerWeek(p)) })),
                    ]}
                />
                <Formula>
                    Planos: créditos do mês ÷ {COST_PER_APPLICATION} crédito por candidatura, com o limite diário da campanha ajustado ao plano (até 200).
                    O ritmo real também depende de quantas vagas passam nos seus filtros (no LinkedIn, só vagas com Candidatura Simplificada).
                </Formula>
                {a.deadline && a.deadline !== "no_rush" && (a.appsPerWeek ?? 0) > 0 && (
                    <p>
                        No seu prazo de {horizonWeeks(a)} semanas: <b>{Math.round((a.appsPerWeek ?? 0) * horizonWeeks(a))}</b> candidaturas no seu
                        ritmo, cerca de <b>{Math.floor(planAppsPerWeek(PRO) * horizonWeeks(a)).toLocaleString("pt-BR")}</b> no plano {PRO.name}.
                    </p>
                )}
            </Section>

            <Section n={sec()} title="Quatro dúvidas, respondidas">
                <Doubt q="Automação de candidatura funciona?">
                    <p>Funciona para o que ela se propõe: enviar volume sem gastar o seu tempo. Em cada vaga, o Apliquefy:</p>
                    <ol className="list-decimal space-y-1 pl-5">
                        <li>busca no LinkedIn e no InfoJobs com os seus filtros (cargo, cidade, salário, modalidade);</li>
                        <li>abre a vaga e preenche a candidatura com os dados do seu currículo, no Chrome do seu computador;</li>
                        <li>registra o envio no seu painel: empresa, vaga, data e status;</li>
                        <li>respeita o limite diário que você definir e para quando você mandar.</li>
                    </ol>
                    <p>O que ele não faz: decidir quem a empresa chama. Por isso o laudo começa pelo currículo.</p>
                </Doubt>
                <Doubt q="Funciona para alguém como eu?">
                    <InternalBelief a={a} hours={h} />
                </Doubt>
                <Doubt q="Minha conta corre risco?">
                    <p>
                        O Apliquefy usa a sua própria conta: você entra no LinkedIn e no InfoJobs pelo Chrome do seu computador, e a sua senha não passa
                        pelos nossos servidores.
                    </p>
                    <p>
                        Você escolhe o limite diário (até 200 por campanha) e pausa quando quiser. Cada plataforma tem regras próprias sobre ferramentas de
                        automação: leia os termos do LinkedIn e do InfoJobs e escolha um ritmo com que você esteja confortável.
                    </p>
                </Doubt>
                <Doubt q="Tenho tempo, dinheiro e computador para isso?">
                    <p>
                        <b>Computador:</b> {desktopPlatforms.map((p) => p.systemRequirements[0]).join("; ")}, com Google Chrome instalado. Ele precisa
                        ficar ligado e conectado enquanto as candidaturas rodam; o app abre o navegador sozinho.
                        {a.computer === "shared" && " Computador compartilhado serve: rode nos horários em que ele fica livre."}
                        {a.computer === "phone_only" && " Hoje você não tem um, e isso muda a recomendação abaixo."}
                    </p>
                    <p>
                        <b>Tempo:</b> você configura uma vez (login nas plataformas, currículo, filtros). Depois, acompanha o painel.
                    </p>
                    {h ? (
                        <p>
                            <b>Dinheiro:</b> o plano {PRO.name} custa {formatBRL(PRO.priceInCents)} por mês. Você gasta pelo menos {fmt1(h)} h por mês se
                            candidatando: dá {brl(PRO.priceInCents / 100 / h)} por hora que volta para você. <Stamp />
                        </p>
                    ) : (
                        <p>
                            <b>Dinheiro:</b> planos a partir de {formatBRL(PLANS[0].priceInCents)} por mês, sem fidelidade.
                        </p>
                    )}
                </Doubt>
            </Section>

            {canRunDesktop(a) ? (
                <Section n={sec()} title="Escolha a velocidade">
                    <p>
                        Os três planos chegam ao mesmo destino: <b>{dest.apps.toLocaleString("pt-BR")} candidaturas</b>. No seu ritmo de hoje, isso leva{" "}
                        <b>{formatDuration(manualWeeks)}</b>. A única diferença entre eles é quando você chega.
                    </p>
                    <div className="border-y border-lp-rule py-3">
                        <Kicker>Todos os planos incluem</Kicker>
                        <ul className="mt-2 space-y-1 text-[0.9375rem]">
                            <li>· App para Windows, Mac e Linux</li>
                            <li>· LinkedIn (Candidatura Simplificada) e InfoJobs</li>
                            <li>· Filtros por cargo, cidade, salário e modalidade{salary ? ` (o seu: a partir de ${brl(salary)})` : ""}</li>
                            <li>· Painel com cada candidatura enviada</li>
                            <li>· Limite diário e pausa a qualquer momento</li>
                            <li>· Sem fidelidade: cancele pelo portal de assinatura</li>
                        </ul>
                    </div>
                    {/* Ancoragem: o mais caro primeiro; o Pro fica no centro. */}
                    {[PLANS[2], PLANS[1], PLANS[0]].map((p) => (
                        <PlanCard key={p.slug} plan={p} a={a} destApps={dest.apps} onPick={() => go(nextAfterPlan({ ...s, plan: p.slug }), { plan: p.slug })} />
                    ))}
                </Section>
            ) : (
                <Section n={sec()} title="O próximo passo">
                    <p>Sem computador, o robô de candidaturas não roda. Por isso não vamos te oferecer um plano agora.</p>
                    <p>
                        O que dá para resolver pelo celular é o currículo
                        {fs.length ? `: os ${fs.length} problemas do § 1.` : "."}
                    </p>
                    <Deliverables items={cvDeliverables(s)} />
                    <Btn onClick={() => go("checkout", { plan: undefined, bumps: ["cv"] })}>
                        Quero o currículo otimizado · {formatBRL(BUMPS.cv.priceInCents)}
                    </Btn>
                </Section>
            )}

            <Btn variant="secondary" className="lp-noprint" onClick={() => window.print()}>
                Salvar este laudo em PDF
            </Btn>
        </div>
    )
}

const Formula = ({ children }: { children: ReactNode }) => (
    <div className="flex items-start gap-3">
        <Stamp />
        <p className="font-lp-mono text-xs leading-relaxed text-lp-ink2">{children}</p>
    </div>
)

const Doubt = ({ q, children }: { q: string; children: ReactNode }) => (
    <div className="space-y-2 border-t border-lp-rule pt-4">
        <h3 className="font-lp-serif text-[1.3125rem] leading-snug">{q}</h3>
        {children}
    </div>
)

const Deliverables = ({ items }: { items: string[] }) => (
    <ul className="space-y-1">
        {items.map((d) => (
            <li key={d} className="flex gap-2">
                <span aria-hidden>→</span>
                {d}
            </li>
        ))}
    </ul>
)

function InternalBelief({ a, hours }: { a: Answers; hours: number | null }) {
    const area = a.area?.toLowerCase()
    if (a.segment === "dev") {
        const en = a.english === "intermediate" || a.english === "advanced"
        return (
            <p>
                Vagas de {area} no LinkedIn com Candidatura Simplificada, inclusive remotas.{" "}
                {en
                    ? "Com o seu inglês, dá para rodar uma campanha separada só com vagas em inglês."
                    : "Com o seu nível de inglês, o começo é por vagas no Brasil: vaga em inglês pede o idioma no currículo e na entrevista."}
            </p>
        )
    }
    if (a.segment === "exec")
        return (
            <p>
                Uma resposta honesta: em cargos de liderança, parte das contratações vem de indicação e headhunter, não de candidatura. O Apliquefy
                cobre a parte que é candidatura{hours ? ` e devolve as ${fmt1(hours)} h por mês para você investir em networking` : ""}.
            </p>
        )
    return (
        <p>
            Vagas de {area} aparecem no InfoJobs e no LinkedIn. Você filtra por cidade, distância, salário e tipo de contrato, e o robô só se
            candidata ao que passa nos seus filtros.
        </p>
    )
}

/** Emprestado da direção "A Semana": volume diário hoje vs. com o plano. */
function Week({ manual, auto }: { manual: number; auto: number }) {
    const days = ["S", "T", "Q", "Q", "S", "S", "D"]
    const row = (label: string, v: string, dark: boolean) => (
        <div>
            <p className="font-lp-mono text-xs text-lp-ink2">{label}</p>
            <div className="mt-1 grid grid-cols-7 gap-1">
                {days.map((d, i) => (
                    <div key={i} className={`flex aspect-square flex-col items-center justify-center border border-lp-ink font-lp-mono ${dark ? "bg-lp-ink text-lp-paper" : ""}`}>
                        <span className="text-[0.625rem] opacity-80">{d}</span>
                        <span className="text-sm">{v}</span>
                    </div>
                ))}
            </div>
        </div>
    )
    return (
        <figure className="space-y-3">
            <figcaption className="font-semibold">Candidaturas por dia</figcaption>
            {row("Hoje, à mão", fmt1(manual), false)}
            {row(`Com o plano ${PRO.name}`, String(auto), true)}
            <Formula>
                {PRO.credits.toLocaleString("pt-BR")} créditos por mês, 1 por candidatura, divididos pelos dias. O limite diário padrão de uma campanha é
                50.
            </Formula>
        </figure>
    )
}

function Bars({ rows }: { rows: { label: string; weeks: number }[] }) {
    const max = Math.max(...rows.map((r) => r.weeks).filter(Number.isFinite), 1)
    return (
        <div className="space-y-3">
            {rows.map((r) => (
                <div key={r.label}>
                    <div className="flex items-baseline justify-between gap-2 font-lp-mono text-sm">
                        <span>{r.label}</span>
                        <span className="font-semibold">{formatDuration(r.weeks)}</span>
                    </div>
                    <div className="mt-1 h-3 border border-lp-ink" aria-hidden>
                        <div className="h-full bg-lp-ink" style={{ width: `${Number.isFinite(r.weeks) ? Math.max(1.5, (r.weeks / max) * 100) : 100}%` }} />
                    </div>
                </div>
            ))}
        </div>
    )
}

function PlanCard({ plan, a, destApps, onPick }: { plan: Plan; a: Answers; destApps: number; onPick: () => void }) {
    const weeks = weeksTo(destApps, planAppsPerWeek(plan))
    const rec = plan.slug === PRO.slug
    const inDeadline = a.deadline && a.deadline !== "no_rush" && weeks <= horizonWeeks(a)
    return (
        <article className={`relative border-lp-ink p-4 ${rec ? "border-4" : "border-2"}`}>
            {rec && (
                <p className="-mx-4 -mt-4 mb-3 bg-lp-ink px-4 py-1.5 font-lp-mono text-xs uppercase tracking-[0.14em] text-lp-paper">
                    Recomendado {inDeadline ? "· cabe no seu prazo" : ""}
                </p>
            )}
            <h3 className="font-lp-mono text-sm uppercase tracking-[0.14em]">{plan.name}</h3>
            <p className="mt-1 font-lp-serif text-[2.5rem] leading-none">{formatDuration(weeks)}</p>
            <p className="text-lp-ink2">até {destApps.toLocaleString("pt-BR")} candidaturas</p>
            <div className="mt-3">
                <Line label="Candidaturas por semana" value={`≈ ${Math.floor(planAppsPerWeek(plan)).toLocaleString("pt-BR")}`} />
                <Line label="Créditos por mês" value={plan.credits.toLocaleString("pt-BR")} />
                <Line label="Limite diário para esse ritmo" value={dailyLimitFor(plan)} />
                <Line label="Por candidatura" value={`≈ ${formatBRL(plan.priceInCents / plan.credits)}`} />
            </div>
            <p className="mt-3 text-2xl font-semibold">
                {formatBRL(plan.priceInCents)}
                <span className="text-base font-normal text-lp-ink2"> por mês</span>
            </p>
            <Btn className="mt-3" variant={rec ? "primary" : "secondary"} onClick={onPick}>
                Escolher {plan.name}
            </Btn>
        </article>
    )
}

// ── 9–10. Pré-checkout: uma decisão por tela ──

function Offer({ step, title, children, price, onYes, onNo }: { step: string; title: ReactNode; children: ReactNode; price: number; onYes: () => void; onNo: () => void }) {
    return (
        <div className="lp-enter pt-8">
            <Kicker>{step}</Kicker>
            <Title className="mt-2">{title}</Title>
            <div className="mt-5 space-y-4">{children}</div>
            <p className="mt-6 font-lp-mono">
                + {formatBRL(price)} <span className="text-lp-ink2">· pagamento único</span>
            </p>
            {/* Recusar é tão fácil quanto aceitar: mesmo tamanho, texto neutro. */}
            <div className="mt-4 grid gap-2">
                <Btn onClick={onYes}>Sim, adicionar por {formatBRL(price)}</Btn>
                <Btn variant="secondary" onClick={onNo}>
                    Não, seguir sem
                </Btn>
            </div>
        </div>
    )
}

// Sem currículo legível, a oferta é montar um, não corrigir.
const cvDeliverables = (s: FunnelState) =>
    s.analysis
        ? BUMPS.cv.deliverables
        : ["Currículo completo a partir das suas respostas", `Título e resumo com “${s.answers.targetRole}”`, "Estrutura que os sistemas de candidatura leem"]

const withBump = (s: FunnelState, id: (typeof s.bumps)[number], on: boolean) => (on ? [...new Set([...s.bumps, id])] : s.bumps.filter((b) => b !== id))

function BumpCv({ s, go }: Nav) {
    const fs = s.analysis ? findings(s.analysis) : []
    const pick = (on: boolean) => go("bump_segment", { bumps: withBump(s, "cv", on) })
    return (
        <Offer
            step="Antes do pagamento · 1 de 2"
            price={BUMPS.cv.priceInCents}
            onYes={() => pick(true)}
            onNo={() => pick(false)}
            title={
                s.analysis
                    ? `Seu laudo apontou ${fs.length} ${fs.length === 1 ? "problema" : "problemas"} no currículo. Quer que a IA corrija agora?`
                    : `Você ainda não tem um currículo legível. Quer que a IA monte um para “${s.answers.targetRole}”?`
            }
        >
            {fs.length > 0 && (
                <ul className="space-y-1 font-lp-mono text-sm text-lp-bad">
                    {fs.map((c) => (
                        <li key={c.id}>✗ {c.label}</li>
                    ))}
                </ul>
            )}
            <Deliverables items={cvDeliverables(s)} />
            <p className="text-[0.9375rem] text-lp-ink2">Você revisa e aprova cada mudança antes de o robô usar o currículo.</p>
        </Offer>
    )
}

function BumpSegment({ s, go }: Nav) {
    const a = s.answers
    const id = segmentBump(a.segment)
    const b = BUMPS[id]
    const pick = (on: boolean) => go("checkout", { bumps: withBump(s, id, on) })
    const en = { none: "nenhum", basic: "básico", intermediate: "intermediário", advanced: "avançado" }[a.english ?? "none"]
    const title =
        id === "kit_dev"
            ? a.raise === "usd"
                ? "Você quer receber em dólar. Seu currículo está pronto para vaga em inglês?"
                : `Você tem inglês ${en}. Quer abrir também as vagas de fora?`
            : id === "kit_exec"
              ? `Para “${a.targetRole}”, o LinkedIn é a primeira coisa que o recrutador abre. Ele diz o mesmo que o seu currículo?`
              : `Em ${a.area?.toLowerCase()}, a entrevista muitas vezes é presencial. Quer chegar preparado?`
    return (
        <Offer step={`Antes do pagamento${s.plan && nextAfterPlan(s) === "bump_cv" ? " · 2 de 2" : ""}`} price={b.priceInCents} onYes={() => pick(true)} onNo={() => pick(false)} title={title}>
            <p className="font-semibold">{b.title}</p>
            <Deliverables items={b.deliverables} />
        </Offer>
    )
}

// ── 11. Checkout (simulado) ──

function Checkout({ s, go, patch }: Nav) {
    const plan = PLANS.find((p) => p.slug === s.plan)
    const { monthly, once } = cartTotal(s)
    const today = monthly + once
    if (!today)
        return (
            <div className="pt-8">
                <Title>Seu pedido está vazio.</Title>
                <Btn className="mt-6" onClick={() => go("report")}>
                    Voltar ao laudo
                </Btn>
            </div>
        )
    return (
        <div className="lp-enter pt-8">
            <Kicker>Pagamento</Kicker>
            <Title className="mt-2">Revise seu pedido.</Title>
            <div className="mt-5 border-y-2 border-lp-ink py-2">
                {plan && <Line label={`Plano ${plan.name} · mensal`} value={formatBRL(plan.priceInCents)} />}
                {s.bumps.map((id) => (
                    <div key={id} className="flex items-center gap-2">
                        <div className="flex-1">
                            <Line label={BUMPS[id].title} value={formatBRL(BUMPS[id].priceInCents)} />
                        </div>
                        <button
                            type="button"
                            onClick={() => patch({ bumps: s.bumps.filter((b) => b !== id) })}
                            className="min-h-11 px-2 font-lp-mono text-xs underline"
                            aria-label={`Remover ${BUMPS[id].title}`}
                        >
                            remover
                        </button>
                    </div>
                ))}
                <div className="mt-2 border-t border-lp-rule pt-2">
                    <Line label="Total hoje" value={<b>{formatBRL(today)}</b>} />
                </div>
            </div>
            {plan && (
                <p className="mt-3 text-[0.9375rem] text-lp-ink2">
                    Depois, {formatBRL(plan.priceInCents)} por mês. Sem fidelidade: cancele quando quiser pelo portal de assinatura.{" "}
                    <button type="button" onClick={() => go("report")} className="underline">
                        Trocar de plano
                    </button>
                </p>
            )}
            <p className="mt-6 border-2 border-dashed border-lp-est p-3 font-lp-mono text-sm text-lp-est">
                Ambiente de demonstração: o pagamento é simulado e nada é cobrado.
            </p>
            {/* ponytail: pagamento simulado; trocar por Stripe Checkout (line_items do plano + bumps) voltando para ?paid=1. */}
            <Btn className="mt-4" onClick={() => go("oto", { paidAt: Date.now() })}>
                Pagar {formatBRL(today)}
            </Btn>
            <p className="mt-2 text-center text-sm text-lp-ink2">Recibo para {s.contact?.email}</p>
        </div>
    )
}

// ── 12. OTO pós-compra, com downsell ──

function Oto({ s, go }: Nav) {
    const id: OtoId = s.screen === "oto" ? "voice" : "text"
    const o = OTOS[id]
    return (
        <div className="lp-enter pt-8">
            <Kicker>{id === "voice" ? "Pagamento aprovado" : "Outra opção"}</Kicker>
            <Title className="mt-2">
                {id === "voice"
                    ? `Pronto. Antes de ir para o computador: quer treinar a entrevista para “${s.answers.targetRole}”?`
                    : "Prefere treinar escrevendo, no seu ritmo?"}
            </Title>
            <p className="mt-4 font-semibold">{o.title}</p>
            <p className="mt-1">{o.pitch}</p>
            <p className="mt-6 font-lp-mono">
                + {formatBRL(o.priceInCents)} <span className="text-lp-ink2">· no mesmo cartão, sem digitar nada</span>
            </p>
            <div className="mt-4 grid gap-2">
                <Btn onClick={() => go("thanks", { oto: id })}>Sim, adicionar por {formatBRL(o.priceInCents)}</Btn>
                <Btn variant="secondary" onClick={() => go(id === "voice" ? "downsell" : "thanks")}>
                    Não, obrigado
                </Btn>
            </div>
        </div>
    )
}

// ── 13. Obrigado + onboarding: a pessoa está no celular, o produto roda no computador ──

const DESKTOP_Q = "(pointer: fine) and (min-width: 1024px)"
const subscribe = (cb: () => void) => {
    const m = matchMedia(DESKTOP_Q)
    m.addEventListener("change", cb)
    return () => m.removeEventListener("change", cb)
}

function reminderHref(link: string) {
    const start = new Date()
    start.setHours(20, 0, 0, 0)
    if (start.getTime() < Date.now()) start.setDate(start.getDate() + 1)
    const f = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
    const ics = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Apliquefy//LP//PT",
        "BEGIN:VEVENT",
        `UID:${Date.now()}@apliquefy`,
        `DTSTAMP:${f(new Date())}`,
        `DTSTART:${f(start)}`,
        `DTEND:${f(new Date(start.getTime() + 30 * 60_000))}`,
        "SUMMARY:Instalar o Apliquefy no computador",
        `DESCRIPTION:${link}`,
        "END:VEVENT",
        "END:VCALENDAR",
    ].join("\r\n")
    return { href: `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`, today: start.getDate() === new Date().getDate() }
}

const linkBtn = "flex min-h-[3.25rem] w-full items-center justify-center px-5 text-center font-semibold"

function Thanks({ s }: Nav) {
    const desktop = useSyncExternalStore(subscribe, () => matchMedia(DESKTOP_Q).matches, () => false)
    const [copied, setCopied] = useState(false)
    const a = s.answers
    const plan = PLANS.find((p) => p.slug === s.plan)
    const email = s.contact?.email ?? ""
    const link = `${location.origin}/desktop`
    const msg = `Apliquefy: abrir no computador → ${link}`
    const reminder = reminderHref(link)
    const salary = targetSalary(a)

    return (
        <div className="lp-enter space-y-10 pt-8">
            <header>
                <Kicker>Pedido confirmado</Kicker>
                <Title className="mt-2">{plan ? "Falta um passo, e ele é no computador." : "Pedido confirmado."}</Title>
                <div className="mt-4 border-y-2 border-lp-ink py-2">
                    {plan && <Line label={`Plano ${plan.name}`} value={`${formatBRL(plan.priceInCents)}/mês`} />}
                    {s.bumps.map((b) => (
                        <Line key={b} label={BUMPS[b].title} value={formatBRL(BUMPS[b].priceInCents)} />
                    ))}
                    {s.oto && <Line label={OTOS[s.oto].title} value={formatBRL(OTOS[s.oto].priceInCents)} />}
                </div>
            </header>

            {plan ? (
                <>
                    <Section n="1" title={desktop ? "Baixe o app" : "Mande o link para o seu computador"}>
                        <p>Enquanto o app não estiver instalado no computador, nenhuma candidatura é enviada. Este é o passo que faz o resto funcionar.</p>
                        {desktop ? (
                            <div className="grid gap-2">
                                {desktopPlatforms.map((p) => (
                                    <a key={p.name} href={p.downloadUrl} className={`${linkBtn} border-2 border-lp-ink`}>
                                        Baixar para {p.name} <span className="ml-2 font-lp-mono text-xs font-normal">{p.version}</span>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className="grid gap-2">
                                <a href={`mailto:${email}?subject=${encodeURIComponent("Instalar o Apliquefy")}&body=${encodeURIComponent(msg)}`} className={`${linkBtn} bg-lp-ink text-lp-paper`}>
                                    Enviar para {email}
                                </a>
                                <a href={`https://wa.me/?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener noreferrer" className={`${linkBtn} border-2 border-lp-ink`}>
                                    Enviar pelo WhatsApp
                                </a>
                                <Btn
                                    variant="secondary"
                                    onClick={() =>
                                        navigator.clipboard
                                            ?.writeText(link)
                                            .then(() => setCopied(true))
                                            .catch(() => {})
                                    }
                                >
                                    {copied ? "Link copiado" : "Copiar link"}
                                </Btn>
                                <a href={reminder.href} download="apliquefy-lembrete.ics" className={`${linkBtn} border-2 border-lp-ink`}>
                                    Lembrete na agenda: {reminder.today ? "hoje" : "amanhã"} às 20h
                                </a>
                                <p aria-live="polite" className="sr-only">
                                    {copied ? "Link copiado" : ""}
                                </p>
                            </div>
                        )}
                    </Section>

                    <Section n="2" title="No computador, nesta ordem">
                        <ol className="space-y-3">
                            {[
                                "Instale o Google Chrome, se ainda não tiver. O app usa o Chrome para se candidatar.",
                                `Abra o link e baixe o app para o seu sistema (${desktopPlatforms.map((p) => p.name).join(", ")}).`,
                                `Entre com o e-mail ${email}.`,
                                "Conecte o LinkedIn e o InfoJobs: o app abre o Chrome e você faz login normalmente.",
                                `Crie a campanha com o cargo “${a.targetRole}”${salary ? ` e salário a partir de ${brl(salary)}` : ""}. Ajuste o limite diário para ${dailyLimitFor(plan)} candidaturas, o ritmo do plano ${plan.name}.`,
                                "Ative a campanha e deixe o computador ligado e conectado. Cada envio aparece no painel.",
                            ].map((t, i) => (
                                <li key={i} className="flex gap-3">
                                    <span className="font-lp-mono text-sm">{String(i + 1).padStart(2, "0")}</span>
                                    <span>{t}</span>
                                </li>
                            ))}
                        </ol>
                    </Section>
                </>
            ) : (
                <Section n="1" title="Próximo passo">
                    <p>Entre na sua conta com {email} para gerar o currículo e revisar cada mudança.</p>
                    <Link href="/login" className={`${linkBtn} bg-lp-ink text-lp-paper`}>
                        Entrar na conta
                    </Link>
                </Section>
            )}
        </div>
    )
}
