# Site Institucional Apliquefy — Design

> 2026-07-22 · escopo: `apps/web` · só UI + roteamento, zero mudança no checkout/Stripe/Clerk/API

## Objetivo

Substituir o placeholder atual (`app/lp` = "Simulação PLano LP") por um site
institucional real e público: navbar com Entrar/Criar conta, hero, seções
padrão (sobre, como funciona, recursos, preços, FAQ) e footer. O fluxo de
checkout já existe e é reaproveitado **intacto**.

## Requisitos (decididos com o usuário)

- Home de marketing vive em **`/home`** (não `/lp`).
- Multi-página: home rica em `/home` + página dedicada `/sobre`; `/planos` já existe.
- O site institucional é **público para todos**, inclusive usuário logado — nenhum
  redirect forçado ao entrar nas rotas de marketing.
- Reaproveita o fluxo de checkout existente sem alteração.

## Fluxo de checkout (existente — NÃO alterar)

`/planos` → `Link` para `/cadastro?plan=<slug>` → `SignUp` do Clerk com
`forceRedirectUrl=/api/checkout/onboarding?plan=<slug>` → rota cria
`createSubscriptionCheckout` (Stripe) → redirect pro Stripe → sucesso → `/obrigado`.

Os CTAs de preço na landing apenas linkam para `/cadastro?plan=<slug>` (ou `/planos`).

## Roteamento

Toda a chrome de marketing fica no route group `(landing)` com layout compartilhado.

```
apps/web/app/(landing)/
  layout.tsx          ← <LandingNavbar/> + {children} + <LandingFooter/>  (dark #0B111A)
  home/page.tsx       ← HOME (nova; substitui app/lp)
  sobre/page.tsx      ← About us completa (nova)
  planos/page.tsx     ← existe; ajuste leve de espaçamento p/ casar com navbar fixa
  obrigado/page.tsx   ← existe (pós-checkout) — herda navbar/footer, ok
  politica-de-privacidade/page.tsx, termos-de-servico/page.tsx  ← existem

apps/web/app/components/organisms/
  LandingNavbar.tsx   ← fixa. Logo · Sobre · Como funciona · Preços ·
                        <SignedOut>Entrar / Criar conta</SignedOut>
                        <SignedIn>Ir para o painel (→ /relatorios)</SignedIn>
  LandingFooter.tsx   ← colunas de links + termos/privacidade + copyright
```

`app/lp/` é **removido**. Root `app/page.tsx`: deslogado `redirect("/home")`
(era `/lp`); logado continua `redirect("/relatorios")`.

## Middleware (`proxy.ts`) — fix obrigatório

Adicionar ao `isPublicRoute` (hoje `/politica*`, `/termos*` e `/sobre` cairiam no
`auth.protect()`):

```
'/home',
'/sobre',
'/politica-de-privacidade',
'/termos-de-servico',
```

`/planos` e `/obrigado` já são públicos. Tornar público satisfaz "não privado para
logado": o `clerkMiddleware` só protege rotas fora da lista; não redireciona
usuário logado para longe de rotas públicas.

## Home `/home` — seções (topo → base)

1. **Hero** — headline + subhead + CTA primário "Começar agora" (→ `/planos`) e
   secundário "Ver como funciona" (âncora `#como-funciona`).
2. **Plataformas** — faixa "Funciona no LinkedIn e InfoJobs".
3. **Como funciona** (`#como-funciona`) — 3 passos: cria currículo → configura
   campanha → o agente aplica sozinho enquanto o PC está ligado.
4. **Recursos** — grid de benefícios: roda local na sua máquina, visão de IA,
   limite diário, múltiplas campanhas, relatórios.
5. **Sobre (resumo)** — parágrafo curto + link "Conheça a Apliquefy" (→ `/sobre`).
6. **Preços** (`#precos`) — 3 planos de `PLANS` (lib/constants/plans), destaque no
   do meio, cada card CTA → `/cadastro?plan=<slug>`. Nota "Pagamento seguro via Stripe".
7. **FAQ** — 5-6 perguntas: é seguro? preciso deixar o PC ligado? posso cancelar?
   como pago? funciona em qual plataforma? (`<details>` nativo, sem lib).
8. **CTA final** — faixa "Pronto para automatizar suas candidaturas?" → `/planos`.

## Página `/sobre`

Versão longa do About: o que é a Apliquefy, a proposta local-first (a automação
roda na máquina do usuário, não num servidor), como funciona por cima, missão.
CTA de checkout no fim (→ `/planos`).

## Consistência visual (reuso)

- Paleta existente: fundo `#0B111A`, cards `#0F1520` / borda `#1C2333`, accent
  `#2563EB`, texto `slate-*`. Igual a `/planos` e `/obrigado`.
- `lucide-react` para ícones, Tailwind para tudo. App é dark-only.
- Logo: reaproveita o padrão do `SidebarLogo` (quadrado azul "A" + "Apliquefy").

## Fora de escopo (YAGNI)

i18n, blog, depoimentos, dark/light toggle, CMS, animações pesadas. Nenhuma
dependência nova — tudo com o que já está instalado.

## Verificação

- `npm run check-types` (web) passa.
- Deslogado: `/` → `/home`; `/home`, `/sobre`, `/planos` abrem sem login.
- Logado: `/home` e `/sobre` abrem sem redirect; navbar mostra "Ir para o painel".
- CTA de plano leva a `/cadastro?plan=<slug>` e o checkout Stripe segue como antes.
