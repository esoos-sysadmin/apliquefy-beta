# Handoff — feature/desktop-test-build

> Atualizado em 2026-10-14 23:41 · base `origin/main` · último commit `a7fe8ba feat: chaves de IA no servidor via proxy /api/ai e release de teste do desktop`

## O que foi alterado

As chaves de IA saíram das máquinas dos usuários. A web ganhou dois proxies autenticados por Clerk. O primeiro, `POST /api/ai/openai/[...path]`, espelha o `/v1` da OpenAI. Ele só aceita os paths `chat/completions` e `audio/transcriptions`, e no chat só os modelos `gpt-4o-mini` e `gpt-4.1-mini`. Na transcrição, ele refaz o form e fixa o modelo em `whisper-1`. A resposta do upstream volta em stream, e `maxDuration` é 60 s. O segundo, `POST /api/ai/tts`, valida com Zod (`text` de 1 a 2000 caracteres, `referenceId` opcional) e chama a fish.audio. Se a fish.audio falhar, devolve 502 com `upstreamStatus`. O assistente do desktop (Apollo) passou a chamar esses endpoints via `apiFetch` com o token Clerk e traduz 401 como "sessão expirada". O `apiFetch` deixou de forçar `Content-Type` quando o body é `FormData`. No engine Python, `openai_api_key` foi removido. O `ChatOpenAI` do browser-use agora usa `base_url = {APLIQUEFY_WEB_URL}/api/ai/openai` e `api_key = APLIQUEFY_WEB_TOKEN`. No empacotamento, o CI grava o secret `DESKTOP_RUNTIME_ENV` em `build/runtime.env`, que vai para `extraResources`. O app empacotado carrega esse arquivo em vez do `.env`, que deve ter só config sem segredo. O processo main também passou a chamar `app.setName("Apliquefy")`, que no Linux define o WM_CLASS. Antes disso, o `userData` é fixado para não mudar de pasta. O build ganhou ícone, e o publish passou a apontar para o owner `esoos-sysadmin`.

No engine RPA entrou um **gate de aderência**, que roda no LinkedIn e no InfoJobs entre o `job_found` e o clique em "Candidatar". `fit_gate.passes()` lê a descrição da vaga por seletores genéricos, com fallback para `<main>`. O texto precisa ter pelo menos 200 caracteres e é cortado em 6.000. Ele vai numa chamada de LLM só com texto, junto com o currículo normalizado, e volta como um `FitVerdict` (`score` de 0 a 100, `blocker`, `reason`). O prompt trata dois casos como eliminação, e não como nota: requisito obrigatório ausente (formação, certificação/conselho, CNH, residência em outro país) e idioma exigido que não aparece em `idioms`. Idioma presente, mas num nível abaixo do pedido, só reduz a nota. Requisito "desejável" não bloqueia. `should_skip()` descarta a vaga se houver `blocker` ou se `score < FIT_MIN_SCORE`, e o limiar é inclusivo. O gate é fail-open: devolve `None` e o robô se candidata normalmente nestes casos:
- `FIT_MIN_SCORE=0`, que é o default;
- não há `web_api_token`;
- a descrição está ilegível;
- o LLM ou o proxy falha.

A vaga descartada passa por `record_skip()`. A função cria a `JobApplication`, faz PATCH com `status=skipped` e um `errorLog` prefixado por `FIT:`, e emite o evento `skipped`/`low_fit`. Nenhum crédito é debitado e a vaga fica fora do fluxo de reembolso. Se o POST devolver 409, a função não faz nada, para não sobrescrever um desfecho anterior. O prompt do agente (`_build_task`) ganhou uma regra para **perguntas abertas**. O agente deve sempre responder, usando só o que está no currículo, nesta ordem: situação atual, depois a evidência mais forte com número, depois a ligação com a vaga. Deve ficar abaixo do limite do campo (ou em 3 frases, se não houver limite), sem clichês e no idioma da vaga. Em `/relatorios`, cada item do histórico passou a expor `reason` (o `errorLog`), e o agrupamento de motivos passou a incluir `skipped`. Os prefixos `FIT:` e `ELEGIBILIDADE:` viram buckets fixos. O card virou "Por que não foram enviadas", e a tabela ganhou a coluna "Motivo", que mostra o texto sem o prefixo.

A rota `/lp`, que antes era um placeholder, virou um **funil de aquisição completo** em tema "laudo" (papel/tinta, tokens `lp-*` com escopo em `.lp`). O fluxo é:
1. Quiz adaptativo. Pula minutos e respostas para quem envia 0 candidaturas por semana, esconde inglês para varejo, e trocar o segmento limpa as respostas dependentes.
2. Tela "ponte" emocional.
3. Upload do currículo, lido no próprio aparelho: PDF via pdf.js do cdnjs, `.docx` por parse manual do zip com `DecompressionStream`, ou texto colado.
4. Nota heurística por critérios ponderados.
5. Gate de contato com prévia borrada.
6. Laudo com tempo gasto, taxa de resposta, projeção por plano e cards de plano. Sem computador, oferece só o currículo.
7. Order bumps, checkout **simulado**, OTO com downsell.
8. Tela de obrigado com download (no desktop) ou envio do link por e-mail, WhatsApp, clipboard ou `.ics` (no celular).

O estado fica em `sessionStorage` e cada tela entra no `history`. Depois de pago, "voltar" não reabre telas anteriores ao pagamento. `?a=` adapta a manchete. `?s=` permite responder a pergunta 1 por form GET antes do JS hidratar.

Além disso:
- o app web ficou só em tema escuro, com o canvas em gradiente fixo no `body`, e a sidebar foi para 264px;
- as páginas legais ficaram públicas, e `<html lang>` virou `pt-BR`;
- `/desktop` ganhou `Suspense` em volta do `useSearchParams`;
- o `@repo/database` passou a exportar só `Prisma` como valor;
- `prisma.config.ts` tolera a ausência de `DATABASE_URL` no `generate`.

## Arquivos modificados

- `.claude/handoff.md` — o handoff de billing/créditos foi trocado por um sobre o fit gate, a mudança visual e o Prisma/Turbo. Ele já nasce desatualizado: cita `OPENAI_API_KEY` como condição de fail-open e não cobre o proxy de IA, o `/lp` nem o release do desktop.
- `.github/workflows/desktop-release.yml` — novo step "Write runtime.env", que grava o secret `DESKTOP_RUNTIME_ENV` em `apps/desktop/build/runtime.env` antes do build e do publish.
- `apps/desktop/electron/main.ts` — fixa o `userData` e chama `app.setName("Apliquefy")`; empacotado, carrega `process.resourcesPath/runtime.env` em vez de `../../.env`.
- `apps/desktop/electron/services/assistant-service.ts` — Whisper, chat e TTS do Apollo passam a chamar `/api/ai/openai/*` e `/api/ai/tts` via `apiFetch`, sem chave local; 401 vira `SESSION_EXPIRED` e o `upstreamStatus` (402/422) do TTS vira mensagem específica.
- `apps/desktop/electron/services/backend-api-service.ts` — `apiFetch` omite `Content-Type: application/json` quando o body é `FormData`, para o fetch gerar o boundary do multipart.
- `apps/desktop/package.json` — adiciona `build.icon` e `resources/icon.png` em `files`, `build/runtime.env → runtime.env` em `extraResources`, e troca o owner do publish para `esoos-sysadmin`.
- `apps/desktop/resources/icon.svg` — novo ícone do app (quadrado arredondado com o gradiente violeta/laranja da marca).
- `apps/robots/src/rpa_engine/config.py` — remove `openai_api_key`, adiciona `openai_base_url` (`{web_url}/api/ai/openai`) e `fit_min_score` (env `FIT_MIN_SCORE`, limitado a 0–100, default 0).
- `apps/robots/src/rpa_engine/engines/infojobs/engine.py` — normaliza `title` uma única vez e roda `fit_gate.passes/should_skip` antes do clique em `APPLY_BUTTON`; vaga reprovada chama `record_skip` e faz `continue`.
- `apps/robots/src/rpa_engine/engines/linkedin/engine.py` — mesmo gate entre o evento `job_found` e o clique em `APPLY_BUTTON`, com `record_skip` + `continue` para vaga reprovada.
- `apps/robots/src/rpa_engine/runtime/apply_agent.py` — nova `record_skip()` (POST, PATCH `skipped` + `error_log`, evento `skipped`/`low_fit`, não faz nada em 409); regra de "Pergunta ABERTA" no `_build_task`; `ChatOpenAI` passa a usar `web_api_token` + `openai_base_url`.
- `apps/robots/src/rpa_engine/runtime/fit_gate.py` — novo módulo com `FitVerdict`, prompt `_SYSTEM`, `_read_description` (seletores com fallback para `main`, faixa de 200 a 6.000 caracteres), `passes` (fail-open, `output_format=FitVerdict`), `should_skip` e `skip_reason` (prefixo `FIT:`, prioriza o `blocker`).
- `apps/robots/tests/test_apply_agent.py` — testa as invariantes do prompt de pergunta aberta (incluindo vir depois de ELEGIBILIDADE) e o `record_skip` com `_FakeClient` (grava `skipped` sem debitar; não faz nada em 409).
- `apps/robots/tests/test_fit_gate.py` — novos testes de `should_skip`, `skip_reason`, invariantes do `_SYSTEM`, gate desligado sem tocar na página e `_read_description` com Playwright (`channel="chrome"`).
- `apps/web/app/(auth)/layout.tsx` — remove `bg-[#0B111A]` do `<main>`.
- `apps/web/app/(frontend)/desktop/page.tsx` — move o conteúdo para `DesktopContent` dentro de `<Suspense>`, exigido pelo `useSearchParams` no build.
- `apps/web/app/(frontend)/layout.tsx` — wrapper com `background: transparent` e `marginLeft` do `<main>` de 220 para 264px.
- `apps/web/app/(frontend)/relatorios/page.tsx` — adiciona `formatReason` (tira os prefixos `FIT:`/`ELEGIBILIDADE:`), novo título/subtítulo e badge `slate` no card de motivos, e a coluna "Motivo" (`line-clamp-2`, `colSpan` 7, `min-w` 820px).
- `apps/web/app/(landing)/layout.tsx` — wrapper com `background: transparent`.
- `apps/web/app/(landing)/obrigado/page.tsx` — remove `bg-[#0B111A]`.
- `apps/web/app/(landing)/planos/page.tsx` — remove `bg-[#0B111A]`.
- `apps/web/app/(landing)/politica-de-privacidade/page.tsx` — remove `bg-[#0B111A]`.
- `apps/web/app/(landing)/termos-de-servico/page.tsx` — remove `bg-[#0B111A]`.
- `apps/web/app/api/ai/openai/[...path]/route.ts` — novo proxy POST autenticado: allowlist de path e de modelo de chat, `whisper-1` fixo na transcrição, upstream devolvido em stream e `maxDuration = 60`.
- `apps/web/app/api/ai/tts/route.ts` — novo POST autenticado que valida `text`/`referenceId` com Zod, chama a fish.audio com `FISH_API_KEY`/`FISH_MODEL` e devolve `audio/mpeg`, ou 502 com `upstreamStatus`.
- `apps/web/app/components/organisms/Sidebar.tsx` — largura de 220 para 264px, fundo em gradiente `#161b28 → #11151f` e borda `rgba(255,255,255,0.06)`.
- `apps/web/app/globals.css` — remove o `prefers-color-scheme`, fixa `--background`/`--foreground` escuros e cria `--app-canvas` (2 radiais + 1 linear), aplicado no `body` com `background-attachment: fixed`.
- `apps/web/app/layout.tsx` — `<html lang>` de `en` para `pt-BR`.
- `apps/web/app/lp/cv.ts` — novo: `analyzeCv` (critérios ponderados com evidência, mínimo de 40 palavras), `findings` (os 3 de maior peso) e `extractText` (pdf.js via CDN, parser de `.docx`, `.txt`).
- `apps/web/app/lp/funnel.test.ts` — novo script com `node:assert`, rodado com `npx tsx`, que cobre os derivados do funil, o fluxo de perguntas, a nota do CV e o leitor de `.docx` com um zip montado em memória.
- `apps/web/app/lp/funnel.ts` — novo núcleo do funil: tipos de `Answers`/`FunnelState`/`Screen`, `questionsFor` condicional, derivados puros (horas, taxa de resposta, destino, ritmo e limite diário por plano, `formatDuration` arredondando para cima) e catálogo de `BUMPS`/`OTOS`.
- `apps/web/app/lp/lp.css` — novo CSS com escopo em `.lp`: tokens de cor, carimbo, leader pontilhado, animação de entrada, blur, `prefers-reduced-motion`, print e ocultação do widget Featurebase.
- `apps/web/app/lp/page.tsx` — o placeholder vira server page com fontes Newsreader e IBM Plex, metadata e viewport; lê `?a=`/`?s=` e renderiza o `<Funnel>`.
- `apps/web/app/lp/quiz.tsx` — novo client: máquina de telas com `sessionStorage` + `history`, Hero, `QuestionView` (choice, number, text, cv), Ledger, tela ponte, e carregamento do `report` via `next/dynamic` com preload.
- `apps/web/app/lp/report.tsx` — novo: telas de análise (passos reais com tempo mínimo), gate de contato, laudo, bumps, checkout simulado, OTO/downsell e obrigado (download ou envio do link e lembrete `.ics`).
- `apps/web/app/lp/ui.tsx` — novos primitivos `Btn`, `Kicker`, `Stamp`, `Line`, `Section` e `Title` do funil.
- `apps/web/app/types/job.ts` — `ApplicationHistoryItem` ganha `reason: string | null`.
- `apps/web/backend/modules/job-application/job-application.service.ts` — o histórico seleciona `errorLog` e o expõe como `reason`; o `groupBy` filtra `status in [failed, skipped]`; `classifyErrorLog` reconhece `FIT:` e `ELEGIBILIDADE:` antes das heurísticas.
- `apps/web/proxy.ts` — `/politica-de-privacidade` e `/termos-de-servico` entram nas rotas públicas.
- `apps/web/tailwind.config.js` — adiciona as cores `lp.*` (via CSS vars) e as famílias `lp-serif`/`lp-sans`/`lp-mono`.
- `packages/database/prisma.config.ts` — `datasource.url` troca `env('DATABASE_URL')` (que lança erro) por `process.env.DATABASE_URL`.
- `packages/database/src/index.ts` — `export *` vira `export { Prisma }` + `export type * from '@prisma/client'`.
- `turbo.json` — adiciona `DATABASE_URL`, `CLERK_SECRET_KEY` e `FIT_MIN_SCORE` ao `globalEnv`.

## Pontos de atenção e próximos passos

**Proxy de IA**
- **Custo sem teto.** Qualquer usuário logado consome a chave da plataforma, sem rate limit (está marcado com `ponytail:`) e sem débito de crédito. O proxy só valida `model`; `max_tokens`, `n`, `tools` etc. passam livres. O Apollo, o agente de visão e o fit gate saem todos dessa conta.
- **Allowlist acoplada ao `OPENAI_MODEL`.** Se o `runtime.env` (ou o env local) definir um modelo fora de `{gpt-4o-mini, gpt-4.1-mini}`, o Apollo e o agente recebem 403. O fit gate engole o erro (fail-open), então ele parece ligado mas nunca avalia.
- **Token do engine pode expirar no meio do run.** O engine recebe `APLIQUEFY_WEB_TOKEN` uma única vez, no spawn, e agora toda chamada de LLM depende dele. Falta confirmar a validade e o refresh desse token. Se expirar, o agente falha e o gate desliga em silêncio.
- **Limites da Vercel.** `maxDuration = 60` e o limite de tamanho do body da função precisam ser validados num run real com histórico de screenshots no chat de visão e com áudios longos na transcrição.

**Fit gate**
- **Como o gate é ligado.** `FIT_MIN_SCORE` agora pode vir do `DESKTOP_RUNTIME_ENV`, mas aí vale para todos os usuários do release. Não há setting por campanha nem UI. Falta decidir onde o limiar fica (por exemplo, na config da campanha lida via `/runtime`).
- **Custo do gate.** Descartes não contam no limite diário, que só conta `applied`, então o loop avalia todas as vagas da busca. Além disso, o gate roda antes de `create_application`, então vagas já registradas são reavaliadas pelo LLM em todo run antes de bater no 409. Vale checar se a vaga já existe antes do gate e pôr um teto de avaliações por run.
- **Contrato do evento `skipped`.** O engine emite `jobUrl` e `detail`, mas `apps/desktop/shared/runner-types.ts` só tipa `{ jobApplicationId, reason }`, e o desktop não distingue `low_fit` de `already_applied`.
- **Descrição contaminada.** O fallback para `<main>` no LinkedIn traz "vagas semelhantes" e "sobre a empresa". Os seletores do InfoJobs (`[class*='vacancydetail' i]`, `[class*='job-description' i]`) não foram validados no DOM real. Descrição errada gera veredito errado, e o fail-open não protege contra isso. Mover os seletores para o `selectors.py` de cada plataforma.
- **`record_skip` sem `try`.** Se o PATCH falhar depois do POST, a candidatura fica `pending` e a exceção sobe para o loop do engine.

**`/relatorios`**
- **Coluna "Motivo" com `errorLog` cru.** Para candidaturas `failed`, ela pode expor mensagem técnica ou stack ao usuário. Considerar mostrar só o bucket de `classifyErrorLog`.
- **Acoplamento por string.** Os prefixos `FIT:`/`ELEGIBILIDADE:` estão duplicados entre `fit_gate.py`/`apply_agent.py`, `classifyErrorLog` e a regex de `formatReason`. Renomear de um lado quebra o agrupamento sem aviso.

**Funil `/lp` — não está pronto para tráfego pago**
- O checkout é simulado e não cobra nada; falta o Stripe Checkout com `line_items` do plano + bumps.
- O lead do gate fica só no estado da página; falta um `POST /api/leads`.
- Os preços de bumps e OTOs são provisórios.
- `COST_PER_APPLICATION` está duplicado como constante no cliente.
- O pdf.js é importado de `cdnjs` em runtime e quebra se entrar uma CSP restritiva.
- O `funnel.test.ts` não está em nenhum script ou CI; hoje só roda com `npx tsx` manual.

**Build do desktop**
- `build.icon` e `files` apontam para `resources/icon.png`, mas o diff só adiciona o `icon.svg`. Confirmar que o PNG está versionado ou é gerado.
- `extraResources` exige `build/runtime.env`. Verificar o build local sem esse arquivo e o comportamento do CI com o secret vazio.
- O publish agora vai para `esoos-sysadmin/apliquefy-releases`. O token do CI precisa de acesso a esse repositório, e o auto-update de instalações antigas pode ainda apontar para o owner anterior.

**`.claude/handoff.md`**
- O arquivo está desatualizado: descreve fail-open por `OPENAI_API_KEY` e não cobre o proxy, o `/lp` nem o release. Substituir por este documento.

**`@repo/database`**
- Enums como valor (`Platform`, `TransactionType`…) não saem mais por ali; quem precisar deles em runtime importa de `@prisma/client` ou adiciona o nome ao export.
- Sem `DATABASE_URL`, `migrate`/`db push` falham com um erro menos explícito, porque a URL chega `undefined`.

**Visual**
- O app web ficou só em tema escuro.
- Os 264px estão duplicados em `Sidebar.tsx` e `(frontend)/layout.tsx`.
- `background-attachment: fixed` precisa ser validado no iOS Safari.
- Os cards de `/relatorios` seguem com hex fixo (`#131B2A`/`#1C2333`).

**Testes do robots**
- `test_fit_gate.py` usa `channel="chrome"`, então o CI precisa do Chrome instalado.
- No `_FakeClient`, `self.calls` é atribuído e nunca verificado.
