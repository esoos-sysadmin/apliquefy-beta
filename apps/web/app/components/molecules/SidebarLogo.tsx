export function SidebarLogo() {
    return (
        <div style={{ padding: "4px 4px 0", marginBottom: 28 }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- SVG estático da marca */}
            <img src="/marca/apliquefy-horizontal-principal.svg" alt="Apliquefy" className="h-8 w-auto dark:hidden" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/marca/apliquefy-horizontal-negativa.svg" alt="Apliquefy" className="hidden h-8 w-auto dark:block" />
        </div>
    );
}
