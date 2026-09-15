# Handoff — develop

> Atualizado em 2026-09-14 22:35 · base `origin/main` · último commit `3f233d1 fix: atualização do prisma`

## O que foi alterado

A mudança principal é um **gate de aderência (fit gate)** no engine RPA. Antes, a campanha se candidatava a toda vaga que a busca devolvia, e cada candidatura custava 1 crédito e dezenas de passos do agente de visão. Agora o gate roda no LinkedIn e no InfoJobs, logo depois do evento `job_found` e antes do clique em "Candidatar". Ele chama `fit_gate.passes()`, que lê a descrição da vaga por uma lista de seletores genéricos, com fallback para `<main>`. O texto é aceito com no mínimo 200 caracteres e cortado em 6.000. Em seguida vai numa chamada de LLM só com texto (sem screenshot), junto com o currículo normalizado. A resposta volta como um `FitVerdict` estruturado com três campos: `score` (0–100), `blocker` e `reason`. O prompt trata dois casos como eliminação, não como nota: requisito obrigatório não atendido (formação, certificação ou conselho, CNH, residência em outro país) e idioma exigido que não aparece em `idioms`. Idioma que o candidato tem, mas num nível abaixo do pedido, só reduz a nota. Requisito "desejável" não bloqueia. `should_skip()` descarta a vaga se houver `blocker` ou se `score < FIT_MIN_SCORE`, e o limiar é inclusivo. O gate é **fail-open**: devolve `None` e o robô se candidata normalmente em quatro casos:
- o gate está desligado (`FIT_MIN_SCORE=0`, que é o default);
- não há `OPENAI_API_KEY`;
- não há descrição legível;
- a chamada ao LLM falha.

Uma vaga descartada vai para o histórico pela nova função `record_skip()`, e **nenhum crédito é debitado**. A função cria a `JobApplication`, faz PATCH com `status=skipped` e um `errorLog` prefixado por `FIT:`, e emite um evento WebSocket `skipped` com `reason: "low_fit"` e o texto em `detail`. O status `skipped`, e não `failed`, mantém a vaga fora do fluxo de reembolso. Se o POST devolver 409 (vaga já registrada), a função não faz nada, para não sobrescrever um desfecho anterior. O prompt do agente de candidatura (`_build_task`) ganhou uma regra para **perguntas abertas** ("fale sobre você", "por que esta vaga"). O agente deve sempre responder, usando só o que está no currículo, nesta ordem: situação atual, depois a evidência mais forte com número, depois a ligação com a vaga. Deve ficar abaixo do limite de caracteres do campo (ou em no máximo 3 frases, se não houver limite), escrever no idioma da vaga e evitar clichês ("proativo", "aprendo rápido").

Na web, `/relatorios` passou a explicar por que as vagas não foram enviadas:
- o histórico devolve `reason` (o `errorLog`) em cada item;
- o agrupamento de motivos passou a incluir `skipped` além de `failed`;
- `classifyErrorLog` junta os prefixos estáveis `FIT:` em "Baixa aderência à vaga" e `ELEGIBILIDADE:` em "Pergunta sem resposta no currículo", evitando um bucket por frase do LLM;
- o card virou "Por que não foram enviadas", com badge neutro;
- a tabela ganhou a coluna **Motivo**, que mostra o texto sem o prefixo.

O diff traz ainda:
- **Mudança visual:** fundo único no `body` via `--app-canvas` (gradiente com `background-attachment: fixed`); remoção de `bg-[#0B111A]` dos layouts e páginas; app só em tema escuro; Sidebar com gradiente e 264px.
- **Ajuste no `@repo/database`:** `prisma.config.ts` usa `process.env.DATABASE_URL`, para que `prisma generate` rode sem a variável no build da Vercel. O `index.ts` troca `export *` por `export { Prisma }` + `export type *`, eliminando o warning de CJS no Turbopack. `DATABASE_URL` e `CLERK_SECRET_KEY` entraram no `globalEnv` do Turbo.

## Arquivos modificados

- `.claude/handoff.md` — o handoff anterior (billing/créditos da `feat/login-desktop-session`) foi substituído por um que descreve o fit gate. O cabeçalho aponta para o commit `b58fff8` e não cobre as mudanças de Prisma/Turbo do `3f233d1`.
- `apps/robots/src/rpa_engine/config.py` — novo campo `fit_min_score` em `Settings`, lido de `FIT_MIN_SCORE`, limitado a 0–100, com default 0 (gate desligado).
- `apps/robots/src/rpa_engine/runtime/fit_gate.py` — novo módulo com:
  - `FitVerdict` (pydantic, propriedade `blocked`);
  - o prompt `_SYSTEM`;
  - `_read_description` (seletores com fallback para `main`, faixa de 200 a 6.000 caracteres);
  - `passes` (chamada fail-open ao `ChatOpenAI` do browser_use com `output_format`);
  - `should_skip`;
  - `skip_reason` (prefixo `FIT_MARKER = "FIT:"`, prioriza o `blocker` sobre a nota).
- `apps/robots/src/rpa_engine/runtime/apply_agent.py` — nova `record_skip()` (POST da candidatura, PATCH `skipped` + `error_log`, evento `skipped`/`low_fit`, não faz nada em caso de 409). A regra de "Pergunta ABERTA" entrou no `_build_task`: estrutura, uso só do currículo, limite de caracteres, adjetivos proibidos e idioma.
- `apps/robots/src/rpa_engine/engines/linkedin/engine.py` — importa `fit_gate`/`record_skip` e roda o gate entre `job_found` e o clique em `APPLY_BUTTON`. Vaga reprovada chama `record_skip` e faz `continue`.
- `apps/robots/src/rpa_engine/engines/infojobs/engine.py` — mesmo gate antes do clique em "Candidatar". O título agora é normalizado uma única vez em `title`, em vez de repetir o `strip()` no evento e no `execute_apply`.
- `apps/robots/tests/test_apply_agent.py` — teste do prompt de pergunta aberta, incluindo a checagem de que a regra vem depois da de ELEGIBILIDADE, e dois testes de `record_skip` com `_FakeClient`: grava `skipped` sem debitar e não sobrescreve em caso de 409.
- `apps/robots/tests/test_fit_gate.py` — novo, com testes de:
  - `should_skip`: bloqueio, limiar inclusivo, `None` nunca bloqueia;
  - `skip_reason`: prefixo presente, motivo nunca vazio;
  - invariantes do `_SYSTEM`;
  - gate desligado sem tocar na página;
  - `_read_description` com Playwright: container, fallback para `main`, página curta.
- `apps/web/backend/modules/job-application/job-application.service.ts` — o histórico passa a selecionar `errorLog` e expô-lo como `reason`. O `groupBy` de motivos filtra `status in [failed, skipped]`, e `classifyErrorLog` reconhece os prefixos `FIT:` e `ELEGIBILIDADE:` antes das heurísticas.
- `apps/web/app/types/job.ts` — `ApplicationHistoryItem` ganhou `reason: string | null`.
- `apps/web/app/(frontend)/relatorios/page.tsx` — novo `formatReason` (tira os prefixos `FIT:`/`ELEGIBILIDADE:`); card de motivos com novo título, subtítulo e badge `slate`; coluna "Motivo" com `line-clamp-2` + `title` (`colSpan` 6 → 7, `min-w` 640 → 820px).
- `apps/web/app/globals.css` — `--background`/`--foreground` fixos no tema escuro, sem o `@media (prefers-color-scheme: dark)`. Nova variável `--app-canvas` (2 radiais + 1 linear) aplicada no `body` com `background-attachment: fixed`.
- `apps/web/app/components/organisms/Sidebar.tsx` — largura 220 → 264px, fundo `linear-gradient(180deg, #161b28, #11151f)` e borda `rgba(255,255,255,0.06)`.
- `apps/web/app/(frontend)/layout.tsx` — wrapper com `background: transparent` e `marginLeft` do `<main>` 220 → 264px.
- `apps/web/app/(landing)/layout.tsx` — wrapper com `background: transparent`.
- `apps/web/app/(auth)/layout.tsx` — removido `bg-[#0B111A]` do `<main>`.
- `apps/web/app/(landing)/planos/page.tsx` — removido `bg-[#0B111A]`.
- `apps/web/app/(landing)/obrigado/page.tsx` — removido `bg-[#0B111A]`.
- `apps/web/app/(landing)/termos-de-servico/page.tsx` — removido `bg-[#0B111A]`.
- `apps/web/app/(landing)/politica-de-privacidade/page.tsx` — removido `bg-[#0B111A]`.
- `packages/database/prisma.config.ts` — `datasource.url` troca `env('DATABASE_URL')` (lança erro se a variável faltar) por `process.env.DATABASE_URL`, e o import de `env` foi removido.
- `packages/database/src/index.ts` — `export * from '@prisma/client'` foi trocado por `export { Prisma }` (valor) + `export type * from '@prisma/client'` (só tipos).
- `turbo.json` — `DATABASE_URL`, `CLERK_SECRET_KEY` e `FIT_MIN_SCORE` adicionados ao `globalEnv`.

## Pontos de atenção e próximos passos

- **Em produção, o gate nunca liga.** `FIT_MIN_SCORE` só chega ao engine se estiver no ambiente do processo Electron: `rpa-process-service` repassa `...process.env`, mas não há setting nem UI para isso. Com o default 0, o gate fica desligado para todo usuário. Falta decidir onde o limiar fica (config da campanha lida via `/runtime`, ou setting do desktop) e levá-lo até o `Settings`.
- **Custo de LLM sem teto e fora dos créditos.** O limite diário (`countTodayByCampaign`) conta só `status: "applied"`, então descartes não consomem o limite. Com limiar alto, o loop avalia todas as vagas da busca, e cada uma é uma chamada à OpenAI que não é debitada do usuário. Além disso, o gate roda **antes** de `create_application`, então uma vaga já registrada (inclusive uma já descartada) é reavaliada pelo LLM em todo run antes de bater no 409. Vale checar se a vaga já existe antes do gate e colocar um teto de avaliações por run.
- **Contrato do evento `skipped` divergente.** O engine emite `jobUrl` e `detail`, mas `runner-types.ts:123` só tipa `{ jobApplicationId, reason }`, e o desktop não diferencia `low_fit` de `already_applied`.
- **A descrição pode vir contaminada.** O fallback para `<main>` inclui "vagas semelhantes" e "sobre a empresa" no LinkedIn. No InfoJobs, os seletores `[class*='vacancydetail' i]` e `[class*='job-description' i]` não foram validados no DOM real. Uma descrição errada gera veredito errado, e o fail-open não protege contra isso. Conferir em runs reais e mover os seletores para `selectors.py` de cada plataforma.
- **`record_skip` não tem `try` próprio.** Se o PATCH falhar depois do POST, a candidatura fica `pending` e a exceção sobe para o tratamento do loop do engine.
- **A coluna "Motivo" mostra o `errorLog` cru de candidaturas `failed`.** Isso pode expor stack ou mensagem técnica ao usuário final. Considerar mostrar só o bucket de `classifyErrorLog` para `failed`.
- **Acoplamento por string entre robots e web.** Os prefixos `FIT:`/`ELEGIBILIDADE:` estão duplicados em `fit_gate.py`/`apply_agent.py`, em `classifyErrorLog` e na regex de `formatReason`. Renomear de um lado quebra o agrupamento sem nenhum aviso.
- **`@repo/database` não exporta mais valores além de `Prisma` e `prisma`.** Hoje nenhum consumidor importa enums como valor por ali (conferido). Mas código novo que precise de `Platform`, `TransactionType` etc. em runtime vai ter que importar de `@prisma/client` ou adicionar o nome ao export nomeado.
- **`DATABASE_URL` ausente não falha mais no load do config.** O erro de `migrate`/`db push` fica menos explícito, porque a URL chega `undefined`.
- **Nota única em vez de dimensões** é uma simplificação deliberada (comentário `ponytail:` no módulo). Separar quando a nota por dimensão aparecer na UI.
- **Testes dependem do Chrome real.** `test_fit_gate.py` usa `channel="chrome"`, então o CI precisa do Chrome instalado. No `_FakeClient`, `self.calls` é atribuído e nunca verificado.
- **`.claude/handoff.md` está desatualizado.** O cabeçalho aponta para `b58fff8` e o arquivo diz de si mesmo que "descreve só a mudança visual". Substituir por este documento.
- **Pendências da mudança visual:**
  - validar `background-attachment: fixed` no iOS Safari;
  - a largura de 264px está duplicada em `Sidebar.tsx` e `(frontend)/layout.tsx`;
  - o app ficou só em tema escuro;
  - os cards de `/relatorios` ainda têm cores fixas (`#131B2A`/`#1C2333`).
