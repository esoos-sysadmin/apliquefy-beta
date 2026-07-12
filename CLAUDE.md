# Apliquefy — Contexto do Projeto para Claude

## O que é o Apliquefy

Apliquefy é uma plataforma de automação de candidaturas a vagas de emprego. O usuário configura parâmetros (currículo, filtros de busca, limites diários) na **web** e um **agente desktop** executa as candidaturas automaticamente nas plataformas LinkedIn e InfoJobs, em tempo real, enquanto o computador do usuário está ligado.

A automação em si roda num **engine RPA em Python** (Playwright + visão de IA), que o app desktop inicia como processo filho local. Os três ambientes se comunicam assim:

- **web ↔ desktop**: API REST + sessão Clerk (o desktop autentica num `BrowserWindow`).
- **desktop ↔ robots**: HTTP local em `127.0.0.1` (Bearer token efêmero, porta negociada via stdout) + WebSocket para eventos de execução ao vivo.
- **robots → web**: o engine chama de volta a API Next.js (`WebApiClient`) para ler runtime/limite diário da campanha e registrar candidaturas + debitar créditos.

---

## Estrutura do monorepo (Turborepo + npm workspaces)

```
apliquefy/
├── apps/
│   ├── web/          # Next.js 16 — painel web + API Routes (backend)
│   ├── desktop/      # Electron + React + Vite — shell/orquestrador local
│   └── robots/       # Python (uv) — engine RPA: FastAPI + Playwright + visão de IA
├── packages/
│   ├── database/     # Prisma schema + cliente PostgreSQL (@repo/database)
│   ├── ui/           # Componentes compartilhados (@repo/ui)
│   ├── eslint-config/
│   └── typescript-config/
```

**Comandos raiz (Turbo):**
```bash
npm run dev      # inicia web + desktop em paralelo
npm run build    # build completo
npm run check-types
```

O desktop empacota o engine Python via PyInstaller (`npm run build:robots` em `apps/desktop`) e o embute em `extraResources` do build Electron.

---

## apps/web — Next.js (App Router)

### Função
Painel SaaS onde o usuário gerencia currículos, cria campanhas de automação, assina planos e acompanha relatórios. Também expõe a API REST consumida tanto pelo painel quanto pelo engine RPA.

### Rotas de página (`app/(frontend)/`)
| Rota | Descrição |
|---|---|
| `/dashboard` | Visão geral, métricas |
| `/curriculos` | Listagem e criação de currículos |
| `/curriculos/novo` | Formulário de novo currículo |
| `/campanhas` | Listagem de campanhas |
| `/campanhas/nova` | Criar campanha LinkedIn ou InfoJobs |
| `/assinatura` | Planos e gerenciamento de créditos |
| `/conta` | Dados da conta |
| `/desktop` | Instruções e download do app desktop |

### API Routes (`app/api/`)
```
resumes/                    CRUD de currículos
campaigns/linkedin/         Criar campanha LinkedIn
campaigns/infojobs/         Criar campanha InfoJobs
campaigns/[id]/             Update, activate, pause
campaigns/[id]/runtime/     Estado de execução da campanha (lido pelo engine)
campaigns/[id]/daily-status/ Contagem do limite diário (lido pelo engine)
job-applications/           Registrar candidatura (POST) — criada pelo engine
job-applications/[id]/      Atualizar status/erro da candidatura (PATCH)
credits/balance/            Saldo de créditos
credits/debit-flat/         Débito idempotente por candidatura (chamado pelo engine)
checkout/                   Criar sessão Stripe Checkout
stripe/webhooks/            Eventos Stripe (idempotente via WebhookEvent)
desktop-auth/session/       Troca de token para o app desktop
jobs/                       Vagas coletadas pelo runner
reports/                    Relatórios de execução
```

### Backend interno (`backend/modules/`)
Cada módulo segue o padrão: **Zod schema → Controller → Service**
- `resume` — CRUD de currículos (dados em JSONB no Postgres)
- `campaign` — criação e controle de campanhas LinkedIn/InfoJobs
- `credits` — saldo, débito flat idempotente, transações de créditos
- `stripe` — integração com Stripe Billing (planos e créditos avulsos)
- `job` — vagas coletadas pelo agente
- `job-application` — candidaturas individuais registradas pelo engine
- `report` — relatórios de execução por campanha

### Camada de cliente (`app/`)
`lib/api-client.ts` (fetch tipado + `ApiError`), hooks React Query-like (`hooks/use-campaigns`, `use-credits`, `use-resumes`, `use-subscription`, `use-campaign-metrics`), `lib/auth/` (Clerk client + server), `lib/constants/` (opções de campanha, planos, etc.), `lib/toast.tsx`, `CreditGateProvider` (bloqueia ações sem saldo).

### Autenticação
Clerk (`@clerk/nextjs`). O desktop autentica abrindo `/login?redirect_url=/desktop-auth/success` num `BrowserWindow` Electron e pegando o token via cookie após o redirect.

### Stack
- Next.js 16.1 (App Router, Turbopack em dev)
- React 19
- Clerk 6 (auth)
- Prisma (`@repo/database`) → PostgreSQL
- Stripe 22 + Svix (webhooks)
- Zod 4 (validação em todos os layers)
- Tailwind CSS 3 + estilos inline (componentes de currículo)

---

## apps/desktop — Electron + React

### Função
Shell local que autentica o usuário, gerencia as **sessões de login** das plataformas e orquestra o engine RPA. Não executa a automação diretamente: inicia o processo Python e acompanha a execução via WebSocket.

### Estrutura interna
```
electron/            Processo main do Electron
  main.ts            Entry point, cria a BrowserWindow, sobe o engine RPA
  ipc/               Handlers IPC (campaigns, accounts, sessions, rpa, engine, settings, auth)
  services/
    auth-service            Fluxo de login Clerk no desktop
    session-service         Captura/validação de sessão via Playwright (storageState)
    session-heartbeat       Revalida sessões e pausa campanhas se expirarem
    rpa-process-service     Sobe/derruba o engine Python, handshake de porta, /health, restart
    rpa-events-service      Assina o WebSocket de eventos do run
    campaign-run-service    Inicia um run (monta storageState + PDF, chama POST /runs)
    resume-pdf-service      Gera o PDF do currículo para a candidatura
    backend-api-service     Cliente da API web
  controllers/       Orquestração entre IPC e services (auth, campaign, session)
  store.ts           Estado persistido localmente (auth, configurações, runner)
src/                 Processo renderer (React + Vite)
  pages/runner/      Tela principal do runner (campanhas ativas)
  pages/login/       Tela de autenticação
  hooks/             use-campaign-actions, use-sessions, use-rpa-events, use-electron
  components/        CampaignCard, ConnectAccounts, SessionBadge, SessionRequiredModal…
shared/              Tipos compartilhados entre main e renderer (runner-types.ts)
```

### Sessões de login (Playwright)
Antes de aplicar, o usuário precisa logar em cada plataforma pelo próprio desktop. `captureSession()` abre um Chrome real (`channel: "chrome"`, args anti-automação) via `launchPersistentContext`, espera o login observando os cookies de autenticação (`li_at` no LinkedIn; cookie httpOnly de sessão no InfoJobs) e salva `storage-state.json` em `userData/sessions/<plataforma>`. `validateSession()` **não navega** — lê os cookies salvos e checa validade, porque LinkedIn/InfoJobs derrubam sessão em browser headless/requisição crua (ver memória `rpa-browser-anti-detection`). O `session-heartbeat` pausa as campanhas da plataforma cuja sessão expirou.

### Engine RPA como processo filho
`rpa-process-service` faz `spawn` do binário Python (venv em dev, PyInstaller empacotado em prod), lê a porta na linha `RPA_ENGINE_PORT=<n>` do stdout, valida com `/health` (Bearer token efêmero por processo) e reinicia com backoff se cair. Passa por env: `RPA_AUTH_TOKEN`, `RPA_USER_DATA_DIR`, `APLIQUEFY_WEB_URL`, `APLIQUEFY_WEB_TOKEN`.

### Fluxo de autenticação desktop
1. Usuário clica "Sign in with Clerk" → `runDesktopSignInFlow()` abre `BrowserWindow` popup
2. Popup carrega `${WEB_URL}/login?redirect_url=/desktop-auth/success`
3. Após login Clerk, redireciona para `/desktop-auth/success`
4. Desktop detecta a URL via `did-navigate`, busca token via `/api/desktop-auth/session` e fecha a janela

---

## apps/robots — Engine RPA (Python)

### Função
Serviço local FastAPI que executa as candidaturas com Playwright, dirigido por um agente de visão de IA. Sobe efêmero junto com o desktop, ouve em `127.0.0.1` numa porta aleatória e só aceita requisições com o Bearer token que recebeu por env.

### Estrutura (`src/rpa_engine/`)
```
__main__.py            Entry point: imprime RPA_ENGINE_PORT e sobe o uvicorn
server.py              build_app() — FastAPI, auth Bearer, routers
config.py              Settings a partir de env vars
api/
  runs.py              POST /runs, DELETE /runs/{id}, GET status, WS /runs/{id}/events
  resumes.py           Geração/entrega do PDF de currículo
runtime/
  orchestrator.py      Orquestra um run (RunHandle: eventos, stop, subscribe)
  apply_flow.py        Fluxo de candidatura por vaga
  state_machine.py     Estados do run
  daily_limit.py       Respeita o limite diário da campanha
  session_loader.py    Carrega o storageState capturado pelo desktop
engines/
  base.py              Contrato de engine
  linkedin/            engine.py + selectors.py
  infojobs/            engine.py + selectors.py
cognitive/
  visual_agent.py      Agente de visão (decide ações a partir de screenshots)
  contracts.py, prompts/
pdf/resume_pdf.py      Gera PDF do currículo (reportlab)
web_api/client.py      WebApiClient — chama de volta a API Next.js
util/bboxes.py
```

### Fluxo de um run
1. Desktop chama `POST /runs` com `{ campaignId, storageStatePath, resumePdfPath }`.
2. O `Orchestrator` lê runtime + limite diário da campanha via `WebApiClient` (`/api/campaigns/[id]/runtime`, `/daily-status`).
3. Para cada vaga: cria a candidatura (`POST /api/job-applications`), aplica com o engine da plataforma guiado pelo `visual_agent`, atualiza status (`PATCH /api/job-applications/[id]`) e debita crédito idempotente (`POST /api/credits/debit-flat`).
4. Emite eventos (`started`/`progress`/`finished`) pelo WebSocket `/runs/{id}/events`, que o desktop assina.

### Stack
- Python ≥ 3.11, gerenciado por **uv** (`pyproject.toml` / `uv.lock`)
- FastAPI + uvicorn, Playwright (Chrome real), httpx
- Modelo de visão via OpenAI SDK (`OPENAI_MODEL`, default `gpt-4o-mini`)
- reportlab (PDF), websockets, PyInstaller (empacotamento)

---

## packages/database — Prisma

### Modelos principais
| Modelo | Descrição |
|---|---|
| `User` | Conta Clerk, créditos, plan tier, assinatura Stripe (`stripeSubscriptionId`, `subscriptionStatus`, `currentPeriodEnd`) |
| `Resume` | Currículo (title + JSONB: personalInfo, experience, education, skills, idioms) |
| `Campaign` | Campanha vinculada a Resume + User (relação com Job, Report, JobApplication) |
| `CampaignLinkedin` | Config 1:1 com Campaign — parâmetros LinkedIn |
| `CampaignInfojobs` | Config 1:1 com Campaign — parâmetros InfoJobs |
| `Job` | Vaga coletada pelo runner (link único, empresa, posição, nº de candidaturas) |
| `JobApplication` | Candidatura individual (pending/applied/failed/skipped) |
| `Report` | Relatório agregado por campanha (totais, sucesso/falha, créditos usados/reembolsados) |
| `Transaction` | Histórico de créditos (`idempotencyKey` único, `metadata` JSON) |
| `CreditWeight` | Tabela de pesos de crédito por estágio (`stage`, `weight`, `label`) |
| `WebhookEvent` | Idempotência de eventos Stripe |

### Enums importantes
- `Platform`: `linkedin | infojobs`
- `status_campaign`: `active | paused | inactive`
- `TransactionType`: `PURCHASE | USAGE | BONUS | REFUND | SUBSCRIPTION_CREDIT | RESET`
- `BrazilState`: todos os 27 estados (usado no filtro InfoJobs)
- `IjSalary`, `IjRadius`, `IjJobArea`, `IjSeniority`, `IjContract`, `IjSchedule`, `IjPcd` — filtros InfoJobs
- `LinkedinSort`, `LinkedinDate`, `LinkedinExp`, `LinkedinJobType`, `LinkedinRemote` — filtros LinkedIn

Seed em `prisma/seed.ts` (ex.: `CreditWeight`).

---

## Sistema de Créditos

- Cada candidatura debita crédito via `/api/credits/debit-flat` (idempotente por `idempotencyKey`, geralmente a candidatura); pesos por estágio em `CreditWeight`
- Planos (Stripe) liberam créditos mensais via webhook `customer.subscription.updated` (`SUBSCRIPTION_CREDIT` / `RESET`)
- Compras avulsas via Stripe Checkout creditam instantaneamente
- Reembolso automático em candidaturas com status `failed`

---

## Convenções do projeto

- **Validação**: Zod em todo boundary externo (API Route recebe, schema valida, service processa)
- **Erros**: API retorna `{ message, errorS/errorDesc }` — o frontend captura via `ApiError.details` e exibe `FormErrorBanner`
- **Datas**: formato `YYYY-MM` nos campos de currículo (mês/ano)
- **Campos `options`**: os arrays de opções dos selects DEVEM bater 1:1 com os enums do Prisma (ver `campaign-options.ts`)
- **Estilos**: Tailwind para campanhas/layout; inline styles (objeto `CSSProperties`) para componentes do formulário de currículo
- **Monorepo**: imports cruzados via `@repo/database`, `@repo/ui`
- **Anti-detecção**: sessões e runs usam Chrome real (`channel: "chrome"`) com args anti-automação; nunca validar sessão navegando em headless

---

## Variáveis de ambiente relevantes

**web:**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
DATABASE_URL
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_API_URL   # default: /api
DESKTOP_WEB_URL       # URL base do web que o desktop usa para autenticar
```

**robots (injetadas pelo desktop):**
```
RPA_AUTH_TOKEN        # Bearer efêmero exigido em toda request ao engine
RPA_USER_DATA_DIR     # userData do Electron (sessões, PDFs)
APLIQUEFY_WEB_URL     # base da API Next.js para os callbacks
APLIQUEFY_WEB_TOKEN   # token do usuário para autenticar na API web
OPENAI_API_KEY / OPENAI_MODEL   # modelo de visão (default gpt-4o-mini)
RPA_HEADLESS / RPA_BROWSER_CHANNEL / RPA_SLOWMO / RPA_DEVTOOLS   # debug/execução
COST_PER_APPLICATION  # custo em créditos por candidatura
```
