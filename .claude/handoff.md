# Handoff — develop

> Atualizado em 2026-09-13 19:00 · base `origin/main` · último commit `b58fff8 feat: fitgate para avaliação de curriculo e vaga`

## O que foi alterado

A mudança principal é um **gate de aderência (fit gate)** no engine RPA. Antes, a campanha se candidatava a toda vaga que a busca devolvia, e cada candidatura custava 1 crédito e dezenas de passos do agente de visão. Agora, depois de abrir a vaga e emitir `job_found`, e antes de clicar em "Candidatar", o LinkedIn e o InfoJobs chamam `fit_gate.passes()`. Essa função lê a descrição da página por uma lista de seletores genéricos, com fallback para `<main>`. Aceita no mínimo 200 caracteres e corta em 6.000. Depois faz uma chamada de LLM só com texto (sem screenshot), comparando a descrição com o currículo normalizado, e recebe um `FitVerdict` estruturado (`score` 0–100, `blocker`, `reason`). O prompt separa dois bloqueios eliminatórios da nota:
- **Requisito obrigatório não atendido**: formação, certificação ou conselho, CNH, residência em outro país.
- **Idioma exigido que não aparece em `idioms`**.

Idioma que o candidato tem, mas num nível abaixo do pedido, só reduz a nota. Requisito "desejável" não bloqueia. `should_skip()` descarta a vaga se houver bloqueio ou se `score < FIT_MIN_SCORE`; o limiar é inclusivo. O gate é **fail-open**: se estiver desligado (`FIT_MIN_SCORE=0`, que é o default), sem `OPENAI_API_KEY`, sem descrição legível ou com o LLM falhando, a função retorna `None` e o robô se candidata normalmente.

Uma vaga descartada vai para o histórico pela nova função `record_skip()`. Ela cria a `JobApplication`, faz PATCH para `status=skipped` com `errorLog` prefixado por `FIT:` e emite um evento WebSocket `skipped` com `reason: "low_fit"`. **Não debita crédito**, e usar `skipped` em vez de `failed` evita o fluxo de reembolso. Se o POST devolver 409 (vaga já registrada), a função não faz nada, para não sobrescrever um desfecho anterior. O prompt do agente de candidatura (`_build_task`) também ganhou uma regra para **perguntas abertas** ("fale sobre você", "por que esta vaga"). O agente passa a responder sempre, e só com base no currículo, nesta estrutura: situação atual, depois a evidência mais forte com número, depois a ligação com a vaga. Deve respeitar o limite de caracteres do campo (ou no máximo 3 frases sem limite declarado), escrever no idioma da vaga e evitar clichês como "proativo" ou "aprendo rápido".

Na web, `/relatorios` agora explica por que as vagas não foram enviadas. O backend devolve `reason` (o `errorLog`) em cada item do histórico. O agrupamento de motivos passou a incluir `skipped`, não só `failed`, e `classifyErrorLog` junta os prefixos estáveis `FIT:` em "Baixa aderência à vaga" e `ELEGIBILIDADE:` em "Pergunta sem resposta no currículo". Sem isso, cada frase do LLM virava um bucket com contagem 1. Na UI, o card mudou para "Por que não foram enviadas" com badge neutro (não mais rosa), e a tabela ganhou a coluna **Motivo**, que mostra o texto sem o prefixo, cortado em 2 linhas com tooltip. O mesmo diff inclui ainda a mudança visual do commit anterior: fundo único em `body` com o `--app-canvas` em gradiente e `background-attachment: fixed`, remoção de `bg-[#0B111A]` dos layouts e páginas, app só em tema escuro (sem `prefers-color-scheme`) e Sidebar com gradiente e largura de 264px.

## Arquivos modificados

- `.claude/handoff.md` — o handoff anterior (billing/créditos da `feat/login-desktop-session`) foi substituído por um que descreve só a mudança visual do fundo/Sidebar. Ele não cobre o fit gate e ficou desatualizado em relação a este diff.
- `apps/robots/src/rpa_engine/config.py` — novo campo `fit_min_score` em `Settings`, lido de `FIT_MIN_SCORE`, limitado a 0–100 e com default 0 (gate desligado).
- `apps/robots/src/rpa_engine/runtime/fit_gate.py` — novo módulo com `FitVerdict` (pydantic), prompt de sistema `_SYSTEM`, `_read_description` (seletores com fallback para `main`, faixa de 200 a 6.000 caracteres), `passes` (chamada fail-open ao `ChatOpenAI` do browser_use com `output_format`), `should_skip` e `skip_reason` (prefixo `FIT_MARKER = "FIT:"`, que prefere o `blocker` à nota).
- `apps/robots/src/rpa_engine/runtime/apply_agent.py` — nova `record_skip()` (cria a candidatura, faz PATCH `skipped` + `error_log`, emite `skipped`/`low_fit`, não faz nada em caso de 409) e regra de "Pergunta ABERTA" no `_build_task`, cobrindo estrutura, aterramento no currículo, limite de caracteres, lista de adjetivos proibidos e idioma.
- `apps/robots/src/rpa_engine/engines/linkedin/engine.py` — importa `fit_gate`/`record_skip` e roda o gate entre `job_found` e o clique em `APPLY_BUTTON`; vaga reprovada chama `record_skip` e faz `continue`.
- `apps/robots/src/rpa_engine/engines/infojobs/engine.py` — mesmo gate antes do clique em "Candidatar"; o título passou a ser normalizado uma única vez em `title` (antes o `strip()` se repetia no evento e no `execute_apply`).
- `apps/robots/tests/test_apply_agent.py` — teste do prompt de pergunta aberta (inclusive que a regra aparece depois da de ELEGIBILIDADE) e dois testes de `record_skip` com um `_FakeClient`: grava `skipped` sem débito e não sobrescreve em caso de 409.
- `apps/robots/tests/test_fit_gate.py` — novo: testes de `should_skip` (bloqueio, limiar inclusivo, `None` nunca bloqueia), `skip_reason` (prefixo, nunca vazio), invariantes do `_SYSTEM`, gate desligado sem tocar na página e `_read_description` com Playwright (container, fallback para `main`, página curta).
- `apps/web/backend/modules/job-application/job-application.service.ts` — o histórico passa a selecionar `errorLog` e expõe `reason`; o `groupBy` de motivos filtra `status in [failed, skipped]`; `classifyErrorLog` reconhece os prefixos `FIT:` e `ELEGIBILIDADE:`.
- `apps/web/app/types/job.ts` — `ApplicationHistoryItem` ganhou `reason: string | null`.
- `apps/web/app/(frontend)/relatorios/page.tsx` — novo `formatReason` (tira os prefixos `FIT:`/`ELEGIBILIDADE:`), card de motivos com novo título, subtítulo e badge `slate`, coluna "Motivo" na tabela (`colSpan` 6 → 7, `min-w` 640 → 820px).
- `apps/web/app/globals.css` — `--background`/`--foreground` fixos em tema escuro, sem o `@media (prefers-color-scheme: dark)`; nova variável `--app-canvas` (2 radiais + 1 linear) aplicada no `body` com `background-attachment: fixed`.
- `apps/web/app/components/organisms/Sidebar.tsx` — largura 220 → 264px, fundo `linear-gradient(180deg, #161b28, #11151f)` e borda `rgba(255,255,255,0.06)`.
- `apps/web/app/(frontend)/layout.tsx` — wrapper com `background: transparent` e `marginLeft` do `<main>` 220 → 264px.
- `apps/web/app/(landing)/layout.tsx` — wrapper com `background: transparent`.
- `apps/web/app/(auth)/layout.tsx` — removido `bg-[#0B111A]` do `<main>`.
- `apps/web/app/(landing)/planos/page.tsx` — removido `bg-[#0B111A]`.
- `apps/web/app/(landing)/obrigado/page.tsx` — removido `bg-[#0B111A]`.
- `apps/web/app/(landing)/termos-de-servico/page.tsx` — removido `bg-[#0B111A]`.
- `apps/web/app/(landing)/politica-de-privacidade/page.tsx` — removido `bg-[#0B111A]`.
- `turbo.json` — `FIT_MIN_SCORE` adicionado ao `globalEnv`.

## Pontos de atenção e próximos passos

- **Em produção, o gate não liga.** `FIT_MIN_SCORE` só chega ao engine se estiver no ambiente do processo Electron: `rpa-process-service` repassa `...process.env`, mas não há setting nem UI. Com o default 0, o gate fica desligado para todo usuário. Falta decidir onde o limiar vive (config da campanha na web, lida via `/runtime`, ou setting do desktop) e levar isso até o `Settings`.
- **Contrato do evento `skipped` divergente.** O engine emite `jobUrl` e `detail`, mas `runner-types.ts` só tipa `{ jobApplicationId, reason }`, e o `LivePreview` mostra apenas "Vaga pulada". Os motivos `low_fit` e `already_applied` não aparecem de forma diferente no desktop.
- **O fallback para `<main>` pode avaliar o texto errado.** No LinkedIn, `main` inclui a lista de vagas do painel esquerdo. No InfoJobs, os seletores (`[class*='vacancydetail' i]`, `[class*='job-description' i]`) são genéricos e não foram validados no DOM real. Uma descrição contaminada gera veredito ruim, e o fail-open não protege contra isso. Vale conferir com runs reais e fixar seletores específicos em `selectors.py`.
- **Custo de LLM fora do sistema de créditos.** Cada vaga avaliada é uma chamada ao OpenAI que não é debitada do usuário. Descartes não consomem candidatura: se o gate não conta para o limite diário, um limiar alto pode percorrer muitas vagas e fazer muitas chamadas no mesmo run. Confirmar em `daily_limit` e considerar um teto de avaliações por run.
- **`record_skip` não é tolerante a falha.** Se o PATCH falhar depois do POST, a candidatura fica `pending`, e uma exceção ali sobe para o loop do engine. Não há `try` como em `passes`.
- **A coluna "Motivo" mostra o `errorLog` cru de candidaturas `failed`.** Isso pode expor mensagens técnicas ou de crash do agente ao usuário final. Considerar mostrar só o bucket de `classifyErrorLog` para `failed` e o texto completo apenas para `FIT:`/`ELEGIBILIDADE:`.
- **Acoplamento por string entre robots e web.** Os prefixos `FIT:`/`ELEGIBILIDADE:` estão duplicados em `fit_gate.py`/`apply_agent.py`, `classifyErrorLog` e na regex de `formatReason`. Renomear de um lado quebra o agrupamento sem nenhum aviso.
- **Nota única em vez de dimensões** é uma simplificação deliberada (comentário `ponytail:` no módulo). Separar as dimensões quando a nota detalhada aparecer na UI.
- **Testes dependem do Chrome real.** `test_fit_gate.py` usa `channel="chrome"`, então o CI precisa ter o Chrome instalado. No `_FakeClient`, `self.calls` é atribuído e nunca verificado.
- **`.claude/handoff.md` desatualizado.** O arquivo no diff descreve só a mudança visual; substitua-o por este documento.
- **Pendências herdadas da mudança visual.** Validar `background-attachment: fixed` no iOS Safari. A largura de 264px da Sidebar está duplicada em `Sidebar.tsx` e `(frontend)/layout.tsx`. O app ficou só em tema escuro. Ainda pode haver `#0B111A` hardcoded em outros pontos (os cards de `/relatorios` continuam com `#131B2A`/`#1C2333`).
