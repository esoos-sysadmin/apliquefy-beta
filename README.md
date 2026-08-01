# Apliquefy

Plataforma de automação de candidaturas a vagas. O usuário configura currículo, filtros
e limites diários no painel web; um agente desktop executa as candidaturas no LinkedIn e
no InfoJobs enquanto o computador estiver ligado.

A automação roda num engine RPA em Python (Playwright + agente de visão), iniciado como
processo filho pelo app Electron.

```
web  ──REST + Clerk──▶  desktop  ──HTTP 127.0.0.1 + WS──▶  robots (engine RPA)
 ▲                                                              │
 └──────────────── registra candidatura / debita crédito ───────┘
```

## Estrutura

| Pacote | O que é |
|---|---|
| `apps/web` | Next.js 16 — painel + API REST (backend) |
| `apps/desktop` | Electron + React — shell local, sessões de login, orquestra o engine |
| `apps/robots` | Python (uv) — FastAPI + Playwright + agente de visão |
| `packages/database` | Prisma + PostgreSQL (Neon) |
| `packages/observability` | Sentry compartilhado + scrubbing de PII |
| `packages/ui` | Componentes compartilhados |

## Como rodar

Pré-requisitos: Node 22, [uv](https://docs.astral.sh/uv/), Google Chrome instalado
(as sessões usam o Chrome real — Chromium headless é detectado e deslogado pelas
plataformas) e acesso a um banco PostgreSQL.

```bash
npm install

# 1. ambiente — veja .env.example para o mapa dos quatro arquivos
cp apps/web/.env.example          apps/web/.env
cp packages/database/.env.example packages/database/.env
cp apps/desktop/.env.example      apps/desktop/.env

# 2. banco
cd packages/database && npx prisma migrate deploy && npx prisma db seed && cd ../..

# 3. engine RPA
cd apps/robots && uv sync --dev && cd ../..

# 4. web + desktop em paralelo
npm run dev
```

O painel sobe em `http://localhost:3000`. O app desktop abre junto e pede login pelo
Clerk; depois é preciso conectar as contas de LinkedIn/InfoJobs pelo próprio app, que
abre um Chrome real e salva a sessão localmente.

## Comandos

```bash
npm run dev          # web + desktop
npm run build        # build completo
npm run lint
npm run check-types

cd apps/robots  && uv run pytest        # testes do engine
cd apps/desktop && npm run dist         # instalador local (sem publicar)
```

## Banco de dados

Migrations ficam em `packages/database/prisma/migrations`. **Nunca use `prisma db push`
em banco compartilhado** — o schema fica à frente das migrations e o deploy em outro
ambiente nasce sem as tabelas. O job `migrations` do CI falha quando isso acontece.

```bash
cd packages/database
npx prisma migrate dev --name descricao_curta   # cria e aplica
npx prisma migrate deploy                       # aplica em homolog/prod
npx prisma db seed                              # pesos de crédito (CreditWeight)
```

## Deploy

O passo a passo completo — Neon, Clerk, Stripe, Vercel, Sentry, Resend e build do
desktop — está em [docs/CHECKLIST-GO-LIVE.md](docs/CHECKLIST-GO-LIVE.md).

- **web**: Vercel. `main` → produção, `dev` → homolog.
- **desktop**: tag `v*` dispara [desktop-release.yml](.github/workflows/desktop-release.yml),
  que builda nos 3 SOs e publica no repo de releases.
- **robots**: empacotado por PyInstaller dentro do instalador do desktop.

## Documentação

- [CLAUDE.md](CLAUDE.md) — arquitetura detalhada e convenções
- [docs/SDD-observabilidade.md](docs/SDD-observabilidade.md) — Sentry, LGPD, scrubbing
- [docs/DOCUMENTACAO-NEGOCIOS.md](docs/DOCUMENTACAO-NEGOCIOS.md) — regras de negócio
- [docs/CHECKLIST-GO-LIVE.md](docs/CHECKLIST-GO-LIVE.md) — subir para produção
