import type { ButtonHTMLAttributes, ReactNode } from "react"

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" }

/** Aceitar e recusar têm o mesmo tamanho e o mesmo peso de leitura: só muda o preenchimento. */
export function Btn({ variant = "primary", className = "", type = "button", ...p }: BtnProps) {
    const look = variant === "primary" ? "bg-lp-ink text-lp-paper" : "border-2 border-lp-ink text-lp-ink"
    return (
        <button
            type={type}
            {...p}
            className={`flex min-h-[3.25rem] w-full items-center justify-center gap-2 px-5 text-center font-semibold leading-tight disabled:cursor-not-allowed disabled:opacity-40 ${look} ${className}`}
        />
    )
}

export const Kicker = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
    <p className={`font-lp-mono text-xs uppercase tracking-[0.16em] text-lp-ink2 ${className}`}>{children}</p>
)

export const Stamp = ({ children = "Estimativa" }: { children?: ReactNode }) => <span className="lp-stamp">{children}</span>

/** "Rótulo ........ valor", a linha de formulário do laudo. */
export const Line = ({ label, value, tone }: { label: ReactNode; value: ReactNode; tone?: "bad" | "ok" | "est" }) => (
    <div className="flex items-baseline gap-2 py-1 font-lp-mono text-[0.875rem]">
        <span className="text-lp-ink2">{label}</span>
        <span className="lp-leader" aria-hidden />
        <span
            className={`text-right ${tone === "bad" ? "text-lp-bad" : tone === "ok" ? "text-lp-ok" : tone === "est" ? "text-lp-est" : ""}`}
        >
            {value}
        </span>
    </div>
)

export const Section = ({ n, title, children }: { n: string; title: string; children: ReactNode }) => (
    <section className="border-t-2 border-lp-ink pt-4">
        <Kicker>§ {n}</Kicker>
        <h2 className="mt-1 font-lp-serif text-[1.625rem] leading-tight">{title}</h2>
        <div className="mt-4 space-y-4">{children}</div>
    </section>
)

export const Title = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
    <h1 id="screen-title" tabIndex={-1} className={`font-lp-serif text-[1.75rem] leading-[1.15] outline-none ${className}`}>
        {children}
    </h1>
)
