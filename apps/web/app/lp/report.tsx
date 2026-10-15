"use client"

import { ArrowLeft, ArrowRight, Check, Clock, Lock, Sparkles, TrendingUp, TriangleAlert } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState, type FormEvent, type PointerEvent, type ReactNode } from "react"
import { formatBRL, PLANS, type Plan } from "../lib/constants/plans"
import {
    BUMPS,
    brl,
    canRunDesktop,
    cartTotal,
    COST_PER_APPLICATION,
    dailyLimitFor,
    destination,
    diagnose,
    fmt1,
    formatDuration,
    horizonWeeks,
    hoursPerMonth,
    hoursSoFar,
    OTOS,
    planAppsPerWeek,
    responseRate,
    scoreLabel,
    segmentBump,
    segmentList,
    targetSalary,
    weeksTo,
    WEEKS_PER_MONTH,
    type Answers,
    type FunnelState,
    type OtoId,
    type Screen,
} from "./funnel"
import type { Nav } from "./quiz"
import { Btn, Card, Estimate, Eyebrow, Symbol, Title } from "./ui"

export default function Report(nav: Nav) {
    switch (nav.s.screen) {
        case "analysis":
            return <Analysis {...nav} />
        case "gate":
            return <Gate {...nav} />
        case "report":
            return <Laudo {...nav} />
        case "pricing":
            return <Pricing {...nav} />
        case "bump_cv":
            return <BumpCv {...nav} />
        case "bump_segment":
            return <BumpSegment {...nav} />
        case "bump_letter":
            return <BumpLetter {...nav} />
        case "bump_jobs":
            return <BumpJobs {...nav} />
        case "checkout":
            return <Checkout {...nav} />
        case "oto":
        case "downsell":
            return <Oto key={nav.s.screen} {...nav} />
        case "done":
            return <Done {...nav} />
    }
    return null
}

const PRO = PLANS[1]
const pct = (r: number) => `${(r * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`
const firstName = (s: FunnelState) => s.contact?.name.trim().split(/\s+/)[0]
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// ── 4. Análise ───────────────────────────────────────────────────────────────

function Analysis({ s, go }: Nav) {
    const a = s.answers
    const d = diagnose(a)
    const h = hoursPerMonth(a)
    // Cada linha mostra um resultado de verdade, calculado das respostas.
    const steps = [
        { label: "Lendo suas respostas", result: `${Object.keys(a).length} respostas` },
        { label: "Calculando seu índice de visibilidade", result: `${d.score}/100 · ${scoreLabel(d.score)}` },
        { label: "Identificando o que trava suas candidaturas", result: `${d.problems.length} ${d.problems.length === 1 ? "ponto" : "pontos"} de atenção` },
        { label: "Medindo o tempo que a busca consome", result: h ? `pelo menos ${fmt1(h)} h por mês` : "sem candidaturas semanais" },
        { label: "Projetando seu alcance com o Apliquefy", result: `destino: ${destination(a).apps.toLocaleString("pt-BR")} candidaturas` },
    ]
    const [done, setDone] = useState(0)
    const started = useRef(false)

    useEffect(() => {
        if (started.current) return
        started.current = true
        void (async () => {
            for (let i = 1; i <= steps.length; i++) {
                await sleep(850)
                setDone(i)
            }
        })()
    }, [steps.length])

    const finished = done === steps.length
    return (
        <div className="ap-enter mx-auto max-w-xl pt-10">
            <Card className="p-6 sm:p-8">
                <div className="flex flex-col items-center text-center">
                    <div className="relative h-24 w-24">
                        {!finished && (
                            <svg viewBox="0 0 100 100" className="ap-spin absolute inset-0" aria-hidden>
                                <circle cx="50" cy="50" r="46" fill="none" stroke="#F0E9FF" strokeWidth="6" />
                                <circle cx="50" cy="50" r="46" fill="none" stroke="#7A3BFF" strokeWidth="6" strokeLinecap="round" pathLength={100} strokeDasharray="28 72" />
                            </svg>
                        )}
                        <Symbol className={`absolute inset-4 ${finished ? "" : "ap-pulse"}`} />
                    </div>
                    <Title className="mt-5 !text-2xl">{finished ? "Seu diagnóstico está pronto." : "Analisando o seu perfil…"}</Title>
                    <p className="mt-1 text-ap-muted">{finished ? "Cruzamos suas respostas com o funcionamento das plataformas." : "Cruzando suas respostas, um passo de cada vez."}</p>
                </div>

                <div className="mt-6 h-2 overflow-hidden rounded-full bg-ap-surface-purple" role="progressbar" aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={done}>
                    <div className={`h-full rounded-full transition-[width] duration-500 ${finished ? "bg-ap-success" : "ap-shimmer"}`} style={{ width: `${Math.max(8, (done / steps.length) * 100)}%` }} />
                </div>

                <ol className="mt-6 space-y-3" aria-live="polite">
                    {steps.map((st, i) => {
                        const state = i < done ? "done" : i === done ? "running" : "waiting"
                        return (
                            <li key={st.label} className={`flex items-start gap-3 ${state === "waiting" ? "opacity-40" : ""}`}>
                                <span
                                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${state === "done" ? "bg-ap-success text-white" : "bg-ap-surface-purple text-ap-purple"}`}
                                >
                                    {state === "done" ? <Check size={14} strokeWidth={3} aria-hidden /> : <Sparkles size={13} className={state === "running" ? "ap-pulse" : ""} aria-hidden />}
                                </span>
                                <span>
                                    <span className="block font-medium">{st.label}</span>
                                    {state === "done" && <span className="block text-sm text-ap-muted">{st.result}</span>}
                                </span>
                            </li>
                        )
                    })}
                </ol>

                {finished && (
                    <Btn className="mt-8 w-full" onClick={() => go("gate")}>
                        Ver meu resultado <ArrowRight size={18} aria-hidden />
                    </Btn>
                )}
            </Card>
        </div>
    )
}

// ── 5. Gate: manchete à mostra, o resto borrado até entregar o contato ──

const input = "mt-1 h-12 w-full rounded-ap-control border border-ap-border bg-white px-3 text-base focus:border-ap-purple"

function maskPhone(v: string) {
    const d = v.replace(/\D/g, "").slice(0, 11)
    if (d.length <= 2) return d
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
    return `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`
}

function Gate({ s, go }: Nav) {
    const d = diagnose(s.answers)
    const [phone, setPhone] = useState(s.contact?.whatsapp ?? "")
    const phoneOk = /^\d{10,11}$/.test(phone.replace(/\D/g, ""))
    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!phoneOk) return
        const f = new FormData(e.currentTarget)
        // ponytail: lead e envio do PDF ainda não existem; gravar via POST /api/leads e disparar
        // WhatsApp/e-mail antes de ligar o anúncio (a copy abaixo promete o envio).
        go("report", {
            issuedAt: Date.now(),
            contact: {
                name: String(f.get("name")).trim(),
                email: String(f.get("email")).trim(),
                whatsapp: phone,
                marketing: f.get("marketing") === "on",
            },
        })
    }
    return (
        <div className="ap-enter mx-auto max-w-xl pt-10">
            <Card className="overflow-hidden">
                <div className="bg-ap-ink p-6 text-white sm:p-8">
                    <Eyebrow className="!text-white/60">Seu resultado</Eyebrow>
                    <div className="mt-3 flex items-end gap-4">
                        <span className="font-ap-display text-6xl font-bold leading-none">{d.score}</span>
                        <span className="pb-1">
                            <span className="block text-sm text-white/60">de 100</span>
                            <span className="block font-semibold">{scoreLabel(d.score)}</span>
                        </span>
                    </div>
                    <div aria-hidden className="ap-blur mt-5 space-y-2">
                        {d.problems.map((p) => (
                            <div key={p.id} className="h-10 rounded-ap-control bg-white/15" />
                        ))}
                        <div className="h-24 rounded-ap-control bg-gradient-to-r from-ap-purple/60 to-ap-orange/60" />
                    </div>
                    <p className="mt-4 flex items-center gap-2 text-sm text-white/80">
                        <Lock size={14} aria-hidden /> {d.problems.length} pontos de atenção, seu tempo e sua projeção estão no laudo completo.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-4 p-6 sm:p-8">
                    <h1 id="screen-title" tabIndex={-1} className="font-ap-display text-2xl font-bold outline-none">
                        Para onde enviamos o seu laudo?
                    </h1>
                    <p className="!mt-1 text-ap-muted">Você vê o laudo agora e recebe a versão em PDF no WhatsApp e no e-mail.</p>
                    <label className="block">
                        <span className="text-sm font-medium">Nome</span>
                        <input name="name" required autoComplete="given-name" defaultValue={s.contact?.name} className={input} />
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium">WhatsApp</span>
                        <input
                            name="whatsapp"
                            type="tel"
                            required
                            autoComplete="tel-national"
                            inputMode="tel"
                            placeholder="(11) 91234-5678"
                            value={phone}
                            onChange={(e) => setPhone(maskPhone(e.target.value))}
                            aria-invalid={phone.length > 0 && !phoneOk}
                            aria-describedby="phone-help"
                            className={input}
                        />
                        <span id="phone-help" className={`mt-1 block text-sm ${phone.length > 0 && !phoneOk ? "text-ap-error" : "text-ap-muted"}`}>
                            {phone.length > 0 && !phoneOk ? "Digite o DDD e o número." : "Com DDD. É por aqui que o PDF chega."}
                        </span>
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium">E-mail</span>
                        <input name="email" type="email" required autoComplete="email" inputMode="email" defaultValue={s.contact?.email} className={input} />
                    </label>
                    <label className="flex items-start gap-3">
                        <input name="marketing" type="checkbox" defaultChecked={s.contact?.marketing} className="mt-1 h-5 w-5 shrink-0 accent-[#7A3BFF]" />
                        <span className="text-sm">Quero receber dicas de busca de emprego.</span>
                    </label>
                    <Btn type="submit" disabled={!phoneOk} className="w-full">
                        Ver meu laudo completo <ArrowRight size={18} aria-hidden />
                    </Btn>
                    <p className="text-center text-xs text-ap-muted">
                        Seus dados ficam com a Apliquefy.{" "}
                        <a href="/politica-de-privacidade" target="_blank" className="underline">
                            Política de privacidade
                        </a>
                    </p>
                </form>
            </Card>
        </div>
    )
}

// ── 6. Laudo em páginas: pouco texto, muito gráfico ──

const PAGES = ["Resultado", "Seu tempo", "Projeção"] as const

function Laudo({ s, go }: Nav) {
    const [page, setPage] = useState(0)
    const top = useRef<HTMLDivElement>(null)
    const to = (p: number) => {
        setPage(p)
        top.current?.scrollIntoView({ block: "start" })
    }
    const name = firstName(s)
    return (
        <div ref={top} className="mx-auto max-w-3xl scroll-mt-20 pt-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <Eyebrow>Laudo de candidatura · {new Date(s.issuedAt ?? Date.now()).toLocaleDateString("pt-BR")}</Eyebrow>
                    <Title className="mt-1">{name ? `${name}, este é o seu laudo.` : "Seu laudo"}</Title>
                </div>
            </div>
            <nav aria-label="Páginas do laudo" className="mt-5 grid grid-cols-3 gap-2">
                {PAGES.map((p, i) => (
                    <button
                        key={p}
                        type="button"
                        aria-current={page === i ? "step" : undefined}
                        onClick={() => to(i)}
                        className={`rounded-ap-control border px-2 py-2 text-left text-sm transition-colors ${page === i ? "border-ap-purple bg-ap-surface-purple" : "border-ap-border bg-white"}`}
                    >
                        <span className={`block h-1 rounded-full ${i <= page ? "bg-ap-purple" : "bg-ap-border"}`} />
                        <span className="mt-2 block font-semibold">
                            {i + 1}. {p}
                        </span>
                    </button>
                ))}
            </nav>

            <div key={page} className="ap-enter mt-5 space-y-4">
                {page === 0 && <PageResult a={s.answers} />}
                {page === 1 && <PageTime a={s.answers} />}
                {page === 2 && <PageProjection a={s.answers} />}
            </div>

            <div className="mt-6 flex gap-3">
                {page > 0 && (
                    <Btn variant="secondary" onClick={() => to(page - 1)} aria-label="Página anterior" className="px-4">
                        <ArrowLeft size={18} aria-hidden /> <span className="hidden sm:inline">Anterior</span>
                    </Btn>
                )}
                {page < PAGES.length - 1 ? (
                    <Btn onClick={() => to(page + 1)} className="flex-1">
                        Ver {PAGES[page + 1]!.toLowerCase()} <ArrowRight size={18} aria-hidden />
                    </Btn>
                ) : (
                    <Btn onClick={() => go("pricing")} className="flex-1">
                        Quero chegar mais rápido <ArrowRight size={18} aria-hidden />
                    </Btn>
                )}
            </div>
        </div>
    )
}

/** Semicírculo 0–100 com o gradiente da marca. */
function Gauge({ score }: { score: number }) {
    return (
        <svg viewBox="0 0 200 112" className="w-full max-w-[16rem]" role="img" aria-label={`Índice ${score} de 100`}>
            <defs>
                <linearGradient id="ap-gauge" x1="0" x2="1">
                    <stop offset="0" stopColor="#7A3BFF" />
                    <stop offset="1" stopColor="#FF7A00" />
                </linearGradient>
            </defs>
            <path d="M 16 100 A 84 84 0 0 1 184 100" fill="none" stroke="#F0E9FF" strokeWidth="16" strokeLinecap="round" pathLength={100} />
            <path
                d="M 16 100 A 84 84 0 0 1 184 100"
                fill="none"
                stroke="url(#ap-gauge)"
                strokeWidth="16"
                strokeLinecap="round"
                pathLength={100}
                strokeDasharray={`${Math.max(0.5, score)} 100`}
            />
            <text x="100" y="92" textAnchor="middle" className="fill-ap-ink font-ap-display" fontSize="44" fontWeight="700">
                {score}
            </text>
            <text x="100" y="110" textAnchor="middle" className="fill-ap-muted" fontSize="11">
                de 100
            </text>
        </svg>
    )
}

function PageResult({ a }: { a: Answers }) {
    const d = diagnose(a)
    return (
        <>
            <Card className="flex flex-col items-center gap-2 p-6 sm:flex-row sm:gap-8 sm:p-8">
                <Gauge score={d.score} />
                <div className="text-center sm:text-left">
                    <Eyebrow>Índice de visibilidade</Eyebrow>
                    <p className="mt-1 font-ap-display text-3xl font-bold">{scoreLabel(d.score)}</p>
                    <p className="mt-2 text-ap-muted">Quanto do seu perfil e do seu ritmo ajuda as empresas a te encontrarem.</p>
                </div>
            </Card>

            {d.problems.length > 0 && (
                <div>
                    <h2 className="font-ap-display text-xl font-bold">O que está te deixando invisível</h2>
                    <ul className="mt-3 grid gap-3 sm:grid-cols-3">
                        {d.problems.map((p) => (
                            <li key={p.id}>
                                <Card className="h-full p-5">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-ap-control bg-ap-error-surface text-ap-error">
                                        <TriangleAlert size={18} aria-hidden />
                                    </span>
                                    <p className="mt-3 font-semibold leading-snug">{p.problem}</p>
                                    <p className="mt-1 text-sm text-ap-muted">{p.why}</p>
                                </Card>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <details className="rounded-ap-card border border-ap-border bg-white p-5">
                <summary className="cursor-pointer font-semibold">Como o índice é calculado</summary>
                <ul className="mt-3 space-y-2 text-sm">
                    {d.criteria.map((c) => (
                        <li key={c.id} className="flex items-center justify-between gap-3">
                            <span className="flex items-center gap-2">
                                <span className={`h-2 w-2 rounded-full ${c.pass ? "bg-ap-success" : "bg-ap-error"}`} aria-hidden />
                                {c.label}
                                <span className="sr-only">{c.pass ? ": atende" : ": não atende"}</span>
                            </span>
                            <span className="text-ap-muted">
                                {c.pass ? c.weight : 0}/{c.weight}
                            </span>
                        </li>
                    ))}
                </ul>
                <p className="mt-3 text-xs text-ap-muted">Critérios do Apliquefy, a partir das suas respostas. Não é a nota de nenhuma empresa.</p>
            </details>
        </>
    )
}

function Donut({ value, label }: { value: number; label: string }) {
    return (
        <svg viewBox="0 0 100 100" className="h-28 w-28 shrink-0" role="img" aria-label={label}>
            <circle cx="50" cy="50" r="40" fill="none" stroke="#F0E9FF" strokeWidth="12" />
            <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#7A3BFF"
                strokeWidth="12"
                strokeLinecap="round"
                pathLength={100}
                strokeDasharray={`${Math.max(0.5, value * 100)} 100`}
                transform="rotate(-90 50 50)"
            />
            <text x="50" y="56" textAnchor="middle" fontSize="18" fontWeight="700" className="fill-ap-ink">
                {pct(value)}
            </text>
        </svg>
    )
}

function HBars({ rows }: { rows: { label: string; value: number; display: string; strong?: boolean }[] }) {
    const max = Math.max(...rows.map((r) => r.value), 1)
    return (
        <div className="space-y-4">
            {rows.map((r) => (
                <div key={r.label}>
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                        <span className="text-ap-muted">{r.label}</span>
                        <span className="font-ap-display text-xl font-bold">{r.display}</span>
                    </div>
                    <div className="mt-1 h-3 rounded-full bg-ap-surface" aria-hidden>
                        <div className={`h-full rounded-full ${r.strong ? "bg-ap-purple" : "bg-[#8E889A]"}`} style={{ width: `${Math.max(2, (r.value / max) * 100)}%` }} />
                    </div>
                </div>
            ))}
        </div>
    )
}

function PageTime({ a }: { a: Answers }) {
    const h = hoursPerMonth(a)
    const sofar = hoursSoFar(a)
    const rate = responseRate(a)
    const perDayManual = (a.appsPerWeek ?? 0) / 7
    const perDayPro = Math.floor(planAppsPerWeek(PRO) / 7)
    return (
        <>
            <div className="grid gap-4 sm:grid-cols-2">
                <Card className="p-6">
                    <Clock className="text-ap-purple" size={22} aria-hidden />
                    <p className="mt-3 font-ap-display text-5xl font-bold">{h ? `${fmt1(h)} h` : "0 h"}</p>
                    <p className="mt-1 text-ap-muted">por mês se candidatando</p>
                    <div className="mt-3">
                        <Estimate />
                    </div>
                </Card>
                <Card className="p-6">
                    <TrendingUp className="text-ap-purple" size={22} aria-hidden />
                    <p className="mt-3 font-ap-display text-5xl font-bold">{sofar !== null ? `${fmt1(sofar)} h` : "—"}</p>
                    <p className="mt-1 text-ap-muted">desde que a busca começou</p>
                    <div className="mt-3">
                        <Estimate />
                    </div>
                </Card>
            </div>

            {rate !== null && (
                <Card className="flex items-center gap-5 p-6">
                    <Donut value={rate} label={`Taxa de resposta ${pct(rate)}`} />
                    <div>
                        <p className="font-ap-display text-xl font-bold">
                            {a.responsesLastMonth} {a.responsesLastMonth === 1 ? "resposta" : "respostas"} para ~{Math.round((a.appsPerWeek ?? 0) * WEEKS_PER_MONTH)} candidaturas
                        </p>
                        <p className="mt-1 text-sm text-ap-muted">no último mês. Não projetamos respostas: só volume e tempo.</p>
                    </div>
                </Card>
            )}

            <Card className="p-6">
                <h2 className="font-ap-display text-xl font-bold">Candidaturas por dia</h2>
                <div className="mt-4">
                    <HBars
                        rows={[
                            { label: "Você, hoje", value: perDayManual, display: fmt1(perDayManual) },
                            { label: `Com o Apliquefy ${PRO.name}`, value: perDayPro, display: String(perDayPro), strong: true },
                        ]}
                    />
                </div>
                <p className="mt-4 flex flex-wrap items-center gap-2 text-xs text-ap-muted">
                    <Estimate /> {PRO.credits.toLocaleString("pt-BR")} créditos/mês, {COST_PER_APPLICATION} por candidatura. Fórmulas a partir das suas respostas.
                </p>
            </Card>
        </>
    )
}

const niceMax = (v: number) => {
    const step = 10 ** Math.floor(Math.log10(Math.max(v, 1)))
    return Math.ceil(v / step) * step
}

/** Candidaturas acumuladas por semana: seu ritmo vs. o plano recomendado. Hover/foco mostra os valores. */
function GrowthChart({ manual, auto, reference }: { manual: number; auto: number; reference?: number }) {
    // viewBox = largura real do container: texto do gráfico fica em px de verdade no celular e no desktop.
    const box = useRef<HTMLDivElement>(null)
    const [W, setW] = useState(640)
    useEffect(() => {
        const el = box.current
        if (!el) return
        const ro = new ResizeObserver(([e]) => setW(Math.round(e!.contentRect.width)))
        ro.observe(el)
        return () => ro.disconnect()
    }, [])
    const weeks = 12
    const H = W < 480 ? 240 : 300
    const L = 48
    const R = 20
    const T = 20
    const B = 34
    const max = niceMax(auto * weeks)
    const x = (w: number) => L + (w / weeks) * (W - L - R)
    const y = (v: number) => H - B - (v / max) * (H - T - B)
    const pts = (perWeek: number) => Array.from({ length: weeks + 1 }, (_, w) => `${x(w)},${y(perWeek * w)}`).join(" ")
    const [hover, setHover] = useState<number | null>(null)
    const onMove = (e: PointerEvent<SVGSVGElement>) => {
        const r = e.currentTarget.getBoundingClientRect()
        const px = ((e.clientX - r.left) / r.width) * W
        setHover(Math.max(0, Math.min(weeks, Math.round(((px - L) / (W - L - R)) * weeks))))
    }
    const ticks = [0, max / 2, max]
    return (
        <figure>
            <div className="mb-3 flex flex-wrap gap-x-5 gap-y-1 text-sm" aria-hidden>
                <span className="inline-flex items-center gap-2">
                    <span className="h-[3px] w-5 rounded-full bg-ap-purple" /> Com o Apliquefy
                </span>
                <span className="inline-flex items-center gap-2 text-ap-muted">
                    <span className="w-5 border-t-2 border-dashed border-[#8E889A]" /> Seu ritmo
                </span>
            </div>
            <div ref={box} className="relative">
                <svg
                    viewBox={`0 0 ${W} ${H}`}
                    className="w-full touch-none"
                    role="img"
                    aria-label={`Em ${weeks} semanas: ${Math.round(manual * weeks)} candidaturas no seu ritmo, cerca de ${Math.floor(auto * weeks)} com o Apliquefy.`}
                    onPointerMove={onMove}
                    onPointerLeave={() => setHover(null)}
                >
                    {ticks.map((t) => (
                        <g key={t}>
                            <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke="#ECE9F1" />
                            <text x={L - 8} y={y(t) + 4} textAnchor="end" fontSize="12" fill="#625D6C">
                                {t.toLocaleString("pt-BR")}
                            </text>
                        </g>
                    ))}
                    {(W < 480 ? [0, 6, 12] : [0, 4, 8, 12]).map((w) => (
                        <text key={w} x={x(w)} y={H - 10} textAnchor="middle" fontSize="12" fill="#625D6C">
                            {w === 0 ? "hoje" : `sem ${w}`}
                        </text>
                    ))}
                    {reference !== undefined && reference < max && (
                        <g>
                            <line x1={L} x2={W - R} y1={y(reference)} y2={y(reference)} stroke="#14121C" strokeDasharray="2 4" />
                            <text x={W - R} y={y(reference) - 6} textAnchor="end" fontSize="12" fill="#14121C">
                                seu ano inteiro à mão: {reference.toLocaleString("pt-BR")}
                            </text>
                        </g>
                    )}
                    <polyline points={pts(manual)} fill="none" stroke="#8E889A" strokeWidth="2" strokeDasharray="6 5" />
                    <polyline points={pts(auto)} fill="none" stroke="#7A3BFF" strokeWidth="3" strokeLinejoin="round" />
                    {hover !== null && (
                        <g>
                            <line x1={x(hover)} x2={x(hover)} y1={T} y2={H - B} stroke="#D8D4E2" />
                            <circle cx={x(hover)} cy={y(auto * hover)} r="5" fill="#7A3BFF" stroke="#fff" strokeWidth="2" />
                            <circle cx={x(hover)} cy={y(manual * hover)} r="5" fill="#8E889A" stroke="#fff" strokeWidth="2" />
                        </g>
                    )}
                </svg>
                {hover !== null && (
                    <div
                        className="pointer-events-none absolute top-2 rounded-ap-control border border-ap-border bg-white px-3 py-2 text-xs shadow-sm"
                        style={{ left: `${(x(hover) / W) * 100}%`, transform: `translateX(${hover > weeks / 2 ? "-105%" : "5%"})` }}
                    >
                        <p className="font-semibold">{hover === 0 ? "Hoje" : `Semana ${hover}`}</p>
                        <p>Com o Apliquefy: {Math.floor(auto * hover).toLocaleString("pt-BR")}</p>
                        <p className="text-ap-muted">Seu ritmo: {Math.round(manual * hover).toLocaleString("pt-BR")}</p>
                    </div>
                )}
            </div>
            <details className="mt-2 text-sm">
                <summary className="cursor-pointer text-ap-muted">Ver em tabela</summary>
                <table className="mt-2 w-full text-left">
                    <thead>
                        <tr className="text-ap-muted">
                            <th className="py-1 font-medium">Semana</th>
                            <th className="py-1 font-medium">Seu ritmo</th>
                            <th className="py-1 font-medium">Com o Apliquefy</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 4, 8, 12].map((w) => (
                            <tr key={w} className="border-t border-ap-border">
                                <td className="py-1">{w}</td>
                                <td className="py-1">{Math.round(manual * w).toLocaleString("pt-BR")}</td>
                                <td className="py-1">{Math.floor(auto * w).toLocaleString("pt-BR")}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </details>
        </figure>
    )
}

function PageProjection({ a }: { a: Answers }) {
    const dest = destination(a)
    const manual = a.appsPerWeek ?? 0
    const auto = planAppsPerWeek(PRO)
    const hz = horizonWeeks(a)
    return (
        <>
            <div className="grid grid-cols-2 gap-4">
                <Card className="p-5">
                    <p className="text-sm text-ap-muted">Em {hz} semanas, no seu ritmo</p>
                    <p className="mt-1 font-ap-display text-4xl font-bold text-[#625D6C]">{Math.round(manual * hz).toLocaleString("pt-BR")}</p>
                    <p className="text-sm text-ap-muted">candidaturas</p>
                </Card>
                <Card className="border-ap-purple bg-ap-surface-purple p-5">
                    <p className="text-sm text-ap-purple-active">Em {hz} semanas, com o Apliquefy</p>
                    <p className="mt-1 font-ap-display text-4xl font-bold">{Math.floor(auto * hz).toLocaleString("pt-BR")}</p>
                    <p className="text-sm text-ap-muted">candidaturas</p>
                </Card>
            </div>
            <Card className="p-5 sm:p-6">
                <h2 className="font-ap-display text-xl font-bold">Seu alcance nas próximas 12 semanas</h2>
                <div className="mt-4">
                    <GrowthChart manual={manual} auto={auto} reference={dest.own ? dest.apps : undefined} />
                </div>
                <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-ap-muted">
                    <Estimate /> Plano {PRO.name}, limite diário de {dailyLimitFor(PRO)}. O ritmo real também depende de quantas vagas passam nos seus filtros.
                </p>
            </Card>
        </>
    )
}

// ── 8. Preços: página própria, planos lado a lado ──

const nextAfterPlan = (s: FunnelState) => (diagnose(s.answers).problems.some((p) => p.id !== "volume") ? "bump_cv" : "bump_segment")

const INCLUDED = ["LinkedIn e InfoJobs", "Filtros de cargo, cidade e salário", "Painel com cada candidatura", "Pausa quando quiser", "Sem fidelidade"]

function Pricing({ s, go }: Nav) {
    const a = s.answers
    const dest = destination(a)
    const manualWeeks = weeksTo(dest.apps, a.appsPerWeek ?? 0)
    const proWeeks = weeksTo(dest.apps, planAppsPerWeek(PRO))
    const h = hoursPerMonth(a)
    const name = firstName(s)
    const d = diagnose(a)
    const salary = targetSalary(a)

    if (!canRunDesktop(a))
        return (
            <div className="ap-enter mx-auto max-w-xl pt-10">
                <Card className="p-6 sm:p-8">
                    <Eyebrow>Seu próximo passo</Eyebrow>
                    <Title className="mt-2 !text-2xl">Sem computador, o robô não roda. Então vamos começar pelo currículo.</Title>
                    <p className="mt-3 text-ap-muted">Não vamos te vender um plano que você não consegue usar agora. Pelo celular dá para resolver o que mais trava você:</p>
                    <ul className="mt-4 space-y-2">
                        {d.problems
                            .filter((p) => p.id !== "volume")
                            .map((p) => (
                                <li key={p.id} className="flex gap-2">
                                    <TriangleAlert size={18} className="mt-0.5 shrink-0 text-ap-error" aria-hidden /> {p.problem}
                                </li>
                            ))}
                    </ul>
                    <Btn className="mt-6 w-full" onClick={() => go("checkout", { plan: undefined, bumps: ["cv"] })}>
                        Quero o currículo otimizado · {formatBRL(BUMPS.cv.priceInCents)}
                    </Btn>
                </Card>
            </div>
        )

    return (
        <div className="ap-enter mx-auto max-w-5xl pt-10">
            <div className="mx-auto max-w-3xl text-center">
                <Eyebrow>Escolha a sua velocidade</Eyebrow>
                <Title className="mt-2">
                    {name ? `${name}, n` : "N"}o seu ritmo, {dest.apps.toLocaleString("pt-BR")} candidaturas levam {formatDuration(manualWeeks)}.{" "}
                    <span className="ap-gradient-text">Com o Apliquefy, {formatDuration(proWeeks)}.</span>
                </Title>
                <p className="mt-4 text-lg text-ap-muted">
                    Os três planos chegam ao mesmo lugar. A única diferença é <b className="text-ap-ink">quanto da sua vida</b> fica no caminho.
                    {h ? ` Hoje a busca leva pelo menos ${fmt1(h)} h do seu mês.` : ""}
                </p>
            </div>

            {/* Centro do palco: o recomendado fica no meio e maior. */}
            <div className="mt-10 grid items-stretch gap-4 md:grid-cols-3 md:gap-5">
                {PLANS.map((p) => (
                    <PlanCard key={p.slug} plan={p} a={a} destApps={dest.apps} onPick={() => go(nextAfterPlan({ ...s, plan: p.slug }), { plan: p.slug })} />
                ))}
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-ap-muted">
                {INCLUDED.map((i) => (
                    <span key={i} className="inline-flex items-center gap-1.5">
                        <Check size={16} className="text-ap-success" aria-hidden /> {i}
                    </span>
                ))}
                {salary && (
                    <span className="inline-flex items-center gap-1.5">
                        <Check size={16} className="text-ap-success" aria-hidden /> Seu filtro: a partir de {brl(salary)}
                    </span>
                )}
            </div>

            <div className="mx-auto mt-12 max-w-3xl">
                <h2 className="font-ap-display text-2xl font-bold">Antes de escolher</h2>
                <div className="mt-4 divide-y divide-ap-border rounded-ap-card border border-ap-border bg-white">
                    {doubts(a).map((f) => (
                        <details key={f.q} className="group p-5">
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                                {f.q}
                                <span aria-hidden className="text-xl text-ap-purple transition-transform group-open:rotate-45">
                                    +
                                </span>
                            </summary>
                            <p className="mt-3 text-ap-muted">{f.a}</p>
                        </details>
                    ))}
                </div>
                <p className="mt-4 flex flex-wrap items-center gap-2 text-xs text-ap-muted">
                    <Estimate /> Prazos: créditos do mês ÷ {COST_PER_APPLICATION} crédito por candidatura, com o limite diário ajustado ao plano. Arredondados para cima.
                </p>
            </div>
        </div>
    )
}

function doubts(a: Answers) {
    const area = a.area?.toLowerCase()
    const fit =
        a.segment === "exec"
            ? "Em liderança, parte das contratações vem de indicação e headhunter. O Apliquefy cobre a parte que é candidatura e devolve o seu tempo para o networking."
            : a.segment === "dev"
              ? `Vagas de ${area} no LinkedIn com Candidatura Simplificada, inclusive remotas. ${a.english === "intermediate" || a.english === "advanced" ? "Com o seu inglês, dá para incluir vagas no exterior." : "Vagas em inglês pedem o idioma no currículo."}`
              : `Vagas de ${area} aparecem no InfoJobs e no LinkedIn. Você filtra por cidade, distância, salário e contrato; o robô só se candidata ao que passa.`
    return [
        { q: "Funciona para alguém como eu?", a: fit },
        {
            q: "Minha conta corre risco?",
            a: "Você usa a sua própria conta, no Chrome do seu computador; a senha não passa pelos nossos servidores. Você define o limite diário e pausa quando quiser. Cada plataforma tem regras próprias sobre automação: leia os termos e escolha um ritmo confortável.",
        },
        {
            q: "Do que eu preciso?",
            a: `Um computador com Windows, Mac ou Linux e Google Chrome, ligado enquanto as candidaturas rodam.${a.computer === "shared" ? " Computador compartilhado serve: rode nos horários livres." : ""}`,
        },
        { q: "Posso cancelar?", a: "Pode. Sem fidelidade, pelo portal de assinatura." },
    ]
}

function PlanCard({ plan, a, destApps, onPick }: { plan: Plan; a: Answers; destApps: number; onPick: () => void }) {
    const weeks = weeksTo(destApps, planAppsPerWeek(plan))
    const rec = plan.slug === PRO.slug
    const inDeadline = a.deadline && a.deadline !== "no_rush" && weeks <= horizonWeeks(a)
    return (
        <article className={`relative flex flex-col rounded-ap-card bg-white p-6 ${rec ? "border-2 border-ap-purple shadow-[0_12px_40px_-12px_rgba(122,59,255,0.35)] md:-my-3 md:py-9" : "border border-ap-border"}`}>
            {rec && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ap-purple px-3 py-1 text-xs font-semibold text-white">
                    Recomendado para você{inDeadline ? " · cabe no seu prazo" : ""}
                </span>
            )}
            <h3 className="font-ap-display text-xl font-bold">{plan.name}</h3>
            <p className="mt-4 text-sm text-ap-muted">Chega a {destApps.toLocaleString("pt-BR")} candidaturas em</p>
            <p className={`font-ap-display text-4xl font-bold ${rec ? "ap-gradient-text" : ""}`}>{formatDuration(weeks)}</p>
            <p className="mt-5">
                <span className="font-ap-display text-3xl font-bold">{formatBRL(plan.priceInCents)}</span>
                <span className="text-ap-muted"> /mês</span>
            </p>
            <p className="text-sm text-ap-muted">≈ {formatBRL(plan.priceInCents / plan.credits)} por candidatura</p>
            <ul className="mb-6 mt-5 space-y-2 text-sm">
                <li className="flex gap-2">
                    <Check size={16} className="mt-0.5 shrink-0 text-ap-success" aria-hidden />≈ {Math.floor(planAppsPerWeek(plan)).toLocaleString("pt-BR")} candidaturas por semana
                </li>
                <li className="flex gap-2">
                    <Check size={16} className="mt-0.5 shrink-0 text-ap-success" aria-hidden />
                    {plan.credits.toLocaleString("pt-BR")} créditos por mês
                </li>
                <li className="flex gap-2">
                    <Check size={16} className="mt-0.5 shrink-0 text-ap-success" aria-hidden />
                    Limite diário de {dailyLimitFor(plan)} candidaturas
                </li>
            </ul>
            <Btn className="mt-auto w-full" variant={rec ? "primary" : "secondary"} onClick={onPick}>
                Quero chegar em {formatDuration(weeks)}
            </Btn>
        </article>
    )
}

// ── 9–10. Pré-checkout: uma decisão por tela ──

function Offer({ step, title, children, price, onYes, onNo }: { step: string; title: ReactNode; children: ReactNode; price: number; onYes: () => void; onNo: () => void }) {
    return (
        <div className="ap-enter mx-auto max-w-xl pt-10">
            <Card className="p-6 sm:p-8">
                <Eyebrow>{step}</Eyebrow>
                <Title className="mt-2 !text-2xl">{title}</Title>
                <div className="mt-5 space-y-4">{children}</div>
                <p className="mt-6">
                    <span className="font-ap-display text-2xl font-bold">+ {formatBRL(price)}</span> <span className="text-ap-muted">· pagamento único</span>
                </p>
                {/* Recusar é tão fácil quanto aceitar: mesmo tamanho, texto neutro. */}
                <div className="mt-4 grid gap-2">
                    <Btn onClick={onYes}>Sim, adicionar por {formatBRL(price)}</Btn>
                    <Btn variant="secondary" onClick={onNo}>
                        Não, seguir sem
                    </Btn>
                </div>
            </Card>
        </div>
    )
}

const Deliverables = ({ items }: { items: string[] }) => (
    <ul className="space-y-2">
        {items.map((d) => (
            <li key={d} className="flex gap-2">
                <Check size={18} className="mt-0.5 shrink-0 text-ap-success" aria-hidden />
                {d}
            </li>
        ))}
    </ul>
)

/** "Antes do pagamento · 2 de 4": a ordem das telas de oferta depois do plano (a do currículo só aparece se houver problema). */
const stepLabel = (s: FunnelState, screen: Screen) => {
    const steps: Screen[] = [...(nextAfterPlan(s) === "bump_cv" ? ["bump_cv" as const] : []), "bump_segment", "bump_letter", "bump_jobs"]
    return `Antes do pagamento · ${steps.indexOf(screen) + 1} de ${steps.length}`
}

const withBump = (s: FunnelState, id: (typeof s.bumps)[number], on: boolean) => (on ? [...new Set([...s.bumps, id])] : s.bumps.filter((b) => b !== id))

function BumpCv({ s, go }: Nav) {
    const problems = diagnose(s.answers).problems.filter((p) => p.id !== "volume")
    const pick = (on: boolean) => go("bump_segment", { bumps: withBump(s, "cv", on) })
    return (
        <Offer
            step={stepLabel(s, "bump_cv")}
            price={BUMPS.cv.priceInCents}
            onYes={() => pick(true)}
            onNo={() => pick(false)}
            title={`Seu diagnóstico apontou ${problems.length} ${problems.length === 1 ? "problema" : "problemas"} no currículo. Quer que a IA corrija agora?`}
        >
            <ul className="space-y-1">
                {problems.map((p) => (
                    <li key={p.id} className="flex gap-2 text-ap-error">
                        <TriangleAlert size={18} className="mt-0.5 shrink-0" aria-hidden /> {p.problem}
                    </li>
                ))}
            </ul>
            <Deliverables items={BUMPS.cv.deliverables} />
            <p className="text-sm text-ap-muted">Você revisa e aprova cada mudança antes de o robô usar o currículo.</p>
        </Offer>
    )
}

function BumpSegment({ s, go }: Nav) {
    const a = s.answers
    const id = segmentBump(a.segment)
    const b = BUMPS[id]
    const pick = (on: boolean) => go("bump_letter", { bumps: withBump(s, id, on) })
    const en = { none: "nenhum", basic: "básico", intermediate: "intermediário", advanced: "avançado" }[a.english ?? "none"]
    const title =
        id === "kit_tech"
            ? a.raise === "usd"
                ? "Você quer receber em dólar. Seu currículo está pronto para vaga em inglês?"
                : `Você tem inglês ${en}. Quer abrir também as vagas de fora?`
            : id === "kit_gestao"
              ? `Para “${a.targetRole}”, o LinkedIn é a primeira coisa que o recrutador abre. Ele diz o mesmo que o seu currículo?`
              : `Em ${a.area?.toLowerCase()}, a entrevista muitas vezes é presencial. Quer chegar preparado?`
    return (
        <Offer step={stepLabel(s, "bump_segment")} price={b.priceInCents} onYes={() => pick(true)} onNo={() => pick(false)} title={title}>
            <p className="font-semibold">{b.title}</p>
            <Deliverables items={b.deliverables} />
        </Offer>
    )
}

function BumpLetter({ s, go }: Nav) {
    const b = BUMPS.carta
    const pick = (on: boolean) => go("bump_jobs", { bumps: withBump(s, "carta", on) })
    return (
        <Offer
            step={stepLabel(s, "bump_letter")}
            price={b.priceInCents}
            onYes={() => pick(true)}
            onNo={() => pick(false)}
            title={`Quer uma carta de apresentação pronta para “${s.answers.targetRole}”?`}
        >
            <p className="text-ap-muted">Muitas vagas abrem espaço para uma mensagem ao recrutador. Uma mensagem bem escrita é uma chance a mais de chamar atenção.</p>
            <p className="font-semibold">{b.title}</p>
            <Deliverables items={b.deliverables} />
        </Offer>
    )
}

function BumpJobs({ s, go }: Nav) {
    const id = segmentList(s.answers.segment)
    const b = BUMPS[id]
    const pick = (on: boolean) => go("checkout", { bumps: withBump(s, id, on) })
    return (
        <Offer
            step={stepLabel(s, "bump_jobs")}
            price={b.priceInCents}
            onYes={() => pick(true)}
            onNo={() => pick(false)}
            title={`Quer saber quais cargos de ${s.answers.area?.toLowerCase() ?? "sua área"} estão contratando mais agora?`}
        >
            <p className="text-ap-muted">Com a lista, você ajusta os filtros da campanha para onde as vagas estão abrindo.</p>
            <p className="font-semibold">{b.title}</p>
            <Deliverables items={b.deliverables} />
        </Offer>
    )
}

// ── 11. Checkout: revisão aqui, pagamento no Stripe ──

const CHECKOUT_ERRORS: Record<string, ReactNode> = {
    cancel: "Pagamento não concluído. Seu pedido continua aqui quando quiser.",
    active: (
        <>
            Você já tem uma assinatura ativa. Para trocar de plano, use a página{" "}
            <Link href="/assinatura" className="underline">
                Assinatura
            </Link>
            .
        </>
    ),
    error: "Não conseguimos abrir o pagamento agora. Tente de novo em instantes.",
}

/** /api/checkout/onboarding cria a conta (se precisar) e abre o Checkout do Stripe com plano + bumps. */
const checkoutUrl = (s: FunnelState) => {
    const q = new URLSearchParams({ from: "lp" })
    if (s.plan) q.set("plan", s.plan)
    if (s.bumps.length) q.set("bumps", s.bumps.join(","))
    return `/api/checkout/onboarding?${q}`
}

function Checkout({ s, go, patch }: Nav) {
    const plan = PLANS.find((p) => p.slug === s.plan)
    const { monthly, once } = cartTotal(s)
    const today = monthly + once
    if (!today)
        return (
            <div className="mx-auto max-w-xl pt-10">
                <Card className="p-6">
                    <Title className="!text-2xl">Seu pedido está vazio.</Title>
                    <Btn className="mt-6 w-full" onClick={() => go("pricing")}>
                        Ver planos
                    </Btn>
                </Card>
            </div>
        )
    const line = (label: string, value: string, remove?: () => void) => (
        <div className="flex items-center justify-between gap-3 py-2">
            <span>{label}</span>
            <span className="flex items-center gap-3">
                <span className="font-semibold">{value}</span>
                {remove && (
                    <button type="button" onClick={remove} className="min-h-11 text-sm text-ap-muted underline" aria-label={`Remover ${label}`}>
                        remover
                    </button>
                )}
            </span>
        </div>
    )
    return (
        <div className="ap-enter mx-auto max-w-xl pt-10">
            <Card className="p-6 sm:p-8">
                <Eyebrow>Pagamento</Eyebrow>
                <Title className="mt-2 !text-2xl">Revise seu pedido</Title>
                {s.checkoutError && (
                    <p role="alert" className="mt-4 rounded-ap-control bg-ap-warning-surface p-3 text-sm text-ap-warning">
                        {CHECKOUT_ERRORS[s.checkoutError] ?? CHECKOUT_ERRORS.error}
                    </p>
                )}
                <div className="mt-5 divide-y divide-ap-border">
                    {plan && line(`Plano ${plan.name} · mensal`, formatBRL(plan.priceInCents))}
                    {s.bumps.map((id) => line(BUMPS[id].title, formatBRL(BUMPS[id].priceInCents), () => patch({ bumps: s.bumps.filter((b) => b !== id) })))}
                    <div className="flex items-center justify-between py-3 font-ap-display text-xl font-bold">
                        <span>Total hoje</span>
                        <span>{formatBRL(today)}</span>
                    </div>
                </div>
                {plan && (
                    <p className="text-sm text-ap-muted">
                        Depois, {formatBRL(plan.priceInCents)} por mês. Sem fidelidade.{" "}
                        <button type="button" onClick={() => go("pricing")} className="underline">
                            Trocar de plano
                        </button>
                    </p>
                )}
                <a
                    href={checkoutUrl(s)}
                    onClick={() => patch({ checkoutError: undefined })}
                    className="mt-6 inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-ap-control bg-ap-purple px-6 font-semibold text-white hover:bg-ap-purple-hover"
                >
                    <Lock size={16} aria-hidden /> Ir para o pagamento seguro
                </a>
                <p className="mt-3 text-center text-sm text-ap-muted">
                    Você cria sua conta{s.contact?.email ? ` com ${s.contact.email}` : ""} e paga no Stripe. Cartão salvo com segurança, nunca no Apliquefy.
                </p>
            </Card>
        </div>
    )
}

// ── 12. OTO pós-compra, com downsell (cobrado no cartão do checkout) ──

function Oto({ s, go }: Nav) {
    const id: OtoId = s.screen === "oto" ? "voice" : "text"
    const o = OTOS[id]
    const [state, setState] = useState<"idle" | "charging" | "failed">("idle")
    const accept = async () => {
        if (!s.stripeSessionId) return go("done")
        setState("charging")
        const res = await fetch("/api/lp/oto", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId: s.stripeSessionId, oto: id }),
        }).catch(() => null)
        if (res?.ok) go("done", { oto: id })
        else setState("failed")
    }
    return (
        <div className="ap-enter mx-auto max-w-xl pt-10">
            <Card className="p-6 sm:p-8">
                <Eyebrow>{id === "voice" ? "Pagamento aprovado" : "Outra opção"}</Eyebrow>
                <Title className="mt-2 !text-2xl">
                    {id === "voice" ? `Pronto! Quer treinar a entrevista para “${s.answers.targetRole}”?` : "Prefere treinar escrevendo, no seu ritmo?"}
                </Title>
                <p className="mt-4 font-semibold">{o.title}</p>
                <p className="mt-1 text-ap-muted">{o.pitch}</p>
                <p className="mt-6">
                    <span className="font-ap-display text-2xl font-bold">+ {formatBRL(o.priceInCents)}</span> <span className="text-ap-muted">· no mesmo cartão, um clique</span>
                </p>
                {state === "failed" && (
                    <p role="alert" className="mt-4 rounded-ap-control bg-ap-warning-surface p-3 text-sm text-ap-warning">
                        Não conseguimos cobrar no mesmo cartão. Sua compra principal está confirmada; você pode seguir sem esta oferta.
                    </p>
                )}
                <div className="mt-4 grid gap-2">
                    <Btn onClick={accept} disabled={state === "charging"}>
                        {state === "charging" ? "Processando…" : `Sim, adicionar por ${formatBRL(o.priceInCents)}`}
                    </Btn>
                    <Btn variant="secondary" disabled={state === "charging"} onClick={() => go(id === "voice" && state !== "failed" ? "downsell" : "done")}>
                        Não, obrigado
                    </Btn>
                </div>
            </Card>
        </div>
    )
}

// ── Fim do funil. Download do app e onboarding acontecem dentro do produto, não aqui. ──

function Done({ s }: Nav) {
    const plan = PLANS.find((p) => p.slug === s.plan)
    return (
        <div className="ap-enter mx-auto max-w-xl pt-10">
            <Card className="p-6 text-center sm:p-8">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ap-success-surface text-ap-success">
                    <Check size={28} aria-hidden />
                </span>
                <Title className="mt-4 !text-2xl">Pedido confirmado{firstName(s) ? `, ${firstName(s)}` : ""}!</Title>
                <p className="mt-2 text-ap-muted">{plan ? "Seus créditos aparecem na sua conta em instantes." : "Seu pedido já está na sua conta."}</p>
                <div className="mt-6 divide-y divide-ap-border text-left">
                    {plan && (
                        <p className="flex justify-between py-2">
                            <span>Plano {plan.name}</span>
                            <span className="font-semibold">{formatBRL(plan.priceInCents)}/mês</span>
                        </p>
                    )}
                    {s.bumps.map((b) => (
                        <p key={b} className="flex justify-between py-2">
                            <span>{BUMPS[b].title}</span>
                            <span className="font-semibold">{formatBRL(BUMPS[b].priceInCents)}</span>
                        </p>
                    ))}
                    {s.oto && (
                        <p className="flex justify-between py-2">
                            <span>{OTOS[s.oto].title}</span>
                            <span className="font-semibold">{formatBRL(OTOS[s.oto].priceInCents)}</span>
                        </p>
                    )}
                </div>
                <Link
                    href="/desktop?tab=como-funciona"
                    className="mt-6 inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-ap-control bg-ap-purple px-6 font-semibold text-white hover:bg-ap-purple-hover"
                >
                    Acessar minha conta <ArrowRight size={18} aria-hidden />
                </Link>
            </Card>
        </div>
    )
}
