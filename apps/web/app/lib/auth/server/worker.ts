import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

// Guarda das rotas /api/internal/* (SDD-candidatura-nuvem §6.1). Elas ficam fora do Clerk
// no proxy.ts, então este é o ÚNICO guarda: rota interna sem `workerRoute` é rota aberta.
// Não aceitam sessão Clerk, e as rotas públicas não aceitam este token.

export function isWorkerToken(header: string | null, expected = process.env.WORKER_API_TOKEN): boolean {
    if (!header || !expected) return false;
    const a = Buffer.from(header);
    const b = Buffer.from(expected);
    // timingSafeEqual exige o mesmo tamanho; o tamanho do token não é segredo.
    return a.length === b.length && timingSafeEqual(a, b);
}

type Handler<C> = (request: Request, context: C) => Promise<Response>;

export function workerRoute<C>(handler: Handler<C>): Handler<C> {
    return async (request, context) => {
        if (!isWorkerToken(request.headers.get("x-worker-token"))) {
            return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
        }
        try {
            return await handler(request, context);
        } catch (error) {
            // Só a classe do erro: o corpo pode ter currículo.
            console.error(`Erro em ${new URL(request.url).pathname}:`, error instanceof Error ? error.name : "erro");
            return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
        }
    };
}
