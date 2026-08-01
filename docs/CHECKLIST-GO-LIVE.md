# Checklist Go-Live — Apliquefy

Três ambientes: **dev** (local), **homolog**, **production**.
Ordem importa: as seções 0 e 1 bloqueiam todas as outras.

---

## 0. Código — antes de provisionar qualquer coisa

- [ ] **Commitar os 158 arquivos pendentes** na `dev`. O trabalho de IA/voz/A-B test/relatório existe só na working tree.
- [ ] **Migration do `AbTest`**: o model está em `schema.prisma`, a última migration é `20260730120000_add_resume_idioms`. Sem ela, `migrate deploy` sobe sem a tabela e `/api/ab-tests` retorna 500.
      `npx prisma migrate dev --name add_ab_test` em `packages/database`.
- [ ] **`.env.example`** na raiz e por app — hoje não existe registro das ~20 vars do web.
- [ ] **`.gitignore`**: `graphify-out/` (107 arquivos, 2MB) e `**/__pycache__/` (38 `.pyc`) estão versionados.
- [ ] **CI de PR** (`.github/workflows/ci.yml`): `npm run lint`, `npm run check-types`, `uv run pytest` em `apps/robots`. Hoje só existe `desktop-release.yml`, que roda em tag.
- [ ] Adicionar task `check-types` ao `apps/desktop` — o turbo roda em 3 de 7 pacotes.
- [ ] Substituir o `README.md` (ainda é o boilerplate do `create-turbo`).
- [ ] Remover as vars `CANNY_PRIVATE_KEY` / `NEXT_PUBLIC_CANNY_BOARD_TOKEN` do `.env` — o Canny foi substituído por Featurebase e o código não as lê mais.

---

## 1. Banco — Neon

- [ ] 1 projeto Neon, **3 branches**: `production` (default), `homolog`, `dev`. Branch custa menos que 3 projetos e dá reset instantâneo em homolog.
- [ ] `DATABASE_URL` por ambiente — usar sempre o host **`-pooler`**. O Vercel é serverless; sem pooler o Neon estoura o limite de conexões.
- [ ] `prisma migrate deploy` em cada branch (depois do item 0.2).
- [ ] **Seed do `CreditWeight`** em cada ambiente (`packages/database/prisma/seed.ts`). Sem os pesos, o débito de crédito por candidatura não tem tabela de referência.
- [ ] Backup / PITR: definir a janela de retenção do branch `production`.

---

## 2. Clerk

- [ ] **2 instâncias**: Development (serve dev + homolog) e Production.
- [ ] A instância de Production exige **domínio próprio + DNS**: `CNAME clerk.<dominio>`, `accounts.<dominio>`, e os registros de e-mail. Propagação leva horas — fazer cedo.
- [ ] Vars: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`.
- [ ] **Webhook** → `https://<dominio>/api/webhooks/clerk`, eventos `user.created` / `user.updated`. Secret em `CLERK_WEBHOOK_SECRET`.
- [ ] **JWT Template** para o desktop: criar no dashboard e casar o nome com `CLERK_DESKTOP_JWT_TEMPLATE` e `NEXT_PUBLIC_CLERK_JWT_TEMPLATE`. Sem isso o login do Runner não fecha.
- [ ] Allowed redirect URL: `/desktop-auth/success` — o `BrowserWindow` do desktop depende desse redirect.

---

## 3. Stripe

- [ ] Test mode para dev/homolog; **live mode** para production.
- [ ] Ativar a conta live: CNPJ, dados bancários, aceite. Não é instantâneo.
- [ ] **Recriar os 6 produtos no live** — os price IDs de test **não** funcionam em live:
      `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_PROFESSIONAL`, `STRIPE_PRICE_ENTERPRISE`,
      `STRIPE_PRICE_PACK_50`, `STRIPE_PRICE_PACK_100`, `STRIPE_PRICE_PACK_200`.
- [ ] **Webhook por ambiente** → `https://<dominio>/api/webhooks/stripe`. Eventos:
      `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`,
      `customer.subscription.updated`, `customer.subscription.deleted`.
      Cada endpoint gera um `STRIPE_WEBHOOK_SECRET` diferente.
- [ ] Ativar o **Billing Portal** no dashboard (`STRIPE_BILLING_PORTAL_URL`).
- [ ] `STRIPE_SECRET_KEY` por ambiente (`sk_test_` vs `sk_live_`).

---

## 4. Vercel

- [ ] Projeto único, root do monorepo. Install `npm ci`; o Vercel detecta o Turborepo e o filtro do `web`.
- [ ] Branch → ambiente: `main` = Production, `dev` = Preview com **domínio fixo de homolog** (Vercel → Domains → atribuir `homolog.<dominio>` à branch `dev`).
- [ ] Domínio próprio + DNS. Hoje o desktop tem `https://apliquefy.vercel.app` **hardcoded** em `apps/desktop/electron/store.ts:134` — trocar junto.
- [ ] `NEXT_PUBLIC_APP_URL` distinto por ambiente.
- [ ] Preencher as env vars nos 3 escopos (Production / Preview / Development):

| Var | Origem |
|---|---|
| `DATABASE_URL` | Neon (branch correspondente, host `-pooler`) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | Clerk |
| `CLERK_WEBHOOK_SECRET` | Clerk → Webhooks |
| `CLERK_DESKTOP_JWT_TEMPLATE`, `NEXT_PUBLIC_CLERK_JWT_TEMPLATE` | Clerk → JWT Templates |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Stripe |
| `STRIPE_PRICE_*` (6) | Stripe → Products |
| `STRIPE_BILLING_PORTAL_URL` | Stripe → Billing Portal |
| `RESEND_API_KEY`, `EMAIL_FROM` | Resend |
| `OPENAI_API_KEY`, `OPENAI_MODEL` | OpenAI |
| `SENTRY_DSN_WEB`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_AUTH_TOKEN` | Sentry |
| `COST_PER_APPLICATION`, `CREDIT_COST_PER_QUESTION`, `CREDIT_COST_MAX_PER_APPLICATION` | regra de negócio |
| `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_API_URL` | por ambiente |

---

## 5. Sentry

Detalhamento completo em [SDD-observabilidade.md](SDD-observabilidade.md) §12.1.

- [ ] Criar os projetos **`apliquefy-web`** e **`apliquefy-runner`** e pegar os DSNs.
- [ ] Web → env do Vercel: `SENTRY_DSN_WEB`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_AUTH_TOKEN`.
- [ ] Desktop/engine → GitHub secrets: `SENTRY_DSN_RUNNER`, `SENTRY_ORG`, `SENTRY_AUTH_TOKEN`.
- [ ] Ligar o **Data Scrubbing server-side** (§7.3, camada 5) — requisito LGPD, o currículo passa perto.
- [ ] Configurar as regras de alerta (§11) e o prazo de retenção.
- [ ] Revisar manualmente os **50 primeiros eventos em homolog** antes de apontar produção (§14).
- [ ] Fase 2 do §12 (alertas de quebra de seletor) segue ⏳; §15 não tem nenhum critério de aceite marcado.

---

## 6. Featurebase

- [ ] Publicar o board `apliquefy.featurebase.app` com `/roadmap`, `/help` e a página de sugestões — a sidebar já linka os três (`SidebarNav.tsx`).
- [ ] Nada de env: o `appId` está hardcoded em `AppProviders.tsx` e não há SSO configurado. Se quiser identificar o usuário no widget, isso é trabalho novo.

---

## 7. Resend

- [ ] Verificar o domínio (SPF + DKIM no DNS). Sem verificar, o Resend só entrega ao dono da conta — os e-mails transacionais somem em produção.
- [ ] `RESEND_API_KEY` e `EMAIL_FROM` com o domínio verificado.

---

## 8. OpenAI + Fish Audio — **blocker do desktop**

O `apps/desktop/.env` **não entra no pacote**: `build.files` inclui só `dist-electron/**` e `dist-react/**`, e não há `extraFiles`. No app instalado, `OPENAI_API_KEY` e `FISH_API_KEY` ficam `undefined` e o `assistant-service.ts` lança na primeira chamada — assistente de voz e agente visual quebram para todo usuário.

Decidir antes de gerar instalador:

- [ ] **(recomendado)** Proxiar OpenAI e Fish por rotas na API web, autenticadas com o token Clerk do usuário. A chave nunca sai do servidor e o consumo fica atrelado à conta.
- [ ] (alternativa) Embutir as chaves no build via `define` do Vite / env do electron-builder. Funciona, mas qualquer usuário extrai a chave do binário e o custo é ilimitado.

Enquanto não decidir: `OPENAI_API_KEY`, `OPENAI_MODEL`, `FISH_API_KEY`, `FISH_MODEL`.

---

## 9. Build e distribuição do desktop

- [ ] **Criar o repo `ESOOS-Tech-Company/apliquefy-releases`** — o `publish` do electron-builder aponta para ele. Público, senão o auto-update não baixa.
- [ ] Secret `RELEASES_TOKEN` no repo principal: PAT com `contents: write` no repo de releases.
- [ ] **Injetar `APLIQUEFY_WEB_URL` no build**, por ambiente. Hoje o fallback é `app.isPackaged ? PROD_WEB_URL : localhost` — não existe instalador de homolog, o build empacotado sempre aponta para produção.
- [ ] **Windows**: sem certificado de code signing o SmartScreen barra o instalador com aviso de editor desconhecido. Cert OV/EV é pago e leva dias para emitir.
- [ ] **macOS**: o CI usa `CSC_IDENTITY_AUTO_DISCOVERY: false` — o app não é assinado nem notarizado, o Gatekeeper bloqueia. Precisa de Apple Developer Program (US$99/ano) + notarização no CI.
- [ ] Validar que o **Chrome real** existe na máquina do usuário. As sessões usam `channel: "chrome"`; `npm run setup:chrome` é script de dev e não roda no instalador. Definir: exigir Chrome instalado (com mensagem clara na UI) ou empacotar.
- [ ] Smoke test do binário PyInstaller: disparar um evento Sentry a partir do executável empacotado, não do venv (risco conhecido no SDD §6.1).
- [ ] Tag de release: `git tag v0.1.0 && git push --tags` dispara o workflow nos 3 SOs.

---

## 10. Legal / LGPD

- [ ] Política de Privacidade e Termos já existem em `app/(landing)/` — revisar com o toggle de consentimento do Sentry (SDD §7.7) e com o tratamento das credenciais de LinkedIn/InfoJobs.
- [ ] Avaliar o DPA com Sentry, Clerk e OpenAI.

---

## Ordem sugerida

1. Seção 0 (código) → 1 (Neon) → 2 (Clerk dev) → 3 (Stripe test) → 4 (Vercel homolog)
2. Homolog rodando ponta a ponta: cadastro → campanha → run do desktop → candidatura → débito de crédito
3. Seção 5 (Sentry) apontando para homolog, revisar os 50 eventos
4. Seção 8 (decisão das chaves) → 9 (release do desktop, canal beta)
5. Só então duplicar tudo para produção: Clerk Production, Stripe live, domínio, tag `v1.0.0`
