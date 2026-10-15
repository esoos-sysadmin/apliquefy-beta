// Landing do /lp: server component. Os efeitos interativos são ilhas em ./fx (motion).
// Os CTAs são <a> comuns (funcionam antes de hidratar); o Funnel intercepta os cliques via
// data-start / data-segment e segue sem recarregar.
import {
    ArrowRight,
    Briefcase,
    Check,
    Code,
    Eye,
    FileText,
    Filter,
    Gauge,
    LayoutDashboard,
    Lock,
    Monitor,
    Pause,
    Repeat,
    ScanEye,
    Send,
    ShieldCheck,
    SlidersHorizontal,
    Sparkles,
    Store,
    Target,
    Users,
    X,
} from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"
import { PLANS } from "../lib/constants/plans"
import { destination, fmt1, formatDuration, hoursPerMonth, planAppsPerWeek, weeksTo, type Segment } from "./funnel"
import { Counter, HeroScene, ScrollReveal, ScrollTilt, StickyCta, Tilt } from "./fx"
import { BtnLink, Estimate, Logo, Symbol } from "./ui"

const HERO: Record<Segment | "default", { h1: string; punch: string }> = {
    default: { h1: "Você manda currículo e ninguém responde?", punch: "Não é falta de talento. É falta de alcance." },
    dev: { h1: "Vaga remota não responde?", punch: "Não é o seu código. É o seu alcance." },
    exec: { h1: "Em transição e sem retorno?", punch: "Não é o seu histórico. É o seu alcance." },
    varejo: { h1: "Mandou currículo pra todo lado e ninguém chamou?", punch: "Não é você. É o alcance." },
}

const AREAS = [
    "Desenvolvimento",
    "Dados e IA",
    "Vendas",
    "Atendimento",
    "Operador de caixa",
    "Estoque e reposição",
    "Recepção",
    "Administrativo",
    "Telemarketing",
    "Gestão comercial",
    "Operações",
    "Recursos humanos",
    "Marketing",
    "Finanças",
]

// Números de produto, todos derivados dos planos e regras reais (nada inventado).
const MAX_PER_WEEK = Math.floor(Math.max(...PLANS.map(planAppsPerWeek)))
const MAX_DAILY_LIMIT = 200 // validations/campaign.ts: dailyLimit.max(200)

// Simulação exibida na seção de resultados: mesma fórmula do diagnóstico.
const SIM = { appsPerWeek: 10, minutesPerApp: 15 }
const SIM_DEST = destination(SIM).apps
const SIM_ROWS = [
    { label: "À mão", weeks: weeksTo(SIM_DEST, SIM.appsPerWeek), manual: true },
    ...PLANS.map((p) => ({ label: `Apliquefy ${p.name}`, weeks: weeksTo(SIM_DEST, planAppsPerWeek(p)), manual: false })),
]
const SIM_HOURS = hoursPerMonth(SIM) ?? 0

const Section = ({ children, tone = "surface", id, className = "" }: { children: ReactNode; tone?: "surface" | "white" | "ink"; id?: string; className?: string }) => (
    <section id={id} className={`scroll-mt-4 ${tone === "white" ? "bg-white" : tone === "ink" ? "bg-ap-ink text-white" : ""} py-20 sm:py-28 ${className}`}>
        <div className="ap-reveal mx-auto max-w-6xl px-4">{children}</div>
    </section>
)

const H2 = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
    <h2 className={`mt-3 max-w-3xl font-ap-display text-3xl font-bold leading-[1.25] sm:text-[2.75rem] sm:leading-[1.2] ${className}`}>{children}</h2>
)

const Kicker = ({ children, dark = false }: { children: ReactNode; dark?: boolean }) => (
    <span
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${dark ? "border-white/15 bg-white/5 text-white/70" : "border-ap-border bg-white text-ap-muted"}`}
    >
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-ap-purple to-ap-orange" />
        {children}
    </span>
)

const IconBox = ({ children, dark = false }: { children: ReactNode; dark?: boolean }) => (
    <span className={`flex h-11 w-11 items-center justify-center rounded-ap-control ${dark ? "bg-white/10 text-[#C9B0FF]" : "bg-ap-surface-purple text-ap-purple"}`}>{children}</span>
)

export function Landing({ ad }: { ad?: Segment }) {
    const hero = HERO[ad ?? "default"]
    const quizHref = ad ? `/lp?q=1&a=${ad}` : "/lp?q=1"
    // Botão com borda em gradiente girando (Aceternity "moving border").
    const cta = (label = "Fazer meu diagnóstico grátis", opts: { id?: string; light?: boolean } = {}) => (
        <span className="ap-border-beam inline-flex w-full rounded-[12px] p-[2px] sm:w-auto">
            <BtnLink href={quizHref} data-start="" id={opts.id} variant={opts.light ? "dark" : "primary"} className="w-full !rounded-[10px] sm:w-auto">
                {label} <ArrowRight size={18} aria-hidden />
            </BtnLink>
        </span>
    )

    return (
        <>
            {/* ── Hero (escuro, spotlight + grade + cena 3D) ─────────────────────── */}
            <div className="relative overflow-hidden bg-ap-ink pb-32 text-white sm:pb-40">
                <div aria-hidden className="ap-grid-bg absolute inset-0" />
                <div aria-hidden className="ap-spotlight absolute -left-40 -top-40 h-[42rem] w-[42rem]" />
                <div aria-hidden className="ap-spotlight-2 absolute -right-32 top-20 h-[30rem] w-[30rem]" />

                <header className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                    <Logo dark className="h-8 w-auto" />
                    <nav className="flex items-center gap-1 text-sm font-medium">
                        {[
                            ["#resultados", "Resultados"],
                            ["#infraestrutura", "Como funciona"],
                            ["#duvidas", "Dúvidas"],
                        ].map(([href, label]) => (
                            <a key={href} href={href} className="hidden rounded-ap-control px-3 py-2 text-white/70 hover:text-white md:inline-flex">
                                {label}
                            </a>
                        ))}
                        <Link href="/login" className="ml-1 inline-flex min-h-10 items-center rounded-ap-control border border-white/20 px-4 font-semibold text-white hover:bg-white/10">
                            Entrar
                        </Link>
                    </nav>
                </header>

                <section className="relative mx-auto grid max-w-6xl items-center gap-6 px-4 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:pt-16">
                    <div>
                        <Kicker dark>LinkedIn e InfoJobs no piloto automático</Kicker>
                        {/* LCP: h1 em texto puro, sem animação de entrada. */}
                        <h1
                            id="screen-title"
                            tabIndex={-1}
                            className="mt-6 font-ap-display text-[2.25rem] font-bold leading-[1.3] outline-none sm:text-5xl sm:leading-[1.25] lg:text-[3.5rem]"
                        >
                            {hero.h1} <span className="ap-gradient-text-light">{hero.punch}</span>
                        </h1>
                        <p className="mt-6 max-w-xl text-lg text-white/70">
                            Pare de se candidatar. O Apliquefy se candidata às vagas certas por você, todo dia, enquanto você vive a sua vida.
                        </p>
                        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                            {cta(undefined, { id: "hero-cta" })}
                            <span className="text-sm text-white/60">Grátis · sem cartão · resultado na hora</span>
                        </div>
                        <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/80">
                            {["Roda no seu computador", "Sua conta, sua senha", "Sem fidelidade"].map((t) => (
                                <li key={t} className="inline-flex items-center gap-1.5">
                                    <Check size={16} className="text-ap-green" aria-hidden /> {t}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <HeroScene />
                </section>
            </div>

            <main>
                {/* ── Resultados: logo depois do hero, sobrepondo a borda ─────────────── */}
                <section id="resultados" className="relative z-10 -mt-24 scroll-mt-24 px-4 sm:-mt-28">
                    <div className="mx-auto max-w-6xl">
                        <div className="ap-reveal grid grid-cols-2 gap-3 lg:grid-cols-4">
                            {[
                                { to: MAX_PER_WEEK, label: "candidaturas por semana", sub: "no plano mais rápido" },
                                { to: MAX_DAILY_LIMIT, label: "por dia, por campanha", sub: "o limite que você pode definir" },
                                { to: 2, label: "plataformas", sub: "LinkedIn e InfoJobs" },
                                { to: 0, label: "formulários para você", sub: "o agente preenche por você" },
                            ].map((s) => (
                                <div key={s.label} className="rounded-ap-card border border-ap-border bg-white p-5 shadow-[0_20px_50px_-30px_rgba(20,18,28,0.45)] sm:p-6">
                                    <p className="ap-gradient-text font-ap-display text-4xl font-bold sm:text-5xl">
                                        <Counter to={s.to} />
                                    </p>
                                    <p className="mt-2 font-semibold leading-snug">{s.label}</p>
                                    <p className="text-sm text-ap-muted">{s.sub}</p>
                                </div>
                            ))}
                        </div>

                        <div className="ap-reveal mt-16 sm:mt-24">
                            <div className="mx-auto max-w-3xl text-center">
                                <Kicker>Resultados</Kicker>
                                <H2 className="mx-auto">
                                    Um ano de candidaturas em <span className="ap-gradient-text">{formatDuration(SIM_ROWS[2]!.weeks)}</span>.
                                </H2>
                                <p className="mx-auto mt-4 max-w-2xl text-lg text-ap-muted">
                                    Quem envia {SIM.appsPerWeek} candidaturas por semana leva um ano para chegar a {SIM_DEST} envios. Veja o mesmo destino com o Apliquefy.
                                </p>
                            </div>

                            <div className="mt-10">
                                <ScrollTilt>
                                    <div className="rounded-[24px] border border-ap-border bg-white p-2 shadow-[0_40px_80px_-40px_rgba(122,59,255,0.45)]">
                                        <div className="grid gap-6 rounded-[18px] bg-ap-surface p-6 sm:p-10 lg:grid-cols-[1.4fr_1fr]">
                                            <div>
                                                <p className="text-sm font-semibold text-ap-muted">Tempo para enviar {SIM_DEST} candidaturas</p>
                                                <div className="ap-bars mt-5 space-y-4">
                                                    {SIM_ROWS.map((r, i) => (
                                                        <div key={r.label}>
                                                            <div className="flex items-baseline justify-between gap-3 text-sm">
                                                                <span className={r.manual ? "text-ap-muted" : "font-medium"}>{r.label}</span>
                                                                <span className={`font-ap-display text-xl font-bold ${r.manual ? "text-ap-muted" : ""}`}>{formatDuration(r.weeks)}</span>
                                                            </div>
                                                            <div className="mt-1.5 h-3 rounded-full bg-white" aria-hidden>
                                                                <div
                                                                    className={`ap-bar h-full rounded-full ${r.manual ? "bg-[#8E889A]" : "bg-gradient-to-r from-ap-purple to-ap-orange"}`}
                                                                    style={{ ["--w" as string]: `${Math.max(2, (r.weeks / SIM_ROWS[0]!.weeks) * 100)}%`, transitionDelay: `${0.15 + i * 0.12}s` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex flex-col justify-between gap-6 rounded-ap-card bg-ap-ink p-6 text-white">
                                                <div>
                                                    <p className="text-sm text-white/60">E o tempo que volta para você</p>
                                                    <p className="mt-2 font-ap-display text-5xl font-bold">
                                                        {fmt1(SIM_HOURS)} <span className="text-2xl">h/mês</span>
                                                    </p>
                                                    <p className="mt-2 text-sm text-white/60">
                                                        {SIM.appsPerWeek} candidaturas por semana × {SIM.minutesPerApp} min cada, que deixam de ser suas.
                                                    </p>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2 text-xs text-white/60">
                                                    <Estimate /> Simulação com a fórmula do diagnóstico. O ritmo real depende das vagas que passam nos seus filtros.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </ScrollTilt>
                            </div>
                            <div className="mt-10 flex flex-col items-center gap-2 text-center">
                                {cta("Fazer a simulação com os meus números")}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Faixa de áreas. */}
                <div className="mt-20 overflow-hidden border-y border-ap-border bg-white py-4 sm:mt-28" aria-label="Áreas atendidas">
                    <div className="ap-marquee flex w-max gap-3">
                        {[...AREAS, ...AREAS].map((a, i) => (
                            <span key={i} aria-hidden={i >= AREAS.length} className="whitespace-nowrap rounded-full bg-ap-surface px-4 py-1.5 text-sm font-medium text-ap-muted">
                                {a}
                            </span>
                        ))}
                    </div>
                </div>

                {/* ── Infraestrutura: diagrama com feixes animados ───────────────────── */}
                <Section tone="white" id="infraestrutura">
                    <div className="text-center">
                        <Kicker>Infraestrutura</Kicker>
                        <H2 className="mx-auto">Um robô de verdade, trabalhando no seu computador.</H2>
                        <p className="mx-auto mt-4 max-w-2xl text-lg text-ap-muted">
                            Nada de script frágil: um agente de IA abre cada vaga no Chrome do seu computador, lê o formulário pela tela e responde com os dados do
                            seu currículo.
                        </p>
                    </div>

                    <InfraDiagram />

                    <div className="ap-stagger mt-12 grid gap-4 md:grid-cols-3">
                        {[
                            { icon: ScanEye, t: "Agente de IA com visão", d: "Olha a tela, entende cada pergunta e decide o próximo passo, como uma pessoa faria." },
                            { icon: Monitor, t: "Chrome de verdade, sessão sua", d: "O login é seu, feito no seu Chrome. A sessão fica salva só na sua máquina." },
                            { icon: LayoutDashboard, t: "Sincronizado com o painel", d: "Cada candidatura vai para a sua conta: empresa, vaga, data e status." },
                        ].map((f) => (
                            <Tilt key={f.t} className="rounded-ap-card">
                                <div className="ap-tilt-glow h-full rounded-ap-card border border-ap-border bg-ap-surface p-6">
                                    <IconBox>
                                        <f.icon size={22} aria-hidden />
                                    </IconBox>
                                    <h3 className="mt-4 font-ap-display text-xl font-bold">{f.t}</h3>
                                    <p className="mt-2 text-ap-muted">{f.d}</p>
                                </div>
                            </Tilt>
                        ))}
                    </div>
                </Section>

                {/* ── Metodologia: linha do tempo que se preenche com o scroll ───────── */}
                <Section tone="ink" id="metodologia" className="relative overflow-hidden">
                    <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
                        <div className="lg:sticky lg:top-24 lg:self-start">
                            <Kicker dark>Metodologia</Kicker>
                            <H2>Volume com critério. Constância sem esforço.</H2>
                            <p className="mt-4 text-lg text-white/70">
                                Processo seletivo virou jogo de volume. O nosso método junta o volume que só um robô alcança com os filtros que só você sabe definir.
                            </p>
                            <div className="mt-6 flex flex-wrap gap-2">
                                {[
                                    [Target, "Volume com critério"],
                                    [Repeat, "Constância > esforço"],
                                    [Eye, "Transparência total"],
                                ].map(([Icon, t]) => {
                                    const I = Icon as typeof Target
                                    return (
                                        <span key={t as string} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm">
                                            <I size={14} className="text-[#C9B0FF]" aria-hidden /> {t as string}
                                        </span>
                                    )
                                })}
                            </div>
                        </div>

                        <ol className="ap-trace relative space-y-5 pl-10">
                            <span aria-hidden className="absolute bottom-2 left-[15px] top-2 w-0.5 rounded-full bg-white/10" />
                            <span aria-hidden className="ap-trace-fill absolute bottom-2 left-[15px] top-2 w-0.5 origin-top rounded-full bg-gradient-to-b from-ap-purple via-ap-orange to-ap-green" />
                            {[
                                { icon: Gauge, t: "Diagnóstico", d: "Medimos o seu ritmo, o seu tempo e o que deixa o seu currículo invisível. Grátis, em poucos minutos." },
                                { icon: SlidersHorizontal, t: "Configuração", d: "Cargo, cidade, salário, modalidade e limite diário. Você define uma vez." },
                                { icon: Sparkles, t: "Candidatura contínua", d: "Todo dia, o agente busca, filtra e se candidata, só nas vagas que passam nos seus critérios." },
                                { icon: LayoutDashboard, t: "Acompanhamento", d: "Cada envio aparece no painel. Você ajusta os filtros quando quiser e o robô segue." },
                            ].map((s, i) => (
                                <li key={s.t} className="relative">
                                    <span className="absolute -left-10 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-ap-ink ring-2 ring-white/15">
                                        <span className="font-ap-display text-sm font-bold">{i + 1}</span>
                                    </span>
                                    <Tilt className="rounded-ap-card">
                                        <div className="ap-tilt-glow-dark rounded-ap-card border border-white/10 bg-white/[0.04] p-6">
                                            <div className="flex items-center gap-3">
                                                <IconBox dark>
                                                    <s.icon size={20} aria-hidden />
                                                </IconBox>
                                                <h3 className="font-ap-display text-xl font-bold">{s.t}</h3>
                                            </div>
                                            <p className="mt-3 text-white/70">{s.d}</p>
                                        </div>
                                    </Tilt>
                                </li>
                            ))}
                        </ol>
                    </div>
                </Section>

                {/* ── Por que ninguém responde ───────────────────────────────────────── */}
                <Section>
                    <Kicker>Por que ninguém responde</Kicker>
                    <H2>
                        Você não é um candidato ruim. Você é um candidato <span className="ap-gradient-text">invisível</span>.
                    </H2>
                    <div className="ap-stagger mt-10 grid gap-4 md:grid-cols-3">
                        {[
                            { icon: Users, t: "Fila enorme", d: "Vagas concorridas no LinkedIn mostram, na própria página, que já passaram de 100 candidaturas." },
                            { icon: Filter, t: "Filtro antes de gente", d: "Perguntas de triagem e filtros ordenam e descartam currículos antes de alguém ler." },
                            { icon: Eye, t: "Volume humano tem limite", d: "À mão, você envia poucas por semana. Cada uma passa pelo mesmo filtro." },
                        ].map((c) => (
                            <Tilt key={c.t} className="rounded-ap-card">
                                <div className="ap-tilt-glow h-full rounded-ap-card border border-ap-border bg-white p-6">
                                    <IconBox>
                                        <c.icon size={22} aria-hidden />
                                    </IconBox>
                                    <h3 className="mt-4 font-ap-display text-xl font-bold">{c.t}</h3>
                                    <p className="mt-2 text-ap-muted">{c.d}</p>
                                </div>
                            </Tilt>
                        ))}
                    </div>
                    <p className="mt-12 max-w-2xl font-ap-display text-2xl font-bold leading-[1.3]">
                        Quem é chamado nem sempre é o melhor candidato. É quem <span className="ap-gradient-text">foi visto</span>.
                    </p>
                    <div className="mt-6">{cta("Descobrir se estou invisível")}</div>
                </Section>

                {/* ── Antes e depois ─────────────────────────────────────────────────── */}
                <Section tone="white">
                    <Kicker>Sua busca, de outro jeito</Kicker>
                    <H2>Pare de fazer o trabalho do robô.</H2>
                    <div className="ap-stagger mt-10 grid gap-4 md:grid-cols-2">
                        <div className="rounded-ap-card border border-ap-border bg-ap-surface p-6 sm:p-8">
                            <p className="font-ap-display text-xl font-bold text-ap-muted">À mão, hoje</p>
                            <ul className="mt-5 space-y-3">
                                {[
                                    "Procurar vaga por vaga, site por site",
                                    "Preencher o mesmo formulário de novo e de novo",
                                    "Perder a conta de onde já se candidatou",
                                    "Parar quando o cansaço bate",
                                    "Poucas candidaturas por semana",
                                ].map((t) => (
                                    <li key={t} className="flex gap-3 text-ap-muted">
                                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ap-error-surface text-ap-error">
                                            <X size={13} strokeWidth={3} aria-hidden />
                                        </span>
                                        {t}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative rounded-ap-card bg-gradient-to-br from-ap-purple via-ap-purple to-ap-orange p-[2px]">
                            <div className="h-full rounded-[14px] bg-white p-6 sm:p-8">
                                <p className="flex items-center gap-2 font-ap-display text-xl font-bold">
                                    <Symbol className="h-6 w-6" /> Com o Apliquefy
                                </p>
                                <ul className="mt-5 space-y-3">
                                    {[
                                        "Busca contínua no LinkedIn e no InfoJobs",
                                        "Formulário respondido pelo agente, com os dados do seu currículo",
                                        "Cada candidatura registrada no painel",
                                        "Segue enquanto você trabalha, estuda ou descansa",
                                        `Até ${MAX_PER_WEEK.toLocaleString("pt-BR")} candidaturas por semana, conforme o plano`,
                                    ].map((t) => (
                                        <li key={t} className="flex gap-3">
                                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ap-success-surface text-ap-success">
                                                <Check size={13} strokeWidth={3} aria-hidden />
                                            </span>
                                            {t}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* ── Recursos em bento ──────────────────────────────────────────────── */}
                <Section>
                    <Kicker>Recursos</Kicker>
                    <H2>Tudo o que a sua busca precisa, num lugar só.</H2>
                    <div className="ap-stagger mt-10 grid gap-4 md:grid-flow-dense md:grid-cols-3">
                        <Tilt className="rounded-ap-card md:col-span-2">
                            <div className="ap-tilt-glow h-full overflow-hidden rounded-ap-card border border-ap-border bg-white p-6 sm:p-8">
                                <IconBox>
                                    <Sparkles size={22} aria-hidden />
                                </IconBox>
                                <h3 className="mt-4 font-ap-display text-2xl font-bold">O agente responde o formulário por você</h3>
                                <p className="mt-2 max-w-md text-ap-muted">Perguntas de triagem, campos e seleções: ele lê a tela e responde com o que está no seu currículo.</p>
                                <div aria-hidden className="mt-6 space-y-3 rounded-ap-control border border-ap-border bg-ap-surface p-4">
                                    {["w-3/4", "w-1/2", "w-2/3"].map((w, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <span className="h-2 w-24 shrink-0 rounded-full bg-ap-border" />
                                            <span className="relative h-8 flex-1 overflow-hidden rounded-[8px] border border-ap-border bg-white">
                                                <span className={`ap-type absolute inset-y-2.5 left-3 rounded-full bg-ap-purple/70 ${w}`} style={{ animationDelay: `${i * 0.6}s` }} />
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Tilt>
                        {[
                            { icon: Send, t: "LinkedIn", d: "Candidatura Simplificada, com os dados do seu currículo." },
                            { icon: Briefcase, t: "InfoJobs", d: "Comércio, atendimento, escritório e muito mais." },
                        ].map((f) => (
                            <Tilt key={f.t} className="rounded-ap-card">
                                <div className="ap-tilt-glow h-full rounded-ap-card border border-ap-border bg-white p-6">
                                    <IconBox>
                                        <f.icon size={22} aria-hidden />
                                    </IconBox>
                                    <h3 className="mt-4 font-ap-display text-lg font-bold">{f.t}</h3>
                                    <p className="mt-1 text-ap-muted">{f.d}</p>
                                </div>
                            </Tilt>
                        ))}
                        <Tilt className="rounded-ap-card md:col-span-2">
                            <div className="ap-tilt-glow h-full rounded-ap-card border border-ap-border bg-white p-6 sm:p-8">
                                <IconBox>
                                    <LayoutDashboard size={22} aria-hidden />
                                </IconBox>
                                <h3 className="mt-4 font-ap-display text-2xl font-bold">Painel ao vivo</h3>
                                <p className="mt-2 max-w-md text-ap-muted">Cada envio aparece na hora, com empresa, vaga, data e status.</p>
                                <div aria-hidden className="mt-6 divide-y divide-ap-border rounded-ap-control border border-ap-border">
                                    {[0, 1, 2].map((i) => (
                                        <div key={i} className="flex items-center gap-3 px-4 py-3">
                                            <span className="h-8 w-8 shrink-0 rounded-[8px] bg-ap-surface-purple" />
                                            <span className="flex-1 space-y-1.5">
                                                <span className="block h-2 w-1/2 rounded-full bg-ap-border" />
                                                <span className="block h-2 w-1/3 rounded-full bg-ap-surface" />
                                            </span>
                                            <span className="ap-pop rounded-full bg-ap-success-surface px-2.5 py-1 text-xs font-semibold text-ap-success" style={{ animationDelay: `${i * 0.4}s` }}>
                                                Enviada
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Tilt>
                        {[
                            { icon: SlidersHorizontal, t: "Filtros que você controla", d: "Cargo, cidade, distância, salário, modalidade e contrato." },
                            { icon: Gauge, t: "Limite diário", d: `Você decide quantas por dia, até ${MAX_DAILY_LIMIT} por campanha.` },
                        ].map((f) => (
                            <Tilt key={f.t} className="rounded-ap-card">
                                <div className="ap-tilt-glow h-full rounded-ap-card border border-ap-border bg-white p-6">
                                    <IconBox>
                                        <f.icon size={22} aria-hidden />
                                    </IconBox>
                                    <h3 className="mt-4 font-ap-display text-lg font-bold">{f.t}</h3>
                                    <p className="mt-1 text-ap-muted">{f.d}</p>
                                </div>
                            </Tilt>
                        ))}
                        <Tilt className="rounded-ap-card">
                            <div className="ap-tilt-glow h-full rounded-ap-card border border-ap-border bg-white p-6">
                                <IconBox>
                                    <FileText size={22} aria-hidden />
                                </IconBox>
                                <h3 className="mt-4 font-ap-display text-lg font-bold">Currículo em PDF</h3>
                                <p className="mt-1 text-ap-muted">Gerado a partir do seu currículo e anexado na candidatura.</p>
                            </div>
                        </Tilt>
                    </div>
                </Section>

                {/* ── Segurança ──────────────────────────────────────────────────────── */}
                <Section tone="ink" className="relative overflow-hidden">
                    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                        <div>
                            <Kicker dark>Segurança e controle</Kicker>
                            <H2>Você no controle, do primeiro ao último envio.</H2>
                            <p className="mt-4 text-lg text-white/70">O Apliquefy trabalha para você, não no seu lugar. Você decide onde, quanto e quando.</p>
                        </div>
                        <div className="ap-stagger grid gap-3 sm:grid-cols-2">
                            {[
                                { icon: Lock, t: "Sua senha fica com você", d: "Você entra no Chrome do seu computador. A senha não passa pelos nossos servidores." },
                                { icon: ShieldCheck, t: "Ritmo que você escolhe", d: "Limite diário definido por você. Cada plataforma tem regras próprias: escolha um ritmo confortável." },
                                { icon: Eye, t: "Tudo à vista", d: "Cada candidatura fica registrada no painel. Nada acontece escondido." },
                                { icon: Pause, t: "Pare quando quiser", d: "Pause a campanha com um clique. Sem fidelidade." },
                            ].map((f) => (
                                <Tilt key={f.t} className="rounded-ap-card">
                                    <div className="ap-tilt-glow-dark h-full rounded-ap-card border border-white/10 bg-white/[0.04] p-5">
                                        <IconBox dark>
                                            <f.icon size={20} aria-hidden />
                                        </IconBox>
                                        <h3 className="mt-3 font-semibold">{f.t}</h3>
                                        <p className="mt-1 text-sm text-white/70">{f.d}</p>
                                    </div>
                                </Tilt>
                            ))}
                        </div>
                    </div>
                </Section>

                {/* ── Para quem é: cada card já começa o quiz com a resposta 1 ───────── */}
                <Section>
                    <Kicker>Para quem é</Kicker>
                    <H2>Diferentes trajetórias. O mesmo problema.</H2>
                    <div className="ap-stagger mt-10 grid gap-4 md:grid-cols-3">
                        {(
                            [
                                { seg: "dev", icon: Code, title: "Tecnologia", text: "Vagas no Brasil e remotas no exterior, sem passar a noite no LinkedIn." },
                                { seg: "exec", icon: Users, title: "Gestão e liderança", text: "Mais alcance nas vagas abertas enquanto você cuida do networking." },
                                { seg: "varejo", icon: Store, title: "Comércio, atendimento e escritório", text: "Vagas na sua cidade, no seu horário, sem gastar o dia mandando currículo." },
                            ] as const
                        ).map((au) => (
                            <Tilt key={au.seg} className="rounded-ap-card">
                                <a
                                    href={`/lp?s=${au.seg}${ad ? `&a=${ad}` : ""}`}
                                    data-segment={au.seg}
                                    className="ap-tilt-glow group block h-full rounded-ap-card border border-ap-border bg-white p-6 transition-colors hover:border-ap-purple"
                                >
                                    <IconBox>
                                        <au.icon size={22} aria-hidden />
                                    </IconBox>
                                    <h3 className="mt-4 font-ap-display text-xl font-bold">{au.title}</h3>
                                    <p className="mt-2 text-ap-muted">{au.text}</p>
                                    <span className="mt-4 inline-flex items-center gap-1 font-semibold text-ap-purple">
                                        Fazer meu diagnóstico <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden />
                                    </span>
                                </a>
                            </Tilt>
                        ))}
                    </div>
                </Section>

                {/* ── Comparativo ────────────────────────────────────────────────────── */}
                <Section tone="white">
                    <Kicker>Comparando</Kicker>
                    <H2>O jeito mais eficiente de ser visto por mais empresas.</H2>
                    <div className="ap-stagger mt-10 grid gap-4 md:grid-cols-3">
                        {[
                            {
                                t: "Fazer à mão",
                                hi: false,
                                rows: [
                                    ["Volume", "Poucas por semana"],
                                    ["Seu tempo", "Horas toda semana"],
                                    ["Enquanto você trabalha", "Para"],
                                    ["Custo", "Grátis, mas custa o seu tempo"],
                                ],
                            },
                            {
                                t: "Consultoria de carreira",
                                hi: false,
                                rows: [
                                    ["Volume", "Não é o foco"],
                                    ["Seu tempo", "Sessões agendadas"],
                                    ["Enquanto você trabalha", "Para"],
                                    ["Custo", "Varia, costuma ser por sessão"],
                                ],
                            },
                            {
                                t: "Apliquefy",
                                hi: true,
                                rows: [
                                    ["Volume", `Até ${MAX_PER_WEEK.toLocaleString("pt-BR")} por semana`],
                                    ["Seu tempo", "Configura uma vez"],
                                    ["Enquanto você trabalha", "Continua"],
                                    ["Custo", "Plano mensal, sem fidelidade"],
                                ],
                            },
                        ].map((c) => (
                            <div key={c.t} className={`rounded-ap-card p-6 ${c.hi ? "border-2 border-ap-purple bg-ap-surface-purple" : "border border-ap-border bg-ap-surface"}`}>
                                <p className="flex items-center gap-2 font-ap-display text-xl font-bold">
                                    {c.hi && <Symbol className="h-6 w-6" />}
                                    {c.t}
                                </p>
                                <dl className="mt-4 divide-y divide-ap-border">
                                    {c.rows.map(([k, v]) => (
                                        <div key={k} className="py-3">
                                            <dt className="text-xs font-semibold uppercase tracking-wide text-ap-muted">{k}</dt>
                                            <dd className={`mt-0.5 ${c.hi ? "font-semibold" : ""}`}>{v}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        ))}
                    </div>
                    <div className="mt-10 flex flex-col items-center gap-2 text-center">
                        {cta("Ver quanto alcance eu estou perdendo")}
                        <span className="text-sm text-ap-muted">Grátis · sem cartão · resultado na hora</span>
                    </div>
                </Section>

                {/* ── Dúvidas ────────────────────────────────────────────────────────── */}
                <Section id="duvidas">
                    <div className="mx-auto max-w-3xl">
                        <Kicker>Dúvidas</Kicker>
                        <H2>Perguntas diretas, respostas honestas.</H2>
                        <div className="ap-stagger mt-8 divide-y divide-ap-border rounded-ap-card border border-ap-border bg-white">
                            {[
                                [
                                    "O Apliquefy garante emprego?",
                                    "Não. Ele garante volume e constância: envia as candidaturas que você levaria semanas para enviar. Quem é chamado para entrevista depende da vaga, do currículo e de você.",
                                ],
                                [
                                    "Preciso deixar o computador ligado?",
                                    "Sim. O app roda no seu computador (Windows, Mac ou Linux, com Google Chrome) e abre o navegador sozinho. Enquanto ele estiver ligado e conectado, as candidaturas seguem.",
                                ],
                                [
                                    "Minha conta do LinkedIn corre risco?",
                                    "Você entra com a sua própria conta, no Chrome do seu computador; a senha não passa pelos nossos servidores. Você define um limite diário e pausa quando quiser. Cada plataforma tem regras próprias sobre automação: leia os termos e escolha um ritmo confortável.",
                                ],
                                [
                                    "Ele se candidata em qualquer vaga do LinkedIn?",
                                    "Não. No LinkedIn, só nas vagas com Candidatura Simplificada. No InfoJobs, nas vagas que passam nos seus filtros.",
                                ],
                                ["Preciso ficar olhando?", "Não. Você configura uma vez e acompanha pelo painel quando quiser."],
                                ["Quanto custa?", "O diagnóstico é grátis. No fim dele, você vê qual plano cabe no seu prazo, com os seus números."],
                                ["Posso cancelar?", "Pode. Sem fidelidade, pelo portal de assinatura."],
                            ].map(([q, a]) => (
                                <details key={q} className="group p-5">
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                                        {q}
                                        <span aria-hidden className="text-xl text-ap-purple transition-transform group-open:rotate-45">
                                            +
                                        </span>
                                    </summary>
                                    <p className="mt-3 text-ap-muted">{a}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </Section>

                {/* ── CTA final ──────────────────────────────────────────────────────── */}
                <section className="px-4 pb-20">
                    <div className="ap-reveal relative mx-auto max-w-6xl overflow-hidden rounded-[28px] bg-ap-ink px-6 py-16 text-center text-white sm:px-12 sm:py-24">
                        <div aria-hidden className="ap-grid-bg absolute inset-0" />
                        <div aria-hidden className="ap-lamp absolute left-1/2 top-0 h-72 w-[46rem] -translate-x-1/2" />
                        <div className="relative">
                            <Symbol className="mx-auto h-14 w-14" />
                            <h2 className="mx-auto mt-6 max-w-2xl font-ap-display text-3xl font-bold leading-[1.25] sm:text-5xl sm:leading-[1.2]">
                                Pare de se candidatar. <span className="ap-gradient-text-light">Comece a ser visto.</span>
                            </h2>
                            <p className="mt-4 text-white/70">Diagnóstico grátis, sem cartão, resultado na hora.</p>
                            <div className="mt-8">{cta("Fazer meu diagnóstico grátis", { light: true })}</div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-ap-border bg-white">
                <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <Logo className="h-7 w-auto" />
                        <p className="mt-2 text-sm text-ap-muted">Sua busca por trabalho, em movimento.</p>
                    </div>
                    <nav className="flex gap-5 text-sm text-ap-muted">
                        <Link href="/politica-de-privacidade" className="hover:text-ap-ink">
                            Privacidade
                        </Link>
                        <Link href="/termos-de-servico" className="hover:text-ap-ink">
                            Termos
                        </Link>
                        <a href={quizHref} data-start="" className="font-semibold text-ap-purple">
                            Diagnóstico grátis
                        </a>
                    </nav>
                </div>
            </footer>

            <StickyCta href={quizHref} />
            <ScrollReveal />
        </>
    )
}

/** Diagrama da infraestrutura com feixes de luz percorrendo as conexões (Aceternity/Magic "beams"). */
function InfraDiagram() {
    const node = (icon: ReactNode, title: string, sub: string, big = false) => (
        <div className={`flex items-center gap-3 rounded-ap-card border bg-white p-3 shadow-[0_12px_30px_-18px_rgba(20,18,28,0.35)] ${big ? "border-ap-purple" : "border-ap-border"}`}>
            {icon}
            <span className="text-left">
                <span className="block text-sm font-semibold leading-tight">{title}</span>
                <span className="block text-xs text-ap-muted">{sub}</span>
            </span>
        </div>
    )
    const box = (I: typeof Monitor) => (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-ap-control bg-ap-surface-purple text-ap-purple">
            <I size={20} aria-hidden />
        </span>
    )
    const beam = (d: string, delay: number) => (
        <g key={d}>
            <path d={d} fill="none" stroke="#ECE9F1" strokeWidth="2" />
            <path d={d} fill="none" stroke="url(#ap-beam)" strokeWidth="2.5" strokeLinecap="round" pathLength={1000} className="ap-beam" style={{ animationDelay: `${delay}s` }} />
        </g>
    )
    return (
        <div className="mt-12">
            {/* Desktop: nós posicionados sobre o SVG dos feixes. */}
            <div className="relative mx-auto hidden aspect-[1000/440] max-w-5xl md:block" aria-label="Painel web envia a configuração ao app no seu computador; o agente de IA usa o Chrome para se candidatar no LinkedIn e no InfoJobs.">
                <svg viewBox="0 0 1000 440" className="absolute inset-0 h-full w-full" aria-hidden>
                    <defs>
                        <linearGradient id="ap-beam" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1000" y2="0">
                            <stop offset="0" stopColor="#7A3BFF" />
                            <stop offset="0.6" stopColor="#FF7A00" />
                            <stop offset="1" stopColor="#22D36A" />
                        </linearGradient>
                    </defs>
                    {beam("M 200 220 L 420 220", 0)}
                    {beam("M 580 220 C 680 220, 700 110, 800 110", 0.6)}
                    {beam("M 580 220 C 680 220, 700 330, 800 330", 1.1)}
                    {beam("M 500 150 L 500 80", 0.3)}
                    {beam("M 500 290 L 500 360", 0.9)}
                </svg>
                <div className="absolute left-0 top-1/2 w-[20%] -translate-y-1/2">{node(box(LayoutDashboard), "Painel web", "Cargo, filtros e currículo")}</div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="ap-pulse-ring flex h-36 w-36 flex-col items-center justify-center rounded-full border border-ap-purple bg-white text-center shadow-[0_20px_60px_-20px_rgba(122,59,255,0.6)]">
                        <Symbol className="h-12 w-12" />
                        <span className="mt-2 text-sm font-semibold leading-tight">App Apliquefy</span>
                        <span className="text-xs text-ap-muted">no seu computador</span>
                    </div>
                </div>
                <div className="absolute left-1/2 top-0 w-[22%] -translate-x-1/2">{node(box(Sparkles), "Agente de IA", "Lê a tela e responde")}</div>
                <div className="absolute bottom-0 left-1/2 w-[22%] -translate-x-1/2">{node(box(Monitor), "Chrome real", "Com a sua sessão")}</div>
                <div className="absolute right-0 top-[25%] w-[20%] -translate-y-1/2">{node(box(Send), "LinkedIn", "Candidatura Simplificada")}</div>
                <div className="absolute right-0 top-[75%] w-[20%] -translate-y-1/2">{node(box(Briefcase), "InfoJobs", "Vagas com seus filtros")}</div>
            </div>

            {/* Celular: o mesmo fluxo na vertical. */}
            <ol className="mx-auto max-w-sm space-y-0 md:hidden">
                {[
                    node(box(LayoutDashboard), "Painel web", "Cargo, filtros e currículo"),
                    node(<Symbol className="h-10 w-10 shrink-0" />, "App Apliquefy", "No seu computador, com agente de IA e Chrome real", true),
                    node(box(Send), "LinkedIn e InfoJobs", "Candidaturas enviadas por você"),
                ].map((n, i, arr) => (
                    <li key={i}>
                        {n}
                        {i < arr.length - 1 && <span aria-hidden className="ap-beam-v mx-auto block h-10 w-0.5" />}
                    </li>
                ))}
            </ol>
        </div>
    )
}
