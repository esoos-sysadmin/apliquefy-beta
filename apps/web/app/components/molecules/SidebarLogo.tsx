export function SidebarLogo({ compact = false }: { compact?: boolean }) {
    return (
        <div style={compact ? undefined : { padding: "4px 4px 0", marginBottom: 28 }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- SVG estático da marca */}
            <img src="/marca/apliquefy-horizontal-principal.svg" alt="Apliquefy" className={`${compact ? "h-7" : "h-8"} w-auto dark:hidden`} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/marca/apliquefy-horizontal-negativa.svg" alt="Apliquefy" className={`hidden ${compact ? "h-7" : "h-8"} w-auto dark:block`} />
        </div>
    );
}
