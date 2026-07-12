# Handoff — feat/login-desktop-session

> Atualizado em 2026-07-11 20:31 · base `origin/main` · último commit `a5c7493 fix: arrumando bugs e fazendo melhorias no front`

## O que foi alterado

O grosso desta branch é a construção do **sistema de billing (Stripe) + créditos** de ponta a ponta na web, e a sua propagação para o desktop. No backend web surgiram dois módulos-serviço: `StripeService` (cria clientes Stripe, sessões de Checkout de assinatura e de pacote avulso, sessão do billing portal, e processa os webhooks `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated/deleted`) e `CreditsService` (`checkBalance`, `debitCredits` idempotente por `idempotencyKey` com custo ponderado por estágio + arredondamento para cima e débito atômico permitindo saldo negativo, `getCreditHistory` paginado com filtros, `getWeightsConfig`). Foram criadas as rotas `POST /api/stripe/checkout`, `POST /api/webhooks/stripe` (verifica assinatura e usa `WebhookEvent` para idempotência), e o quarteto `GET/POST /api/credits/{balance,debit,history,weights}`. O schema Prisma ganhou os campos de assinatura no `User` (`stripeSubscriptionId`, `subscriptionStatus`, `currentPeriodEnd`), `credits` virou `Int @default(0)` não-nulável, `Transaction` ganhou `idempotencyKey` único + `metadata Json`, o enum `TransactionType` ganhou `SUBSCRIPTION_CREDIT`/`RESET`, e entraram os modelos `CreditWeight` e `WebhookEvent` (com seed dos pesos).

No fluxo de produto, o onboarding foi ligado ao pagamento: novos usuários passam a nascer com `credits: 0` e `subscriptionStatus: "pending"` (antes 100 créditos), a landing `/planos` manda para `/cadastro?plan=<slug>`, e após o signup o Clerk redireciona para `/api/checkout/onboarding?plan=...`, que cria o Checkout de assinatura e joga o usuário no Stripe; depois de pagar, cai em `/obrigado`. As telas `/assinatura` e `/assinatura/pacotes` mostram saldo, plano/status e vendem pacotes avulsos. Surgiu um **gate de créditos** na UI: `CreditGateProvider` (via SWR `useCredits`, refresh 30s) expõe `canSend`/saldo e um `UpsellModal`; a sidebar ganhou `SidebarCredits`; o link "Assinatura" passou de `/api/stripe` para `/assinatura`. O `login` agora sanitiza `redirect_url` (só aceita paths internos, senão normaliza a URL) e `/desktop` lê `?tab=como-funciona`.

Duas mudanças transversais de formulário/validação: os erros de API agora carregam `details` (`ApiError.details`), e um novo `flattenZodErrorTree` + `FormErrorBanner` traduzem a árvore de erros Zod em mensagens por campo rotuladas — adotados em criar campanha (que abandonou o `canSubmit` disabled em favor de validação explícita com scroll ao topo) e criar currículo. Os selects de campanha (`campaign-options.ts`) foram reescritos para bater 1:1 com os enums Prisma (27 estados, níveis LinkedIn/InfoJobs completos, áreas, contratos etc.) e `jobArea` do currículo virou obrigatório. Os inputs de mês/ano nativos (`<input type="month">`) foram trocados por um `MonthYearPicker` custom pt-BR. No desktop, o saldo de créditos foi persistido no store, exposto por IPC (`credits:get-balance`), exibido na `StatusBar` (vermelho quando ≤0), poll a cada 60s, e a ativação de campanha é **bloqueada sem créditos** (abre `/assinatura`). O `CampaignCard` ficou sempre compacto, só mostra stats quando `status === "active"`, e a lógica do botão passou a girar em torno de `isActive` (não mais `isPaused`).

## Arquivos modificados

- `.codex` — arquivo vazio removido.
- `Docs/ApliquefySQL.sql` — dump SQL legado removido (schema agora é o Prisma).
- `Docs/postman/apliquefy.collection.json` — adicionadas pastas Stripe e Credits e variáveis `clerk_token`/`stripe_signature`.
- `apps/desktop/electron/ipc/credits.ts` — novo handler IPC `credits:get-balance` (registro idempotente).
- `apps/desktop/electron/main.ts` — `app.disableHardwareAcceleration()` e `openDevTools()` comentado.
- `apps/desktop/electron/main/register-ipc-handlers.ts` — passa a chamar `registerCreditIpc()`.
- `apps/desktop/electron/notifications.ts` — `maybeShowRunnerNotification` aceita `url` opcional e abre link externo no clique.
- `apps/desktop/electron/preload.ts` — expõe `credits.getBalance` no bridge.
- `apps/desktop/electron/services/credit-service.ts` — novo: busca `/api/credits/balance`, com fallback `{balance:0,canSend:false,plan:"free"}`.
- `apps/desktop/electron/store.ts` — persiste `creditBalance` no estado do runner (default + merge na leitura).
- `apps/desktop/shared/runner-types.ts` — novo tipo `RunnerCreditBalance` e entradas em `RunnerPersistedState`/`ElectronAPI`.
- `apps/desktop/src/components/molecules/CampaignCard.tsx` — card sempre compacto; stats só quando ativo; botão/aria baseados em `isActive`.
- `apps/desktop/src/components/organisms/StatusBar.tsx` — exibe créditos (ícone `Coins`), texto vermelho quando saldo ≤0.
- `apps/desktop/src/components/templates/RunnerShell.tsx` — recebe e repassa `creditBalance` para a `StatusBar`.
- `apps/desktop/src/hooks/use-campaign-actions.ts` — bloqueia ativação sem `canSend`, abre `${WEB_URL}/assinatura`; `@ts-ignore` no `import.meta.env`.
- `apps/desktop/src/hooks/use-electron.ts` — fallback de `credits.getBalance` no mock da API.
- `apps/desktop/src/hooks/use-runner-bootstrap.ts` — hidrata créditos no bootstrap e faz poll a cada 60s quando autenticado.
- `apps/desktop/src/index.css` — `.campaign-card__stats` vira linha (space-between) e valor reduzido a 14px tabular.
- `apps/desktop/src/pages/runner/index.tsx` — lê `creditBalance` do store e passa ao `RunnerShell`.
- `apps/desktop/src/stores/credit-store.ts` — novo store (hydrate/setBalance/setLoading + hook).
- `apps/web/app/(auth)/cadastro/[[...cadastro]]/page.tsx` — client component; lê `?plan` e define `afterSignUpUrl` para o checkout de onboarding.
- `apps/web/app/(auth)/login/[[...login]]/page.tsx` — valida/normaliza `redirect_url` e aplica `forceRedirectUrl`/`signUpForceRedirectUrl`.
- `apps/web/app/(frontend)/assinatura/pacotes/page.tsx` — nova página de compra de pacotes avulsos.
- `apps/web/app/(frontend)/assinatura/page.tsx` — nova página de assinatura: saldo, status do plano, portal e pacotes.
- `apps/web/app/(frontend)/campanhas/nova/page.tsx` — validação explícita + `FormErrorBanner` + mapeamento de erros 400 da API; remove `canSubmit`.
- `apps/web/app/(frontend)/curriculos/novo/page.tsx` — adiciona `apiErrors`/`FormErrorBanner` e mapeamento de erros Zod da API.
- `apps/web/app/(frontend)/desktop/page.tsx` — aba inicial derivada de `?tab` via `useSearchParams`.
- `apps/web/app/(landing)/layout.tsx` — novo layout escuro do grupo landing.
- `apps/web/app/(landing)/obrigado/page.tsx` — nova página pós-pagamento com próximos passos.
- `apps/web/app/(landing)/planos/page.tsx` — nova página pública de planos (CTA → `/cadastro?plan=`).
- `apps/web/app/(landing)/politica-de-privacidade/page.tsx` — nova página estática LGPD.
- `apps/web/app/(landing)/termos-de-servico/page.tsx` — nova página estática de termos.
- `apps/web/app/api/checkout/onboarding/route.ts` — novo GET: cria Checkout de assinatura pós-signup e redireciona ao Stripe (successUrl `/obrigado`).
- `apps/web/app/api/credits/balance/route.ts` — novo GET autenticado que retorna `checkBalance`.
- `apps/web/app/api/credits/debit/route.ts` — novo POST autenticado que chama `debitCredits`.
- `apps/web/app/api/credits/history/route.ts` — novo GET com filtros (`type/from/to/page/limit`) e paginação.
- `apps/web/app/api/credits/weights/route.ts` — novo GET da tabela de pesos.
- `apps/web/app/api/resumes/route.ts` — adiciona `console.log` de debug nos ramos 400.
- `apps/web/app/api/stripe/checkout/route.ts` — novo POST: exige `planSlug` **ou** `packageSlug` e delega ao `StripeService` (mapeia códigos p/ status HTTP).
- `apps/web/app/api/stripe/route.ts` — GET passa a criar sessão do billing portal via serviço (não mais env estática).
- `apps/web/app/api/webhooks/clerk/route.ts` — novo usuário nasce com `credits: 0` e `subscriptionStatus: "pending"`.
- `apps/web/app/api/webhooks/stripe/route.ts` — novo endpoint: verifica assinatura, checa `WebhookEvent`, roteia handlers e registra evento processado.
- `apps/web/app/client/credits.service.ts` — novos wrappers de cliente (balance/debit/history/weights).
- `apps/web/app/client/stripe.service.ts` — novos wrappers `createCheckoutSession`/`createPortalSession`.
- `apps/web/app/components/molecules/FormErrorBanner.tsx` — novo banner de erros por campo (inline styles).
- `apps/web/app/components/molecules/MonthYearPicker.tsx` — novo picker mês/ano pt-BR com popover, views mês/ano e ações Limpar/Hoje.
- `apps/web/app/components/molecules/SidebarCredits.tsx` — novo card de saldo na sidebar (verde/âmbar/vermelho por nível), link `/assinatura`.
- `apps/web/app/components/molecules/SidebarNav.tsx` — link "Assinatura" muda de `/api/stripe` para `/assinatura`.
- `apps/web/app/components/organisms/ResumeEducationSection.tsx` — usa `MonthYearPicker` nas datas de formação.
- `apps/web/app/components/organisms/ResumeWorkExperienceSection.tsx` — usa `MonthYearPicker`; `placeholder` "Atual" quando emprego atual.
- `apps/web/app/components/organisms/Sidebar.tsx` — inclui `SidebarCredits`.
- `apps/web/app/components/organisms/UpsellModal.tsx` — novo modal de upsell (upgrade de plano ou pacote avulso), usa helpers `getNextPlan`/`isMaxPlan`.
- `apps/web/app/components/providers/AppProviders.tsx` — envolve a árvore com `CreditGateProvider`.
- `apps/web/app/components/providers/CreditGateProvider.tsx` — novo contexto (`canSend`, saldo, `showUpsell`, `refetch`) + monta `UpsellModal`.
- `apps/web/app/hooks/use-credits.ts` — novo hook SWR (refresh 30s) com `refetch`/`updateBalance`.
- `apps/web/app/hooks/use-subscription.ts` — novo hook (`subscribeToPlan`, `purchaseCreditPackage`, `openBillingPortal`).
- `apps/web/app/layout.tsx` — corrige typo `localFont({w` → `localFont({`.
- `apps/web/app/lib/api-client.ts` — `ApiError` passa a carregar `details` extraído de `errorS`/`errorDesc`.
- `apps/web/app/lib/constants/campaign-options.ts` — opções LinkedIn/InfoJobs realinhadas 1:1 com os enums Prisma (27 estados, áreas, etc.).
- `apps/web/app/lib/constants/plans.ts` — novo: `PLANS`, `CREDIT_PACKAGES`, `formatBRL`, mapeamentos slug↔Stripe price ID (env), portal URL.
- `apps/web/app/lib/format-field-errors.ts` — novo: `FIELD_LABELS` + `flattenZodErrorTree` (árvore Zod → `FieldError[]`).
- `apps/web/app/lib/stripe.ts` — novo cliente Stripe (exige `STRIPE_SECRET_KEY`).
- `apps/web/app/lib/types/credits-types.ts` — novos tipos internos do serviço de créditos.
- `apps/web/app/lib/validations/credits.ts` — novos schemas Zod (debit com preprocess camel/snake; filtros de histórico).
- `apps/web/app/lib/validations/resume.ts` — `jobArea` da experiência passa a ser obrigatório.
- `apps/web/app/types/credits.ts` — novos tipos de cliente (balance/debit/transaction/weight).
- `apps/web/backend/modules/credits/credits.service.ts` — novo `CreditsService` (balance/debit/history/weights).
- `apps/web/backend/modules/stripe/stripe.service.ts` — novo `StripeService` (checkout, portal, handlers de webhook).
- `apps/web/package.json` — adiciona dependência `stripe ^22.0.1`.
- `apps/web/proxy.ts` — rotas públicas `planos`/`obrigado`/`checkout/onboarding` e reativa o matcher de `/(api|trpc)`.
- `packages/database/package.json` — configura `prisma.seed` e script `db:seed`.
- `packages/database/prisma.config.ts` — define `migrations.seed = tsx prisma/seed.ts`.
- `packages/database/prisma/schema.prisma` — campos de assinatura no `User`, `credits` não-nulável, `Transaction` idempotency+metadata, enum ampliado, modelos `CreditWeight`/`WebhookEvent`.
- `packages/database/prisma/seed.ts` — novo seed dos pesos de crédito (upsert por `stage`).
- `turbo.json` — adiciona `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_APP_URL` ao `globalEnv`.

## Pontos de atenção e próximos passos

- **Modelo de débito inconsistente com o produto.** O `debitCredits`/`/api/credits/debit` foi escrito em cima de um pipeline de "perguntas" com estágios `input/rag/output/judge/fallback` (`debitCreditsSchema` exige `questions[].question_id/used_fallback`, `campaign_id` uuid, `idempotency_key`). Isso não bate com o fluxo real de candidaturas, e o CLAUDE.md referencia `/api/credits/debit-flat` (idempotente por candidatura) — **que não existe nesta branch**. Parece copy-paste de outro produto. Definir se o engine RPA vai debitar por aqui ou se falta criar o `debit-flat`; o exemplo Postman "Debit Credits" (`stages`, `id`) também não bate com o schema Zod.
- **Migração de banco pendente.** `credits` mudou de `Int?` para `Int @default(0)` não-nulável, entraram colunas novas em `User`/`Transaction` e duas tabelas (`credit_weights`, `webhook_events`). Precisa de `db push`/migration + backfill de `credits` null e rodar `db:seed` (senão os pesos caem nos defaults hardcoded do serviço: input 0.1 / rag 0.1 / output 0.2 / judge 0.1 / fallback 0.5).
- **`subscriptionStatus` é string livre e informal.** O webhook Clerk grava `"pending"`, os handlers Stripe gravam `active/past_due/canceled`, e a UI compara com esses literais. Sem enum, qualquer divergência de string quebra silenciosamente (ex.: a página de assinatura só trata `active/canceled/past_due`).
- **Env do Stripe.** Os price IDs (`STRIPE_PRICE_STARTER/PROFESSIONAL/ENTERPRISE/PACK_50/PACK_100/PACK_200`) vêm de env mas **não** foram adicionados ao `globalEnv` do `turbo.json` (só entraram `STRIPE_SECRET_KEY`/`WEBHOOK_SECRET`/`NEXT_PUBLIC_APP_URL`). Sem eles, checkout retorna `NOT_FOUND`. O `STRIPE_PORTAL_URL` em `plans.ts` é um link de **test mode** hardcoded (não usado pela rota, que gera portal dinâmico — verificar qual caminho vale).
- **Novo usuário nasce sem créditos** (`credits: 0`): qualquer fluxo/teste que assumia os 100 créditos gratuitos quebra; usuário só destrava após pagar. Confirmar se é o comportamento desejado.
- **Idempotência do webhook Stripe** registra o `WebhookEvent` *depois* de rodar o handler, fora da transação de negócio: se o handler aplicar o efeito mas o `create` do evento falhar, o retry do Stripe reprocessa (risco de crédito duplicado em `invoice.paid`/pacotes). Considerar gravar o evento dentro da mesma transação.
- **Sujeira deixada para trás:** `console.log` de debug em `api/resumes/route.ts`, `openDevTools()` comentado e `disableHardwareAcceleration()` global em `main.ts` (confirmar se é fix intencional de render), e `@ts-ignore` no `import.meta.env` em `use-campaign-actions.ts`.
- **`jobArea` obrigatório** enquanto os demais campos de experiência seguem opcionais — pode rejeitar currículos antes válidos; revisar consistência do `experienceSchema`.
