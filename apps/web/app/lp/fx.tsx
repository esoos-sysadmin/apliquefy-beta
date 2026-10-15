"use client"

// Ilhas interativas da landing (o resto é server component, zero JS).
// motion via LazyMotion + domAnimation: só o necessário para animar, sem o pacote inteiro.
import { ArrowRight, Briefcase, CheckCircle2, LayoutDashboard, MapPin, Send } from "lucide-react"
import { animate, domAnimation, LazyMotion, m, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react"
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react"
import { Symbol } from "./ui"

/** Barra fixa no celular, só depois que o CTA do topo sai da tela. */
export function StickyCta({ href }: { href: string }) {
    const [show, setShow] = useState(false)
    useEffect(() => {
        const hero = document.getElementById("hero-cta")
        if (!hero) return
        const io = new IntersectionObserver(([e]) => setShow(!e!.isIntersecting && e!.boundingClientRect.top < 0))
        io.observe(hero)
        return () => io.disconnect()
    }, [])
    return (
        <div
            className={`fixed inset-x-0 bottom-0 z-20 border-t border-ap-border bg-white/95 p-3 backdrop-blur transition-transform duration-200 sm:hidden ${show ? "translate-y-0" : "translate-y-full"}`}
            aria-hidden={!show}
        >
            <a
                href={href}
                data-start=""
                tabIndex={show ? 0 : -1}
                className="flex min-h-[3.25rem] items-center justify-center gap-2 rounded-ap-control bg-ap-purple px-6 font-semibold text-white"
            >
                Fazer meu diagnóstico grátis <ArrowRight size={18} aria-hidden />
            </a>
        </div>
    )
}

/**
 * Revela cada .ap-reveal ao entrar na tela. Sem JS, nada fica escondido: só depois de montar
 * é que a raiz ganha .ap-reveal-ready (e o que já está visível é marcado antes, sem piscar).
 */
export function ScrollReveal() {
    useEffect(() => {
        const root = document.querySelector(".lp")
        const els = [...document.querySelectorAll<HTMLElement>(".ap-reveal:not(.is-visible)")]
        if (!root || !els.length) return
        const inView = (el: HTMLElement) => el.getBoundingClientRect().top < window.innerHeight * 0.9
        els.filter(inView).forEach((el) => el.classList.add("is-visible"))
        root.classList.add("ap-reveal-ready")
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (!e.isIntersecting) continue
                    e.target.classList.add("is-visible")
                    io.unobserve(e.target)
                }
            },
            { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
        )
        els.filter((el) => !el.classList.contains("is-visible")).forEach((el) => io.observe(el))
        return () => io.disconnect()
    }, [])
    return null
}

/** Conta de 0 até `to` quando entra na tela. O HTML já vem com o número final (sem JS, ok). */
export function Counter({ to }: { to: number }) {
    const ref = useRef<HTMLSpanElement>(null)
    const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" })
    useEffect(() => {
        const el = ref.current
        if (!el || !inView || matchMedia("(prefers-reduced-motion: reduce)").matches) return
        const c = animate(0, to, { duration: 1.4, ease: [0.2, 0.7, 0.2, 1], onUpdate: (v) => (el.textContent = Math.round(v).toLocaleString("pt-BR")) })
        return () => c.stop()
    }, [inView, to])
    return <span ref={ref}>{to.toLocaleString("pt-BR")}</span>
}

/** Card que inclina em 3D seguindo o mouse, com brilho no ponto do cursor (só ponteiro fino). */
export function Tilt({ children, className = "" }: { children: ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null)
    const move = (e: PointerEvent<HTMLDivElement>) => {
        if (e.pointerType !== "mouse") return
        const el = ref.current!
        const r = el.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width
        const y = (e.clientY - r.top) / r.height
        el.style.setProperty("--rx", `${(0.5 - y) * 8}deg`)
        el.style.setProperty("--ry", `${(x - 0.5) * 10}deg`)
        el.style.setProperty("--mx", `${x * 100}%`)
        el.style.setProperty("--my", `${y * 100}%`)
    }
    const leave = () => {
        ref.current?.style.setProperty("--rx", "0deg")
        ref.current?.style.setProperty("--ry", "0deg")
    }
    return (
        <div ref={ref} onPointerMove={move} onPointerLeave={leave} className={`ap-tilt ${className}`}>
            {children}
        </div>
    )
}

/** Aceternity "container scroll": o bloco chega inclinado em 3D e se endireita com o scroll. */
export function ScrollTilt({ children }: { children: ReactNode }) {
    const ref = useRef<HTMLDivElement>(null)
    const reduce = useReducedMotion()
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] })
    const rotateX = useTransform(scrollYProgress, [0, 1], [24, 0])
    const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1])
    return (
        <LazyMotion features={domAnimation}>
            <div ref={ref} style={{ perspective: 1200 }}>
                <m.div style={reduce ? undefined : { rotateX, scale, transformOrigin: "50% 0%" }}>{children}</m.div>
            </div>
        </LazyMotion>
    )
}

const ORBIT = [
    { icon: Send, label: "LinkedIn" },
    { icon: Briefcase, label: "InfoJobs" },
    { icon: CheckCircle2, label: "Candidatura enviada" },
    { icon: MapPin, label: "Filtro: sua cidade" },
    { icon: LayoutDashboard, label: "Painel atualizado" },
]

/**
 * Cena 3D do hero: o símbolo extrudado em camadas (translateZ), girando devagar, com etiquetas
 * em órbita. A cena inteira inclina seguindo o mouse (mola do motion). Tudo decorativo.
 */
export function HeroScene() {
    const reduce = useReducedMotion()
    const mx = useMotionValue(0)
    const my = useMotionValue(0)
    const rotY = useSpring(useTransform(mx, [-1, 1], [-14, 14]), { stiffness: 80, damping: 18 })
    const rotX = useSpring(useTransform(my, [-1, 1], [10, -10]), { stiffness: 80, damping: 18 })

    useEffect(() => {
        if (reduce || !matchMedia("(pointer: fine)").matches) return
        const onMove = (e: globalThis.PointerEvent) => {
            mx.set((e.clientX / innerWidth) * 2 - 1)
            my.set((e.clientY / innerHeight) * 2 - 1)
        }
        addEventListener("pointermove", onMove)
        return () => removeEventListener("pointermove", onMove)
    }, [reduce, mx, my])

    return (
        <LazyMotion features={domAnimation}>
            <m.div
                aria-hidden
                initial={reduce ? false : { opacity: 0, scale: 0.9, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1], delay: 0.15 }}
                className="ap-scene-wrap"
            >
                <m.div className="ap-scene" style={{ rotateX: rotX, rotateY: rotY }}>
                    <div className="ap-scene-glow" />
                    <svg className="ap-orbit-ring" viewBox="0 0 440 440">
                        <ellipse cx="220" cy="220" rx="200" ry="80" fill="none" stroke="rgba(255,255,255,0.18)" strokeDasharray="4 8" />
                    </svg>
                    <div className="ap-sym3d">
                        {Array.from({ length: 9 }, (_, i) => (
                            <Symbol key={i} className="ap-sym-layer" style={{ transform: `translateZ(${-i * 2.5}px)`, filter: i ? `brightness(${0.62 - i * 0.03})` : undefined }} />
                        ))}
                    </div>
                    {ORBIT.map((o, i) => (
                        <span key={o.label} className="ap-orbit-chip" style={{ animationDelay: `${(-18 / ORBIT.length) * i}s`, ["--d" as string]: `${(100 / ORBIT.length) * i}%` }}>
                            <o.icon size={14} /> {o.label}
                        </span>
                    ))}
                </m.div>
            </m.div>
        </LazyMotion>
    )
}
