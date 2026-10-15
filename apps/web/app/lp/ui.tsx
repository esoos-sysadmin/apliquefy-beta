import Image from "next/image"
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, CSSProperties, ReactNode } from "react"

const base = "inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-ap-control px-6 text-center font-semibold leading-tight transition-colors disabled:cursor-not-allowed disabled:opacity-40"
const looks = {
    primary: "bg-ap-purple text-white hover:bg-ap-purple-hover active:bg-ap-purple-active",
    secondary: "border border-ap-border bg-white text-ap-ink hover:border-ap-ink",
    dark: "bg-white text-ap-ink hover:bg-ap-surface-purple",
}
type Look = keyof typeof looks

/** Aceitar e recusar têm o mesmo tamanho: só muda o preenchimento. */
export function Btn({ variant = "primary", className = "", type = "button", ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Look }) {
    return <button type={type} {...p} className={`${base} ${looks[variant]} ${className}`} />
}

/** Link com cara de botão: funciona antes do JS hidratar (4G lento). */
export function BtnLink({ variant = "primary", className = "", ...p }: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Look }) {
    return <a {...p} className={`${base} ${looks[variant]} ${className}`} />
}

export const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
    <div className={`rounded-ap-card border border-ap-border bg-white ${className}`}>{children}</div>
)

export const Eyebrow = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
    <p className={`text-xs font-semibold uppercase tracking-[0.12em] text-ap-muted ${className}`}>{children}</p>
)

/** Rótulo obrigatório em todo número projetado. */
export const Estimate = () => (
    <span className="inline-flex items-center gap-1 rounded-ap-tag bg-ap-warning-surface px-2 py-0.5 text-xs font-semibold text-ap-warning">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-ap-orange" />
        Estimativa
    </span>
)

export const Title = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
    <h1 id="screen-title" tabIndex={-1} className={`font-ap-display text-[1.75rem] font-bold leading-[1.25] outline-none sm:text-4xl sm:leading-[1.25] ${className}`}>
        {children}
    </h1>
)

export const Logo = ({ dark = false, className = "" }: { dark?: boolean; className?: string }) => (
    <Image
        src={dark ? "/marca/apliquefy-horizontal-negativa.svg" : "/marca/apliquefy-horizontal-principal.svg"}
        alt="Apliquefy"
        width={140}
        height={37}
        priority
        unoptimized
        className={className}
    />
)

/** Símbolo oficial (02_Simbolo_Produto/SVG/apliquefy-simbolo-gradiente.svg), inline para animar. */
export const Symbol = ({ className = "", style }: { className?: string; style?: CSSProperties }) => (
    <svg viewBox="0 0 256 256" className={className} style={style} aria-hidden>
        <defs>
            <linearGradient id="ap-brand-gradient" x1="0.26" y1="0" x2="0.65" y2="1">
                <stop offset="0" stopColor="#7A3BFF" />
                <stop offset="0.34" stopColor="#7A3BFF" />
                <stop offset="0.72" stopColor="#FF7A00" />
                <stop offset="1" stopColor="#FF7A00" />
            </linearGradient>
        </defs>
        <path
            d="M 228 128 A 100 100 0 1 1 28 128 A 100 100 0 1 1 228 128 Z M 170 128 A 42 42 0 1 0 86 128 A 42 42 0 1 0 170 128 Z"
            fill="url(#ap-brand-gradient)"
            fillRule="evenodd"
        />
        <path
            d="M 202 126 C 216.359 126 228 137.641 228 152 L 228 202 C 228 216.359 216.359 228 202 228 C 187.641 228 176 216.359 176 202 L 176 152 C 176 137.641 187.641 126 202 126 Z"
            fill="#22D36A"
        />
    </svg>
)
