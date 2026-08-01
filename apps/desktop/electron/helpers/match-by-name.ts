// Match aproximado por nome usado pelo Apollo para resolver "ativa a campanha X" /
// "analisa o currículo Y". Prioriza igualdade exata (case-insensitive) e cai para
// "contém". Puro e sem imports de propósito, para ter self-check rodável (ver __main__).
export function matchByName<T>(items: T[], query: string, nameOf: (item: T) => string): T | null {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    const exact = items.find((item) => nameOf(item).trim().toLowerCase() === q);
    if (exact) return exact;
    return items.find((item) => nameOf(item).trim().toLowerCase().includes(q)) ?? null;
}

// Self-check: `npx ts-node electron/helpers/match-by-name.ts`
if (require.main === module) {
    const eq = (got: unknown, want: unknown, msg: string) => {
        if (got !== want) throw new Error(`${msg}: esperado ${JSON.stringify(want)}, veio ${JSON.stringify(got)}`);
    };
    const list = [{ n: "Dev Frontend" }, { n: "Backend Sênior" }, { n: "Frontend Pleno" }];
    const nameOf = (x: { n: string }) => x.n;
    // exato tem prioridade sobre "contém"
    eq(matchByName(list, "frontend pleno", nameOf)?.n, "Frontend Pleno", "match exato");
    // "contém" pega o primeiro que casa
    eq(matchByName(list, "frontend", nameOf)?.n, "Dev Frontend", "match por contém");
    // sem match e query vazia
    eq(matchByName(list, "designer", nameOf), null, "sem match");
    eq(matchByName(list, "   ", nameOf), null, "query vazia");
    console.log("match-by-name OK");
}
