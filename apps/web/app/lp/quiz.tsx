"use client"

import { ArrowLeft, Check } from "lucide-react"
import dynamic from "next/dynamic"
import { useEffect, useRef, useState, type FormEvent, type MouseEvent, type ReactNode } from "react"
import {
    appsSoFar,
    fmt1,
    hoursSoFar,
    initialState,
    nextQuizScreen,
    questionsFor,
    responseRate,
    WEEKS_PER_MONTH,
    type Answers,
    type FunnelState,
    type ProfileItem,
    type Question,
    type Screen,
    type Segment,
} from "./funnel"
import { Btn, Card, Eyebrow, Logo, Title } from "./ui"

// Tudo depois do quiz vai num chunk separado: a landing e a pergunta 1 não pagam por ele.
const Report = dynamic(() => import("./report"), {
    loading: () => <p className="py-16 text-center text-sm text-ap-muted">Carregando…</p>,
})

const KEY = "apliquefy-lp-v2"
const PRE_PAYMENT = new Set<Screen>(["checkout", "bump_cv", "bump_segment", "bump_letter", "bump_jobs", "pricing", "report"])

export type Nav = {
    s: FunnelState
    go: (screen: Screen, patch?: Partial<FunnelState>) => void
    patch: (p: Partial<FunnelState>) => void
}

export type CheckoutReturn = { status: "success" | "cancel" | "error" | "active"; sessionId?: string }

export function Funnel({
    ad,
    start,
    startScreen,
    checkout,
    landing,
}: {
    ad?: Segment
    start?: Segment
    startScreen?: Screen
    checkout?: CheckoutReturn
    landing: ReactNode
}) {
    const [s, setS] = useState<FunnelState>(() =>
        start
            ? { ...initialState, screen: nextQuizScreen({ segment: start }, "segment"), answers: { segment: start } }
            : { ...initialState, screen: startScreen ?? "home" },
    )
    const [ready, setReady] = useState(false)
    const paid = useRef(false)
    const firstScreen = useRef(true)
    const reentry = useRef<boolean>(undefined)
    const resume = useRef<FunnelState | null>(null)
    paid.current = Boolean(s.paidAt)

    useEffect(() => {
        let saved: FunnelState | null = null
        try {
            saved = JSON.parse(sessionStorage.getItem(KEY) ?? "null")
        } catch {
            // sessionStorage indisponível (aba anônima, bloqueio): segue do zero
        }
        // Escolha feita pela URL (antes de hidratar) vence um progresso salvo de outro segmento.
        if (saved && start && saved.answers.segment !== start) saved = null
        // Progresso salvo só vale se a pessoa já saiu da landing.
        if (saved?.screen === "home") saved = null
        // Chegada nova (link, redirect do logout…) mostra a landing; o progresso só volta quando a pessoa
        // clica no quiz de novo. Reload/voltar (history.state nosso) e volta do Stripe retomam direto.
        // Lido uma vez só: no StrictMode o efeito roda 2x e o replaceState abaixo já teria marcado.
        reentry.current ??= Boolean(history.state?.screen)
        const fresh = !reentry.current && !checkout
        if (fresh && saved?.paidAt) saved = null // funil já pago: novo acesso começa do zero
        if (fresh && saved && !start && !startScreen) {
            resume.current = saved
            saved = null
        }
        // Volta do Stripe: pago → OTO no mesmo cartão; cancelado/erro → de volta à revisão do pedido.
        // Um reload na mesma sessão paga mantém a tela em que a pessoa estava.
        if (checkout?.status === "success" && saved?.stripeSessionId !== checkout.sessionId)
            saved = { ...(saved ?? initialState), screen: saved ? "oto" : "done", paidAt: Date.now(), stripeSessionId: checkout.sessionId, checkoutError: undefined }
        else if (checkout && checkout.status !== "success" && saved) saved = { ...saved, screen: "checkout", checkoutError: checkout.status }
        if (saved) setS(saved)
        setReady(true)
        const screen = saved?.screen ?? (start ? nextQuizScreen({ segment: start }, "segment") : (startScreen ?? "home"))
        history.replaceState({ screen }, "", ad ? `/lp?a=${ad}` : "/lp")

        const onPop = (e: PopStateEvent) => {
            const target = e.state?.screen as Screen | undefined
            if (!target) return
            // Depois de pago, "voltar" não reabre checkout nem upsell.
            if (paid.current && PRE_PAYMENT.has(target)) return history.go(1)
            setS((p) => ({ ...p, screen: target }))
        }
        addEventListener("popstate", onPop)
        return () => removeEventListener("popstate", onPop)
    }, [ad, start, startScreen, checkout]) // props do servidor: fixas durante a vida da página

    useEffect(() => {
        // Na landing não há nada novo; gravar "home" apagaria o ponto de retomada.
        if (!ready || s.screen === "home") return
        try {
            sessionStorage.setItem(KEY, JSON.stringify(s))
        } catch {
            // sem persistência: a página funciona, só não sobrevive a um reload
        }
    }, [s, ready])

    useEffect(() => {
        if (firstScreen.current) {
            firstScreen.current = false
            return
        }
        window.scrollTo(0, 0)
        document.getElementById("screen-title")?.focus({ preventScroll: true })
    }, [s.screen])

    // Pré-carrega o chunk do relatório assim que a pessoa entra no quiz.
    useEffect(() => {
        if (s.screen !== "home" && s.screen !== "segment") void import("./report")
    }, [s.screen])

    const go: Nav["go"] = (screen, patch = {}) => {
        setS((p) => ({ ...p, ...patch, screen }))
        history.pushState({ screen }, "")
    }
    const patch: Nav["patch"] = (p) => setS((prev) => ({ ...prev, ...p }))

    const answer = (p: Partial<Answers>, from: Screen = s.screen) => {
        const answers = { ...s.answers, ...p }
        // Trocar o segmento invalida o que depende dele (áreas e faixas salariais mudam).
        if (p.segment && p.segment !== s.answers.segment) {
            delete answers.area
            delete answers.income
            delete answers.raise
            delete answers.english
        }
        go(nextQuizScreen(answers, from), { answers })
    }

    // A landing é server component (zero JS): os CTAs são <a> com data-start / data-segment.
    // Depois de hidratar, o clique segue aqui sem recarregar; antes, o link funciona sozinho.
    const onLandingClick = (e: MouseEvent) => {
        const link = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[data-start], a[data-segment]")
        if (!link || e.metaKey || e.ctrlKey || e.shiftKey) return
        e.preventDefault()
        const seg = link.dataset.segment as Segment | undefined
        const r = resume.current
        resume.current = null
        if (r && (!seg || seg === r.answers.segment)) return go(r.screen, r)
        if (seg) answer({ segment: seg }, "segment")
        else go("segment")
    }

    const qs = questionsFor(s.answers)
    // Conta assumindo que a pessoa se candidata: o total só diminui depois, nunca cresce no meio.
    const total = questionsFor({ appsPerWeek: 1, ...s.answers }).length
    const qIndex = qs.findIndex((q) => q.id === (s.screen === "bridge" ? "feeling" : s.screen))
    const q = qs[qIndex]
    const inQuiz = qIndex >= 0 || s.screen === "bridge"
    // Delegação de clique: os alvos são <a>, já acessíveis por teclado.
    if (s.screen === "home") return <div onClick={onLandingClick}>{landing}</div>

    return (
        <>
            <header className="sticky top-0 z-10 border-b border-ap-border bg-white/95 backdrop-blur">
                <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4">
                    {!s.paidAt ? (
                        <button type="button" onClick={() => history.back()} className="-ml-2 inline-flex min-h-11 items-center gap-1 rounded-ap-control px-2 text-sm font-medium text-ap-muted hover:text-ap-ink">
                            <ArrowLeft size={16} aria-hidden /> Voltar
                        </button>
                    ) : (
                        <span />
                    )}
                    <Logo className="h-7 w-auto" />
                    <span className="min-w-[4.5rem]" />
                </div>
                {inQuiz && (
                    <div className="h-1 bg-ap-surface-purple" aria-hidden>
                        <div
                            className="h-full rounded-r-full bg-gradient-to-r from-ap-purple to-ap-orange transition-[width] duration-300"
                            style={{ width: `${((qIndex + (s.screen === "bridge" ? 1 : 0)) / total) * 100}%` }}
                        />
                    </div>
                )}
            </header>

            <main className="px-4 pb-16">
                {s.screen === "bridge" ? (
                    <Bridge answers={s.answers} left={qs.length - qIndex - 1} onNext={() => go(nextQuizScreen(s.answers, "bridge"))} />
                ) : q ? (
                    <div key={q.id} className="ap-enter mx-auto max-w-xl pt-8">
                        <Card className="p-5 sm:p-8">
                            <Eyebrow>
                                Pergunta {qIndex + 1} de {total}
                            </Eyebrow>
                            <QuestionView q={q} answers={s.answers} onAnswer={answer} native={qIndex === 0 ? { a: ad } : undefined} />
                        </Card>
                    </div>
                ) : (
                    <Report s={s} go={go} patch={patch} />
                )}
            </main>
        </>
    )
}

// ── Perguntas ────────────────────────────────────────────────────────────────

type QProps = { q: Question; answers: Answers; onAnswer: (p: Partial<Answers>) => void; native?: { a?: Segment } }

function QuestionView({ q, answers, onAnswer, native }: QProps) {
    const heading = (
        <>
            <h1 id="screen-title" tabIndex={-1} className="mt-2 font-ap-display text-2xl font-bold leading-[1.25] outline-none sm:text-[1.75rem]">
                <span id={`q-${q.id}`}>{q.title}</span>
            </h1>
            {q.help && <p className="mt-2 text-ap-muted">{q.help}</p>}
        </>
    )
    if (q.kind === "choice")
        return (
            <>
                {heading}
                <Choice q={q} value={answers[q.id]} onPick={(v) => onAnswer({ [q.id]: v })} native={native} />
            </>
        )
    if (q.kind === "multi")
        return (
            <>
                {heading}
                <Multi q={q} value={answers.profile} onDone={(v) => onAnswer({ profile: v })} />
            </>
        )
    if (q.kind === "number")
        return (
            <>
                {heading}
                <NumberInput q={q} value={answers[q.id] as number | undefined} onDone={(v) => onAnswer({ [q.id]: v })} />
            </>
        )
    return (
        <>
            {heading}
            <TextInput q={q} value={answers.targetRole} onDone={(v) => onAnswer({ targetRole: v })} />
        </>
    )
}

const optionCls = (on: boolean) =>
    `flex min-h-[3.5rem] w-full items-center gap-3 rounded-ap-control border px-4 py-3 text-left transition-colors ${
        on ? "border-ap-purple bg-ap-surface-purple" : "border-ap-border bg-white hover:border-ap-purple"
    }`

type ChoiceProps = { q: Extract<Question, { kind: "choice" }>; value: unknown; onPick: (v: string | number) => void; native?: { a?: Segment } }

/**
 * Com `native`, as opções são um form GET de verdade: tocar antes do JS hidratar (4G lento)
 * recarrega em /lp?s=<valor> já na pergunta 2. Depois de hidratar, o clique é tratado aqui.
 */
function Choice({ q, value, onPick, native }: ChoiceProps) {
    const [picked, setPicked] = useState<unknown>(value)
    const sent = useRef(false)
    const list = (
        <ul className="mt-6 grid gap-2" aria-labelledby={`q-${q.id}`}>
            {q.options.map((o) => {
                const on = picked === o.value
                return (
                    <li key={String(o.value)}>
                        <button
                            type={native ? "submit" : "button"}
                            name={native ? "s" : undefined}
                            value={native ? String(o.value) : undefined}
                            aria-pressed={on}
                            onClick={(e) => {
                                e.preventDefault()
                                if (sent.current) return
                                sent.current = true
                                setPicked(o.value)
                                // Um respiro para a marcação aparecer antes de avançar.
                                setTimeout(() => onPick(o.value), 160)
                            }}
                            className={optionCls(on)}
                        >
                            <span aria-hidden className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${on ? "border-ap-purple" : "border-ap-border"}`}>
                                {on && <span className="h-2.5 w-2.5 rounded-full bg-ap-purple" />}
                            </span>
                            <span>
                                <span className="block font-semibold leading-snug">{o.label}</span>
                                {o.hint && <span className="block text-sm text-ap-muted">{o.hint}</span>}
                            </span>
                        </button>
                    </li>
                )
            })}
        </ul>
    )
    if (!native) return list
    return (
        <form method="get" action="/lp">
            {native.a && <input type="hidden" name="a" value={native.a} />}
            {list}
        </form>
    )
}

function Multi({ q, value, onDone }: { q: Extract<Question, { kind: "multi" }>; value?: ProfileItem[]; onDone: (v: ProfileItem[]) => void }) {
    const [sel, setSel] = useState<ProfileItem[]>(value ?? [])
    const toggle = (v: ProfileItem) => setSel((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]))
    return (
        <div className="mt-6">
            <ul className="grid gap-2" aria-labelledby={`q-${q.id}`}>
                {q.options.map((o) => {
                    const v = o.value as ProfileItem
                    const on = sel.includes(v)
                    return (
                        <li key={v}>
                            <button type="button" role="checkbox" aria-checked={on} onClick={() => toggle(v)} className={optionCls(on)}>
                                <span aria-hidden className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border-2 ${on ? "border-ap-purple bg-ap-purple text-white" : "border-ap-border"}`}>
                                    {on && <Check size={14} strokeWidth={3} />}
                                </span>
                                <span className="font-medium leading-snug">{o.label}</span>
                            </button>
                        </li>
                    )
                })}
            </ul>
            <Btn className="mt-6 w-full" onClick={() => onDone(sel)}>
                {sel.length ? "Continuar" : "Nenhuma dessas, continuar"}
            </Btn>
        </div>
    )
}

function NumberInput({ q, value, onDone }: { q: Extract<Question, { kind: "number" }>; value?: number; onDone: (v: number) => void }) {
    const [raw, setRaw] = useState(value === undefined ? "" : String(value))
    const n = raw === "" ? NaN : Math.min(q.max, Number(raw))
    const set = (v: number) => setRaw(String(Math.max(q.min, Math.min(q.max, v))))
    const valid = !Number.isNaN(n) && n >= q.min
    const submit = (e: FormEvent) => {
        e.preventDefault()
        if (valid) onDone(n)
    }
    const step = "flex h-14 w-14 shrink-0 items-center justify-center rounded-ap-control border border-ap-border bg-white text-2xl hover:border-ap-purple"
    return (
        <form onSubmit={submit} className="mt-6">
            <div className="flex items-center gap-3">
                <button type="button" className={step} aria-label="Diminuir" onClick={() => set((Number.isNaN(n) ? q.min : n) - 1)}>
                    −
                </button>
                <input
                    aria-labelledby={`q-${q.id}`}
                    inputMode="numeric"
                    autoComplete="off"
                    value={raw}
                    placeholder="0"
                    onChange={(e) => setRaw(e.target.value.replace(/\D/g, "").slice(0, 3))}
                    className="h-16 min-w-0 flex-1 rounded-ap-control border border-ap-border bg-ap-surface text-center font-ap-display text-4xl font-bold placeholder:text-ap-border"
                />
                <button type="button" className={step} aria-label="Aumentar" onClick={() => set((Number.isNaN(n) ? q.min : n) + 1)}>
                    +
                </button>
            </div>
            <p className="mt-2 text-center text-sm text-ap-muted">{q.unit}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2" role="group" aria-label="Valores rápidos">
                {q.quick.map((x) => (
                    <button
                        key={x}
                        type="button"
                        aria-pressed={n === x}
                        onClick={() => setRaw(String(x))}
                        className={`min-h-11 min-w-[3.25rem] rounded-full border px-4 font-semibold ${n === x ? "border-ap-purple bg-ap-purple text-white" : "border-ap-border bg-white hover:border-ap-purple"}`}
                    >
                        {x}
                    </button>
                ))}
            </div>
            <Btn type="submit" disabled={!valid} className="mt-8 w-full">
                Continuar
            </Btn>
        </form>
    )
}

function TextInput({ q, value, onDone }: { q: Extract<Question, { kind: "text" }>; value?: string; onDone: (v: string) => void }) {
    const [v, setV] = useState(value ?? "")
    const ok = v.trim().length >= 2
    return (
        <form
            className="mt-6"
            onSubmit={(e) => {
                e.preventDefault()
                if (ok) onDone(v.trim())
            }}
        >
            <input
                aria-labelledby={`q-${q.id}`}
                value={v}
                maxLength={80}
                autoComplete="organization-title"
                enterKeyHint="go"
                placeholder="Ex.: Vendedor"
                onChange={(e) => setV(e.target.value)}
                className="h-14 w-full rounded-ap-control border border-ap-border bg-white px-4 text-lg placeholder:text-ap-muted focus:border-ap-purple"
            />
            {q.suggestions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Sugestões">
                    {q.suggestions.map((sug) => (
                        <button key={sug} type="button" onClick={() => setV(sug)} className="min-h-11 rounded-full border border-ap-border bg-white px-4 text-sm font-medium hover:border-ap-purple">
                            {sug}
                        </button>
                    ))}
                </div>
            )}
            <Btn type="submit" disabled={!ok} className="mt-8 w-full">
                Gerar meu diagnóstico
            </Btn>
        </form>
    )
}

// ── Ponte (epifania com os números dela) ─────────────────────────────────────

const FEELING_OPEN: Record<string, string> = {
    cv: "Você acha que o problema é o currículo. Antes, olha a conta:",
    me: "Você acha que não é bom o suficiente. Antes de concordar, olha a conta:",
    filled: "Você acha que a vaga já tinha alguém escolhido. Às vezes tinha. Mas olha a conta:",
    numb: "Você disse que virou rotina. Olha quanto essa rotina já custou:",
}

const Stat = ({ value, label, tone }: { value: ReactNode; label: string; tone?: "bad" }) => (
    <div className="rounded-ap-control bg-ap-surface p-4">
        <p className={`font-ap-display text-3xl font-bold ${tone === "bad" ? "text-ap-error" : ""}`}>{value}</p>
        <p className="mt-1 text-sm text-ap-muted">{label}</p>
    </div>
)

function Bridge({ answers: a, left, onNext }: { answers: Answers; left: number; onNext: () => void }) {
    const sent = appsSoFar(a)
    const hours = hoursSoFar(a)
    const rate = responseRate(a)
    const applies = (a.appsPerWeek ?? 0) > 0
    return (
        <div className="ap-enter mx-auto max-w-xl pt-8">
            <Card className="p-5 sm:p-8">
                <Eyebrow>Antes de continuar</Eyebrow>
                <Title className="mt-2 !text-2xl sm:!text-[1.75rem]">
                    {applies ? FEELING_OPEN[a.feeling ?? "cv"] : "Você ainda não manda currículo toda semana. Antes de começar, entenda o jogo:"}
                </Title>
                {applies && (
                    <div className="mt-6 grid grid-cols-2 gap-3">
                        {sent !== null && <Stat value={sent.toLocaleString("pt-BR")} label="candidaturas enviadas, no mínimo" />}
                        {hours !== null && <Stat value={`${fmt1(hours)} h`} label="da sua vida nisso, no mínimo" />}
                        {rate !== null && (
                            <Stat
                                value={`${a.responsesLastMonth}/${Math.round((a.appsPerWeek ?? 0) * WEEKS_PER_MONTH)}`}
                                label="respostas no último mês"
                                tone={rate === 0 ? "bad" : undefined}
                            />
                        )}
                        <Stat value={a.appsPerWeek} label="candidaturas por semana" />
                    </div>
                )}
                <p className="mt-6 text-ap-muted">
                    Vaga concorrida passa de 100 candidaturas, e filtros descartam currículos antes de alguém ler. À mão, ninguém alcança esse volume.
                </p>
                <p className="mt-6 font-ap-display text-2xl font-bold leading-[1.3]">
                    Você não é um candidato ruim.
                    <br />
                    <span className="ap-gradient-text">Você é um candidato invisível.</span>
                </p>
                <Btn className="mt-8 w-full" onClick={onNext}>
                    Continuar · faltam {left} {left === 1 ? "pergunta" : "perguntas"}
                </Btn>
            </Card>
        </div>
    )
}
