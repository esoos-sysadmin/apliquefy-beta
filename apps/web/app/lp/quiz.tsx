"use client"

import Link from "next/link"
import dynamic from "next/dynamic"
import { useEffect, useRef, useState, type FormEvent } from "react"
import {
    appsSoFar,
    describeAnswers,
    fmt1,
    hoursSoFar,
    initialState,
    nextQuizScreen,
    questionsFor,
    responseRate,
    type Answers,
    type FunnelState,
    type Question,
    type Screen,
    type Segment,
} from "./funnel"
import { Btn, Kicker, Line, Title } from "./ui"

// Tudo depois do quiz vai num chunk separado: a primeira pergunta não paga por ele.
const Report = dynamic(() => import("./report"), {
    loading: () => <p className="py-16 text-center font-lp-mono text-sm text-lp-ink2">Carregando…</p>,
})

const KEY = "apliquefy-lp-v1"
const PRE_PAYMENT = new Set<Screen>(["checkout", "bump_cv", "bump_segment", "report"])

export type Nav = {
    s: FunnelState
    go: (screen: Screen, patch?: Partial<FunnelState>) => void
    patch: (p: Partial<FunnelState>) => void
    file: React.RefObject<File | null>
}

const HERO: Record<Segment | "default", string> = {
    default: "Você manda currículo e ninguém responde. Vamos descobrir onde ele trava.",
    dev: "Vaga remota não responde? Veja o que o filtro está vendo no seu currículo.",
    exec: "Em transição e sem retorno? Veja seu currículo do jeito que o filtro vê.",
    varejo: "Mandou currículo pra todo lado e ninguém chamou? Vamos descobrir onde ele trava.",
}

export function Funnel({ ad, start }: { ad?: Segment; start?: Segment }) {
    const [s, setS] = useState<FunnelState>(() =>
        start ? { ...initialState, screen: nextQuizScreen({ segment: start }, "segment"), answers: { segment: start } } : initialState,
    )
    const [ready, setReady] = useState(false)
    const file = useRef<File | null>(null)
    const paid = useRef(false)
    const firstScreen = useRef(true)
    paid.current = Boolean(s.paidAt)

    useEffect(() => {
        let saved: FunnelState | null = null
        try {
            saved = JSON.parse(sessionStorage.getItem(KEY) ?? "null")
        } catch {
            // sessionStorage indisponível (aba anônima, bloqueio): segue do zero
        }
        // O File não sobrevive a um reload: sem texto extraído, volta para o upload.
        if (saved?.screen === "analysis" && saved.answers.cv?.kind === "file" && !saved.answers.cv.text) saved.screen = "cv"
        // A escolha da pergunta 1 feita pela URL (antes de hidratar) vence um progresso salvo de outro segmento.
        if (saved && start && saved.answers.segment !== start) saved = null
        if (saved) setS(saved)
        setReady(true)
        history.replaceState({ screen: saved?.screen ?? (start ? "area" : "segment") }, "", ad ? `/lp?a=${ad}` : "/lp")

        const onPop = (e: PopStateEvent) => {
            const screen = e.state?.screen as Screen | undefined
            if (!screen) return
            // Depois de pago, "voltar" não reabre checkout nem upsell.
            if (paid.current && PRE_PAYMENT.has(screen)) return history.go(1)
            setS((p) => ({ ...p, screen }))
        }
        addEventListener("popstate", onPop)
        return () => removeEventListener("popstate", onPop)
    }, [ad, start]) // props do servidor: fixas durante a vida da página

    useEffect(() => {
        if (!ready) return
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

    // Pré-carrega o chunk do relatório assim que a pessoa engaja (primeira resposta).
    useEffect(() => {
        if (s.screen !== "segment") void import("./report")
    }, [s.screen])

    const go: Nav["go"] = (screen, patch = {}) => {
        setS((p) => ({ ...p, ...patch, screen }))
        history.pushState({ screen }, "")
    }
    const patch: Nav["patch"] = (p) => setS((prev) => ({ ...prev, ...p }))

    const answer = (p: Partial<Answers>) => {
        const answers = { ...s.answers, ...p }
        // Trocar o segmento invalida o que depende dele (áreas e faixas salariais mudam).
        if (p.segment && p.segment !== s.answers.segment) {
            delete answers.area
            delete answers.income
            delete answers.raise
            delete answers.english
        }
        go(nextQuizScreen(answers, s.screen), { answers })
    }

    const qs = questionsFor(s.answers)
    // Conta assumindo que a pessoa se candidata: o total só diminui depois, nunca cresce no meio do caminho.
    const total = questionsFor({ appsPerWeek: 1, ...s.answers }).length
    const qIndex = qs.findIndex((q) => q.id === (s.screen === "bridge" ? "feeling" : s.screen))
    const q = qs[qIndex]
    const inQuiz = qIndex >= 0 || s.screen === "bridge"

    return (
        <>
            <header className="lp-noprint sticky top-0 z-10 border-b border-lp-rule bg-lp-paper">
                <div className="mx-auto flex h-12 max-w-[34rem] items-center justify-between px-4">
                    {s.screen !== "segment" && !s.paidAt ? (
                        <button type="button" onClick={() => history.back()} className="-ml-2 min-h-11 px-2 font-lp-mono text-sm">
                            ← Voltar
                        </button>
                    ) : (
                        <span className="font-lp-mono text-xs tracking-[0.24em]">APLIQUEFY</span>
                    )}
                    {inQuiz && (
                        <span className="font-lp-mono text-xs text-lp-ink2">
                            Campo {String(qIndex + 1).padStart(2, "0")} de {String(total).padStart(2, "0")}
                        </span>
                    )}
                </div>
                {inQuiz && (
                    <div className="h-[3px] bg-lp-field" aria-hidden>
                        <div
                            className="h-full bg-lp-ink transition-[width] duration-300"
                            style={{ width: `${((qIndex + (s.screen === "bridge" ? 1 : 0)) / total) * 100}%` }}
                        />
                    </div>
                )}
            </header>

            <main className="mx-auto max-w-[34rem] px-4 pb-16">
                {s.screen === "segment" ? (
                    <Hero ad={ad} q={qs[0]!} answers={s.answers} onAnswer={answer} />
                ) : s.screen === "bridge" ? (
                    <Bridge answers={s.answers} left={qs.length - qIndex - 1} onNext={() => go(nextQuizScreen(s.answers, "bridge"))} />
                ) : q ? (
                    <div key={q.id} className="lp-enter pt-8">
                        <Kicker>Campo {String(qIndex + 1).padStart(2, "0")}</Kicker>
                        <QuestionView q={q} answers={s.answers} onAnswer={answer} onFile={(f) => (file.current = f)} titleAs="h1" />
                        <Ledger answers={s.answers} />
                    </div>
                ) : (
                    <Report s={s} go={go} patch={patch} file={file} />
                )}
            </main>
        </>
    )
}

function Hero({ ad, q, answers, onAnswer }: { ad?: Segment; q: Question; answers: Answers; onAnswer: (p: Partial<Answers>) => void }) {
    return (
        <div className="pt-7">
            <Kicker>Laudo de candidatura · gratuito</Kicker>
            {/* LCP: texto puro, sem animação de entrada. */}
            <h1 id="screen-title" tabIndex={-1} className="mt-3 font-lp-serif text-[2.125rem] leading-[1.08] outline-none sm:text-5xl">
                {HERO[ad ?? "default"]}
            </h1>
            <p className="mt-4 text-lp-ink2">
                Responda algumas perguntas, envie seu currículo e receba um laudo com nota, problemas encontrados e quanto tempo você gasta se
                candidatando. Grátis, sem cartão.
            </p>
            <div className="mt-8 border-t-2 border-lp-ink pt-5">
                <Kicker>Campo 01</Kicker>
                <QuestionView q={q} answers={answers} onAnswer={onAnswer} titleAs="h2" native={{ a: ad }} />
            </div>
            <p className="mt-10 text-sm text-lp-ink2">
                <Link href="/politica-de-privacidade" className="underline">
                    Privacidade
                </Link>{" "}
                ·{" "}
                <Link href="/termos-de-servico" className="underline">
                    Termos
                </Link>
            </p>
        </div>
    )
}

type QProps = {
    q: Question
    answers: Answers
    onAnswer: (p: Partial<Answers>) => void
    onFile?: (f: File) => void
    titleAs: "h1" | "h2"
    native?: { a?: Segment }
}

function QuestionView({ q, answers, onAnswer, onFile, titleAs, native }: QProps) {
    const H = titleAs
    const heading = (
        <>
            <H
                id={titleAs === "h1" ? "screen-title" : undefined}
                tabIndex={titleAs === "h1" ? -1 : undefined}
                className="mt-2 font-lp-serif text-[1.625rem] leading-[1.15] outline-none"
            >
                <span id={`q-${q.id}`}>{q.title}</span>
            </H>
            {q.help && <p className="mt-2 text-lp-ink2">{q.help}</p>}
        </>
    )
    if (q.kind === "choice")
        return (
            <>
                {heading}
                <Choice q={q} value={answers[q.id]} onPick={(v) => onAnswer({ [q.id]: v })} native={native} />
            </>
        )
    if (q.kind === "number")
        return (
            <>
                {heading}
                <NumberInput q={q} value={answers[q.id] as number | undefined} onDone={(v) => onAnswer({ [q.id]: v })} />
            </>
        )
    if (q.kind === "text")
        return (
            <>
                {heading}
                <TextInput q={q} value={answers.targetRole} onDone={(v) => onAnswer({ targetRole: v })} />
            </>
        )
    return (
        <>
            {heading}
            <CvInputView onAnswer={onAnswer} onFile={onFile!} />
        </>
    )
}

type ChoiceProps = { q: Extract<Question, { kind: "choice" }>; value: unknown; onPick: (v: string | number) => void; native?: { a?: Segment } }

/**
 * Com `native`, as opções são um form GET de verdade: tocar antes do JS hidratar (4G lento)
 * recarrega em /lp?s=<valor> já na pergunta 2. Depois de hidratar, o clique é tratado aqui.
 */
function Choice({ q, value, onPick, native }: ChoiceProps) {
    const [picked, setPicked] = useState<unknown>(value)
    const sent = useRef(false)
    const list = (
        <ul className="mt-5 grid gap-2" aria-labelledby={`q-${q.id}`}>
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
                            className={`flex min-h-[3.5rem] w-full items-center gap-3 border-2 px-4 py-3 text-left ${on ? "border-lp-ink bg-lp-ink text-lp-paper" : "border-lp-ink bg-transparent"}`}
                        >
                            <span aria-hidden className={`h-4 w-4 shrink-0 border-2 ${on ? "border-lp-paper bg-lp-paper" : "border-lp-ink"}`} />
                            <span>
                                <span className="block font-semibold leading-snug">{o.label}</span>
                                {o.hint && <span className={`block text-[0.9375rem] ${on ? "text-lp-paper" : "text-lp-ink2"}`}>{o.hint}</span>}
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

function NumberInput({ q, value, onDone }: { q: Extract<Question, { kind: "number" }>; value?: number; onDone: (v: number) => void }) {
    const [raw, setRaw] = useState(value === undefined ? "" : String(value))
    const n = raw === "" ? NaN : Math.min(q.max, Number(raw))
    const set = (v: number) => setRaw(String(Math.max(q.min, Math.min(q.max, v))))
    const valid = !Number.isNaN(n) && n >= q.min
    const submit = (e: FormEvent) => {
        e.preventDefault()
        if (valid) onDone(n)
    }
    const step = "flex h-14 w-14 shrink-0 items-center justify-center border-2 border-lp-ink text-2xl"
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
                    placeholder="—"
                    onChange={(e) => setRaw(e.target.value.replace(/\D/g, "").slice(0, 3))}
                    className="h-14 min-w-0 flex-1 border-b-2 border-lp-ink bg-transparent text-center font-lp-serif text-5xl outline-offset-4 placeholder:text-lp-rule"
                />
                <button type="button" className={step} aria-label="Aumentar" onClick={() => set((Number.isNaN(n) ? q.min : n) + 1)}>
                    +
                </button>
            </div>
            <p className="mt-2 text-center font-lp-mono text-sm text-lp-ink2">{q.unit}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2" role="group" aria-label="Valores rápidos">
                {q.quick.map((x) => (
                    <button
                        key={x}
                        type="button"
                        aria-pressed={n === x}
                        onClick={() => setRaw(String(x))}
                        className={`min-h-11 min-w-[3.25rem] border-2 border-lp-ink px-3 font-lp-mono ${n === x ? "bg-lp-ink text-lp-paper" : ""}`}
                    >
                        {x}
                    </button>
                ))}
            </div>
            <Btn type="submit" disabled={!valid} className="mt-8">
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
                enterKeyHint="next"
                placeholder="Ex.: Vendedor"
                onChange={(e) => setV(e.target.value)}
                className="h-14 w-full border-2 border-lp-ink bg-lp-field px-4 text-lg placeholder:text-lp-ink2"
            />
            {q.suggestions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Sugestões">
                    {q.suggestions.map((sug) => (
                        <button key={sug} type="button" onClick={() => setV(sug)} className="min-h-11 border border-lp-ink px-3 text-[0.9375rem]">
                            {sug}
                        </button>
                    ))}
                </div>
            )}
            <Btn type="submit" disabled={!ok} className="mt-8">
                Continuar
            </Btn>
        </form>
    )
}

const MAX_FILE = 10 * 1024 * 1024

function CvInputView({ onAnswer, onFile }: { onAnswer: (p: Partial<Answers>) => void; onFile: (f: File) => void }) {
    const [paste, setPaste] = useState(false)
    const [text, setText] = useState("")
    const [error, setError] = useState("")
    const words = text.split(/\s+/).filter(Boolean).length

    if (paste)
        return (
            <form
                className="mt-6"
                onSubmit={(e) => {
                    e.preventDefault()
                    if (words >= 40) onAnswer({ cv: { kind: "text", text } })
                }}
            >
                <label htmlFor="cv-text" className="font-lp-mono text-sm text-lp-ink2">
                    Cole o texto do currículo
                </label>
                <textarea
                    id="cv-text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={10}
                    className="mt-2 w-full border-2 border-lp-ink bg-lp-field p-3 text-base"
                />
                <p className="mt-1 font-lp-mono text-sm text-lp-ink2" aria-live="polite">
                    {words} palavras{words < 40 && " · mínimo 40"}
                </p>
                <Btn type="submit" disabled={words < 40} className="mt-6">
                    Analisar este texto
                </Btn>
                <Btn variant="secondary" className="mt-2" onClick={() => setPaste(false)}>
                    Voltar às opções
                </Btn>
            </form>
        )

    return (
        <div className="mt-6 grid gap-2">
            <label className="flex min-h-[3.5rem] cursor-pointer items-center justify-center bg-lp-ink px-5 font-semibold text-lp-paper focus-within:outline focus-within:outline-[3px] focus-within:outline-offset-2 focus-within:outline-lp-act">
                <input
                    type="file"
                    accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                    className="sr-only"
                    onChange={(e) => {
                        const f = e.target.files?.[0]
                        if (!f) return
                        if (f.size > MAX_FILE) return setError("Arquivo maior que 10 MB. Tente o PDF exportado ou cole o texto.")
                        onFile(f)
                        onAnswer({ cv: { kind: "file", name: f.name, size: f.size, text: "" } })
                    }}
                />
                Enviar arquivo (PDF ou Word)
            </label>
            <Btn variant="secondary" onClick={() => setPaste(true)}>
                Colar o texto
            </Btn>
            <Btn variant="secondary" onClick={() => onAnswer({ cv: { kind: "none" } })}>
                Não tenho currículo
            </Btn>
            {error && (
                <p role="alert" className="text-lp-bad">
                    {error}
                </p>
            )}
            <p className="mt-3 text-[0.9375rem] text-lp-ink2">
                No celular, o currículo costuma estar em <b>Downloads</b>, no <b>Google Drive</b> ou numa conversa do <b>WhatsApp</b>. O arquivo é
                lido aqui no seu aparelho; nada é enviado neste passo.
            </p>
        </div>
    )
}

function Ledger({ answers }: { answers: Answers }) {
    const lines = describeAnswers(answers)
    if (!lines.length) return null
    return (
        <details className="mt-10 border-t border-lp-rule pt-3">
            <summary className="cursor-pointer font-lp-mono text-xs uppercase tracking-[0.16em] text-lp-ink2">
                Seu laudo · {lines.length} {lines.length === 1 ? "campo preenchido" : "campos preenchidos"}
            </summary>
            <div className="mt-2">
                {lines.map((l) => (
                    <Line key={l.id} label={l.label} value={l.value} />
                ))}
            </div>
        </details>
    )
}

const FEELING_OPEN: Record<string, string> = {
    cv: "Você disse que acha que o problema é o currículo. Ele pode ter problemas, e o laudo vai mostrar quais. Mas antes, olha a conta:",
    me: "Você disse que pensa que não é bom o suficiente. Antes de concordar com isso, olha a conta:",
    filled: "Você disse que acha que a vaga já tinha alguém escolhido. Às vezes tinha. Mas olha a conta:",
    numb: "Você disse que já nem pensa mais, que virou rotina. Olha quanto essa rotina já custou:",
}

/** Epiphany bridge: tira a culpa da pessoa usando os números dela, sem estatística de terceiros. */
function Bridge({ answers: a, left, onNext }: { answers: Answers; left: number; onNext: () => void }) {
    const sent = appsSoFar(a)
    const hours = hoursSoFar(a)
    const rate = responseRate(a)
    const monthApps = (a.appsPerWeek ?? 0) * (52 / 12)
    return (
        <div className="lp-enter pt-8">
            <Kicker>Antes de continuar</Kicker>
            <Title className="mt-2">
                {a.appsPerWeek
                    ? FEELING_OPEN[a.feeling ?? "cv"]
                    : "Você ainda não está mandando currículo toda semana. Antes de começar, vale entender o jogo:"}
            </Title>
            {(a.appsPerWeek ?? 0) > 0 && (
                <>
                    <div className="mt-5 border-y-2 border-lp-ink py-2">
                        <Line label="Candidaturas por semana" value={a.appsPerWeek ?? 0} />
                        {sent !== null && <Line label="Enviadas desde o início" value={`pelo menos ${sent}`} />}
                        {hours !== null && <Line label="Horas investidas" value={`pelo menos ${fmt1(hours)} h`} />}
                        {rate !== null && (
                            <Line
                                label="Respostas no último mês"
                                value={`${a.responsesLastMonth} de ~${Math.round(monthApps)}`}
                                tone={rate === 0 ? "bad" : undefined}
                            />
                        )}
                    </div>
                    <p className="mt-1 font-lp-mono text-xs text-lp-ink2">Calculado com as suas respostas, usando o início de cada faixa.</p>
                </>
            )}
            <div className="mt-6 space-y-4">
                <p>
                    Abra uma vaga concorrida no LinkedIn: muitas mostram, na própria página, que já passaram de 100 candidaturas. A empresa pode usar
                    perguntas de triagem e filtros que ordenam e descartam currículos antes de qualquer pessoa ler.
                </p>
                <p>
                    Quem se candidata à mão consegue enviar poucas por semana, e cada uma passa pelo mesmo filtro. Isso não mede competência. Mede
                    volume e visibilidade.
                </p>
            </div>
            <p className="mt-8 font-lp-serif text-[1.875rem] leading-[1.12]">
                Você não é um candidato ruim.
                <br />
                <em>Você é um candidato invisível.</em>
            </p>
            <p className="mt-4 text-lp-ink2">Os dois problemas têm conserto. O seu laudo vai mostrar onde começar.</p>
            <Btn className="mt-8" onClick={onNext}>
                Continuar · faltam {left} {left === 1 ? "pergunta" : "perguntas"}
            </Btn>
        </div>
    )
}
