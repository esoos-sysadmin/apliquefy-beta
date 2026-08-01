# SDD — Observabilidade e Error Tracking (Sentry)

**Projeto:** Apliquefy
**Documento:** Software Design Document — Módulo de Observabilidade
**Versão:** 1.1 — revisada contra o repositório (`dev` @ `b7b311c`)
**Responsável:** Luiz Lima
**Escopo:** `apps/robots` (engine Python), `apps/desktop` (Electron) e `apps/web` (Next.js)

---

## 0. O que mudou da v1.0 para a v1.1

A v1.0 foi escrita sobre um modelo mental em que a automação era TypeScript rodando dentro do processo main do Electron. Não é. A automação é **Python** (`apps/robots`), num processo filho que o Electron apenas gerencia. Isso desloca o núcleo do desenho.

| # | Seção v1.0 | Problema | Resolução na v1.1 |
|---|---|---|---|
| 1 | §5.4, §5.5 | Instrumentavam `runApplication` em TS, que não existe | Movido para §6 — instrumentação em `sentry-sdk` Python, nos pontos reais de captura |
| 2 | ADR-03 | `packages/observability` em TS cobriria os dois apps | Reescrito: o scrubbing crítico é Python; o pacote TS não alcança o código de maior risco |
| 3 | — | Faltava ADR sobre onde o engine Python reporta | Novo **ADR-05** — mesmo projeto `apliquefy-runner`, separado por tag `surface` |
| 4 | §5.5 | `SelectorNotFoundError` genérico com `selectorKey` | `selectorKey` só existe na parte mecânica (`selectors.py`); o apply cognitivo não tem seletor. Fingerprint dividido em dois regimes |
| 5 | §7 | Não previa vazamento por integração automática | **Achado crítico**: `include_local_variables=True` (default do sentry-sdk) enviaria o currículo inteiro. Ver §7.2 |
| 6 | §4, §5.1, §9.3 | pnpm, `@apliquefy/desktop`, `src/main/`, `electron.vite.config.ts` | Corrigidos: npm workspaces, pacote `desktop`, `electron/`, `vite.config.ts` |
| 7 | §6 | `sentry.edge.config.ts`, `next.config.ts` | Não há `middleware.ts` (Next 16 usa `proxy.ts`); `next.config.js` é ESM `.js` |
| 8 | §9.1 | Cache do Turbo pulando upload de source map | O desktop **não** builda via Turbo (`npm run release` direto no workspace). O risco existe só no web |
| 9 | §11 | Fase 1 = Electron main | Reordenado: o engine Python é a Fase 1, porque é onde estão as falhas |
| 10 | §14 | Critérios sobre `SelectorNotFoundError` em TS | Reescritos contra os pontos de captura reais |

O restante do documento — ADR-01, ADR-02, ADR-04, a política de screenshot, a taxonomia de tags e a lista de fora-de-escopo — permanece válido e foi mantido.

---

## 1. Objetivo

Definir **como** o error tracking será implementado no Apliquefy: componentes, contratos, configuração por runtime, política de privacidade de dados e plano de rollout.

Este documento cobre **captura e agrupamento de erros** e **release health**. Não cobre APM/tracing distribuído, session replay ou profiling — deliberadamente fora de escopo (ver §13).

### 1.1 Problema

A arquitetura do Apliquefy tem um ponto cego estrutural: a automação roda na máquina do usuário final, em três processos que a Vercel não enxerga — Electron main, renderer React e **o engine Python**, que é onde de fato as falhas acontecem: quebra de seletor DOM do LinkedIn/InfoJobs, sessão expirada, timeout de navegação, crash do agente browser-use.

Pior que não enxergar: hoje boa parte dessas falhas **não deixa rastro nenhum**. Dois exemplos do código atual:

- [engines/linkedin/engine.py:83-85](../apps/robots/src/rpa_engine/engines/linkedin/engine.py#L83-L85) — se o `JOB_CARD` deixar de casar, o timeout vira um `logger.warning` e o run segue com a lista vazia. O usuário vê "0 candidaturas" e o time não vê nada.
- [engines/linkedin/engine.py:166-168](../apps/robots/src/rpa_engine/engines/linkedin/engine.py#L166-L168) — se o `APPLY_BUTTON` mudar, **toda** vaga cai no `except PlaywrightTimeout: continue`. O run termina normalmente, com zero erros e zero candidaturas.

Ou seja: o cenário exato que o error tracking existe para pegar é justamente o que hoje é silencioso. O mecanismo de e-mail descrito no fluxograma do Runner (`Registrar Erro e Print` → e-mail para o time) não escala e, no caso acima, sequer dispara:

| Limitação do e-mail | Impacto operacional |
|---|---|
| Não agrupa nem deduplica | 1 mudança de seletor = N e-mails, sendo N o número de usuários ativos |
| Sem versionamento por release | Impossível saber se um erro é regressão da versão nova |
| Sem contagem de usuários afetados | Impossível priorizar |
| Sem contexto estruturado | Sem SO, versão do app, passo da automação, campanha |
| Print anexado sem tratamento | **Risco de LGPD** — screenshot de página logada contém PII |
| Só dispara em erro tratado | Falha engolida por `continue` não gera e-mail nenhum |

### 1.2 Objetivos mensuráveis

| ID | Objetivo | Métrica de sucesso |
|---|---|---|
| OBJ-1 | Detectar quebra de seletor antes do suporte | Alerta em < 15 min do 1º evento em produção |
| OBJ-2 | Agrupar falhas idênticas | 1 issue por causa-raiz, independente do nº de usuários |
| OBJ-3 | Medir estabilidade do Runner | Crash-free session rate por release |
| OBJ-4 | Zero PII sensível no provedor | Auditoria de payload sem currículo, cookie ou credencial |
| OBJ-5 | Custo previsível | Ficar dentro da cota do plano contratado com margem ≥ 30% |
| OBJ-6 | Tornar visível o run "silenciosamente vazio" | Run que colete 0 vagas ou aplique em 0/N gera evento |

---

## 2. Decisões de arquitetura

### ADR-01 — Sentry SaaS, não self-hosted

**Decisão:** usar `sentry.io` (SaaS).

**Justificativa:** o self-host exige Kafka, ClickHouse, Postgres, Redis e Symbolicator — custo operacional incompatível com o time atual. O SaaS elimina infraestrutura própria e o SDK é idêntico.

**Saída de emergência:** os SDKs são compatíveis com **GlitchTip**. Migrar = trocar o DSN. Isso mantém o lock-in baixo e é o plano B caso a cota fique cara ou surja exigência de soberania de dados.

### ADR-02 — Dois projetos Sentry separados

**Decisão:** criar `apliquefy-web` e `apliquefy-runner` como projetos distintos.

**Justificativa:**
- Ciclos de release independentes (web = contínuo; Electron = versionado e instalado)
- Volumes de evento muito diferentes → cotas e sampling separados
- Regras de alerta diferentes (crash-free rate só faz sentido no Runner)
- Um flood no Runner não pode cegar a visibilidade do Web

### ADR-03 — `packages/observability` cobre só o lado TypeScript *(revisado)*

**Decisão v1.0:** criar `packages/observability` com scrubbing e taxonomia compartilhados entre os dois apps.

**Problema:** o pacote é TypeScript e os três consumidores não são homogêneos. O código que manipula os dados sensíveis — currículo serializado no prompt, `storageState` com cookie do LinkedIn, screenshot da página logada — está em **Python** (`apps/robots`), fora do alcance de um pacote TS. Na prática, a v1.0 aplicava a proteção mais forte exatamente na superfície de menor risco.

**Decisão v1.1:**

- `packages/observability` **é criado**, como `@repo/observability` (convenção do repo, igual a `@repo/database` e `@repo/ui`), e cobre Electron main + renderer + web.
- O scrubbing do engine vive em `apps/robots/src/rpa_engine/observability.py`. **Não é compartilhado — é diferente por natureza**, porque os payloads são diferentes (§7.2).
- A **taxonomia** (nomes de `automation_step`, valores de `surface`) é duplicada nos dois lados. São ~15 constantes de string. Um teste em cada lado compara contra um `taxonomy.json` na raiz do pacote e falha se divergirem.

> `ponytail`: duplicar 15 strings com um teste de paridade custa menos que qualquer mecanismo de geração de código entre npm e uv. Se a taxonomia crescer para dezenas de campos com estrutura, aí sim gerar o Python a partir do TS no build.

### ADR-04 — Sentry captura o inesperado; Postgres registra o esperado

**Decisão:** falhas de negócio previstas **não** vão para o Sentry.

| Situação | Onde está no código | Destino |
|---|---|---|
| Sessão do LinkedIn expirou | `RuntimeError("LinkedIn session invalid")` — [engine.py:66](../apps/robots/src/rpa_engine/engines/linkedin/engine.py#L66) | `campaigns.status = paused` + notificação |
| Crédito insuficiente | API web | Bloqueio + resposta ao usuário |
| Vaga já aplicada anteriormente | `Outcome.SKIP_DEAD_SCREEN` — [apply_agent.py:217-220](../apps/robots/src/rpa_engine/runtime/apply_agent.py#L217-L220) | `job_applications.status = skipped` |
| Agente desistiu por pergunta de elegibilidade | `Outcome.SKIP_UNANSWERABLE` (marcador `ELEGIBILIDADE:`) | `job_applications.status = skipped` |
| Agente não concluiu dentro do `max_steps` | `Outcome.PAUSE_RETRY` com `error_log` | `job_applications.error_log` |
| Limite diário atingido | `remaining_for_campaign() <= 0` | evento `paused` no WS |
| Vaga sem Easy Apply | `PlaywrightTimeout` no `APPLY_BUTTON`, **caso isolado** | `continue` (comportamento atual) |
| **Nenhuma vaga coletada na busca** | [engine.py:83](../apps/robots/src/rpa_engine/engines/linkedin/engine.py#L83) | **Sentry** |
| **Todas as vagas do run falharam no mesmo ponto** | agregado em `_iterate_jobs` | **Sentry** |
| **Seletor mecânico ausente** | `page.fill`/`page.click` sem guarda | **Sentry** |
| **Crash do agente browser-use** | [apply_agent.py:263](../apps/robots/src/rpa_engine/runtime/apply_agent.py#L263) | **Sentry** |
| **Exceção não tratada no run** | [orchestrator.py:134](../apps/robots/src/rpa_engine/runtime/orchestrator.py#L134) | **Sentry** |
| **Crash do processo / main / renderer** | Electron | **Sentry** |

**Justificativa:** este é o item mais importante do documento. Mandar falha esperada para o Sentry destrói o sinal, estoura a cota e treina o time a ignorar alerta. O banco já modela o ciclo de vida da candidatura (`job_applications.status` + `error_log`) — é lá que ele vive.

**Nota sobre a linha "vaga sem Easy Apply":** ela é esperada **por vaga** e inesperada **por run**. Uma vaga cair no `continue` é rotina; 40 de 40 caírem é quebra de seletor. Daí o agregado da linha seguinte, detalhado em §6.4.

### ADR-05 — O engine Python reporta no projeto do Runner, separado por tag *(novo)*

**Decisão:** o engine Python usa o **mesmo projeto** `apliquefy-runner` e o mesmo DSN do Electron, distinguido pela tag `surface: runner_engine`.

**Alternativa descartada:** um terceiro projeto `apliquefy-engine`.

**Justificativa:**
- O engine é empacotado **dentro** do instalador do Runner (`extraResources`) e sobe e desce junto com ele. Não tem ciclo de release próprio: a versão dele *é* a versão do desktop.
- Correlacionar "crash do engine" com "versão do Runner que o spawnou" é a consulta que o suporte mais vai fazer. Num projeto só, é um filtro; em dois, é um join manual.
- Um terceiro projeto significaria uma terceira cota, um terceiro conjunto de alertas e um terceiro DSN para propagar por `buildEnv`.
- O DSN já chega de graça: [`buildEnv`](../apps/desktop/electron/services/rpa-process-service.ts#L67-L77) faz spread de `process.env` no filho.

**Consequência:** release health (§6.6) é emitido **só** pelo Electron. O SDK Python roda com session tracking desligado, senão cada run de campanha viraria uma "sessão" e o crash-free rate perderia o sentido.

---

## 3. Visão geral da solução

```
┌──────────────────────────────────────────────────────────────┐
│ Máquina do Usuário                                           │
│                                                              │
│  ┌────────────────┐  IPC   ┌──────────────────┐              │
│  │ Electron main  │◄──────►│ Renderer (React) │              │
│  │ @sentry/       │        │ @sentry/         │              │
│  │  electron/main │        │  electron/render │              │
│  └───────┬────────┘        └──────────────────┘              │
│          │ spawn + env (DSN, release, user_id)               │
│          ▼                                                   │
│  ┌────────────────────────────────────────────┐              │
│  │ Engine RPA — Python (apps/robots)          │              │
│  │ sentry-sdk    surface: runner_engine       │              │
│  │  Orchestrator → Engine mecânico            │              │
│  │       → browser-use Agent (CDP)            │  ◄── AQUI    │
│  └────────────────────────────────────────────┘   estão as   │
│          │ fila offline em disco                   falhas    │
└──────────┼───────────────────────────────────────────────────┘
           │ HTTPS (envelope)
           ▼
    ╔══════════════════╗        ┌──────────────────────┐
    ║ Ingest Sentry    ║◄───────┤ Next.js 16           │
    ║                  ║        │ @sentry/nextjs       │
    ║ ┌──────────────┐ ║        │ server │ client      │
    ║ │apliquefy-    │ ║        └──────────────────────┘
    ║ │  runner      │ ║
    ║ │ ├ main       │ ║
    ║ │ ├ renderer   │ ║
    ║ │ └ engine     │ ║
    ║ ├──────────────┤ ║
    ║ │apliquefy-web │ ║
    ║ └──────────────┘ ║
    ╚════════┬═════════╝
             ├──► Agrupamento por fingerprint
             ├──► Release health / regressões
             └──► Alertas (Slack / e-mail)
```

**Fluxo de um evento:**
1. Exceção escapa → SDK captura via handler global (`sys.excepthook`, `uncaughtException`, `window.onerror`, Crashpad)
2. SDK monta o envelope: stack trace + breadcrumbs + contexto do dispositivo + tags injetadas
3. `before_send` / `beforeSend` executa o scrubbing local (**última barreira antes de sair da máquina**)
4. Transporte envia; se offline, persiste em disco e reenvia depois
5. Ingest aplica scrubbing server-side (2ª camada), calcula fingerprint, agrupa no issue
6. Regra de alerta dispara se as condições baterem

---

## 4. Estrutura no monorepo

Caminhos conferidos contra a árvore real (npm workspaces, não pnpm).

```
apliquefy/
├── apps/
│   ├── web/
│   │   ├── instrumentation.ts            # register() + onRequestError
│   │   ├── instrumentation-client.ts     # init do browser
│   │   ├── sentry.server.config.ts
│   │   ├── next.config.js                # ESM .js — withSentryConfig
│   │   └── app/global-error.tsx          # a criar
│   │
│   ├── desktop/
│   │   ├── electron/observability.ts     # init do main
│   │   ├── electron/main.ts              # importa como 1ª linha
│   │   ├── src/observability.ts          # init do renderer
│   │   ├── src/main.tsx                  # importa como 1ª linha
│   │   ├── vite.config.ts                # build.sourcemap: 'hidden'
│   │   └── tsconfig.json                 # "sourceMap": true
│   │
│   └── robots/
│       ├── pyproject.toml                # + sentry-sdk
│       ├── build.spec                    # + sentry_sdk nos hiddenimports
│       └── src/rpa_engine/
│           ├── observability.py          # init, scrubbing, fingerprint
│           ├── __main__.py               # init antes do load_settings()
│           ├── runtime/orchestrator.py   # captura do run
│           ├── runtime/apply_agent.py    # captura do agente
│           └── engines/*/engine.py       # captura de seletor
│
├── packages/
│   └── observability/                    # @repo/observability — ADR-03
│       ├── taxonomy.json                 # fonte da paridade TS↔Python
│       ├── src/
│       │   ├── scrubbing.ts
│       │   ├── taxonomy.ts
│       │   └── taxonomy.test.ts          # paridade contra o JSON
│       └── package.json
│
└── turbo.json
```

### 4.1 Taxonomia — contrato compartilhado

`packages/observability/taxonomy.json` é a fonte; TS e Python leem/espelham.

```jsonc
{
  "automationStep": [
    "session_check",   // _ensure_logged_in
    "job_search",      // _goto_jobs_search / _fill_search + _submit_search
    "job_filters",     // _apply_filters / _apply_listing_filters
    "job_iteration",   // _iterate_jobs
    "apply_open",      // click APPLY_BUTTON + wait APPLY_MODAL
    "resume_attach",   // _attach_resume
    "apply_agent",     // browser-use Agent.run
    "debit"            // client.debit_flat
  ],
  "surface": ["web", "runner_main", "runner_renderer", "runner_engine"],
  "platform": ["linkedin", "infojobs"]
}
```

Os passos espelham as funções reais dos engines, não o fluxograma idealizado. `question_parse`, `llm_call`, `form_fill` e `submit` da v1.0 **não existem mais** como etapas separadas: desde a migração para browser-use eles acontecem dentro de um único `agent.run()`, sem fronteira observável do lado do engine. Colapsaram em `apply_agent`.

---

## 5. Design — `apps/desktop` (Electron)

### 5.1 Dependências

```bash
npm i @sentry/electron -w desktop
npm i -D @sentry/vite-plugin @sentry/cli -w desktop
```

O nome do workspace é `desktop` (`apps/desktop/package.json`), não `@apliquefy/desktop`.

### 5.2 Main process

O init tem que rodar antes de tudo, mas **depois** do `loadEnvFile` de [main.ts:14-21](../apps/desktop/electron/main.ts#L14-L21) — é de lá que o DSN vem em desenvolvimento.

```ts
// apps/desktop/electron/observability.ts
import { app } from 'electron';
import * as Sentry from '@sentry/electron/main';
import { scrubEvent, scrubBreadcrumb } from '@repo/observability';

export function initObservability() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN_RUNNER,
    environment: app.isPackaged ? 'production' : 'development',
    enabled: app.isPackaged && consentGiven(),   // §7.4

    release: `apliquefy-runner@${app.getVersion()}`,
    dist: process.env.BUILD_NUMBER,

    sendDefaultPii: false,
    tracesSampleRate: 0,

    maxBreadcrumbs: 50,
    beforeBreadcrumb: scrubBreadcrumb,
    beforeSend: scrubEvent,

    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
    ],
  });

  Sentry.setTag('surface', 'runner_main');
  Sentry.setTag('runner_version', app.getVersion());
  Sentry.setTag('os', process.platform);
}
```

Em `main.ts`, antes de qualquer outro import de aplicação:

```ts
import { initObservability } from './observability';
// ...após o bloco loadEnvFile:
initObservability();
```

**Notas de implementação:**

- `enabled: app.isPackaged` evita queimar cota com erro de desenvolvimento. Para testar localmente, usar um projeto `-dev` separado.
- Release health está ligado por padrão no `@sentry/electron` atual. A opção `autoSessionTracking` da v1.0 mudou de nome/semântica entre majors do SDK JS — **conferir contra a versão instalada** antes de passá-la; um campo desconhecido é ignorado em silêncio e você descobre que não tem release health olhando o dashboard vazio.
- Crash nativo do Chromium é capturado pela integração `SentryMinidump` (padrão). A alternativa `electronMinidumpIntegration()` envia menos contexto — só trocar com motivo.
- Os `BrowserWindow` deste app não usam `sandbox: true` explicitamente; se isso mudar, adicionar o init de `@sentry/electron/preload`.

### 5.3 Renderer

```ts
// apps/desktop/src/observability.ts
import * as Sentry from '@sentry/electron/renderer';
Sentry.init({});                              // herda config do main via IPC
Sentry.setTag('surface', 'runner_renderer');
```

Primeira linha de [src/main.tsx](../apps/desktop/src/main.tsx), antes do import do `App`.

### 5.4 Propagação para o engine Python

`buildEnv` já faz spread de `process.env`, o que resolve o dev. No app empacotado não há `.env`, então o DSN precisa ser passado explicitamente — junto do release e do `user_id`, que o Python não tem como descobrir sozinho:

```ts
// apps/desktop/electron/services/rpa-process-service.ts — buildEnv()
return {
    ...process.env,
    RPA_AUTH_TOKEN: token,
    RPA_USER_DATA_DIR: app.getPath("userData"),
    APLIQUEFY_WEB_URL: getDesktopWebUrl(),
    APLIQUEFY_WEB_TOKEN: auth.token ?? "",
    PYTHONUNBUFFERED: "1",
    // observabilidade: o engine reporta no mesmo projeto do Runner (ADR-05)
    SENTRY_DSN_RUNNER: process.env.SENTRY_DSN_RUNNER ?? "",
    SENTRY_RELEASE: `apliquefy-runner@${app.getVersion()}`,
    SENTRY_USER_ID: auth.userId ?? "",
};
```

DSN vazio = SDK desativado no Python. É assim que o toggle de consentimento (§7.4) desliga o engine junto: se o consentimento estiver negado, não passe a variável.

### 5.5 O que instrumentar no main

O main já tem três `catch` que hoje só fazem `console.error` e são candidatos diretos:

| Local | Hoje | Ação |
|---|---|---|
| [main.ts:58-60](../apps/desktop/electron/main.ts#L58-L60) — `startRpaProcess()` falhou | `console.error` | `captureException` — o Runner está inutilizável sem o engine |
| [rpa-process-service.ts:169](../apps/desktop/electron/services/rpa-process-service.ts#L169) — restart falhou | `console.error` | `captureException` após o 3º backoff, não em toda tentativa |
| [main.ts:40-42, 97-99](../apps/desktop/electron/main.ts#L40-L42) — `resetActiveCampaignsToPaused` | `console.error` | breadcrumb, **não** evento — falha de rede no boot é esperada |

---

## 6. Design — `apps/robots` (engine Python) — **o núcleo**

É aqui que a v1.0 errava o alvo e é aqui que está o valor.

### 6.1 Dependência

```toml
# apps/robots/pyproject.toml
dependencies = [
    # ...
    "sentry-sdk>=2.20",
]
```

E no [build.spec](../apps/robots/build.spec), acrescentar `sentry_sdk` ao loop de `collect_all`. As integrações do sentry-sdk são importadas dinamicamente por nome — a análise estática do PyInstaller não as encontra e o binário empacotado sobe com o SDK mudo.

> Aproveitar a passada: o `build.spec` atual coleta `openai`, `playwright` e `reportlab`, e referencia `cognitive/prompts/system.md`. `browser_use` **não** está na lista, apesar de ser hoje o driver do apply. Fora do escopo deste SDD, mas vale conferir antes do próximo release empacotado.

### 6.2 Init

```python
# apps/robots/src/rpa_engine/observability.py
import os
import sentry_sdk
from sentry_sdk.integrations.logging import LoggingIntegration


def init_observability() -> None:
    dsn = os.environ.get("SENTRY_DSN_RUNNER")
    if not dsn:
        return  # dev, ou consentimento negado — ADR-05 / §7.4

    sentry_sdk.init(
        dsn=dsn,
        release=os.environ.get("SENTRY_RELEASE"),
        environment="production",

        # ── §7.2: as três linhas que impedem o vazamento do currículo ──
        include_local_variables=False,
        send_default_pii=False,
        max_request_body_size="never",

        # Integrações auto-habilitadas leem libs instaladas (openai, httpx,
        # fastapi). A do OpenAI captura prompt/completion — e o nosso prompt
        # É o currículo. Liga-se explicitamente o que for necessário.
        auto_enabling_integrations=False,

        # O logging vira breadcrumb por padrão. Os logs do engine e do
        # browser-use carregam URL de vaga, título e trechos do prompt.
        integrations=[LoggingIntegration(level=None, event_level=None)],

        # Release health é do Electron (ADR-05). Um run de campanha não é
        # uma "sessão" — ligar isso aqui destrói o crash-free rate.
        auto_session_tracking=False,

        traces_sample_rate=0,
        max_breadcrumbs=50,
        before_send=scrub_event,
    )

    sentry_sdk.set_tag("surface", "runner_engine")
    if user_id := os.environ.get("SENTRY_USER_ID"):
        sentry_sdk.set_user({"id": user_id})
```

Chamado em [`__main__.py:main()`](../apps/robots/src/rpa_engine/__main__.py#L28) logo após o `logging.basicConfig`, antes do `load_settings()` — assim um `RPA_AUTH_TOKEN` ausente já é capturado.

> Os nomes `auto_session_tracking` e `max_request_body_size` variam entre majors do sentry-sdk. Conferir contra a versão que o `uv.lock` fixar; opção desconhecida é ignorada em silêncio.

### 6.3 Pontos de captura

Mapeados contra o código atual. Cada linha é uma edição pontual, não uma reescrita.

| # | Local | Hoje | Vira |
|---|---|---|---|
| 1 | [orchestrator.py:134-137](../apps/robots/src/rpa_engine/runtime/orchestrator.py#L134-L137) | `logger.exception("run %s crashed")` + emit `paused` | `capture_exception`, **exceto** quando for a sessão inválida (ADR-04) |
| 2 | [apply_agent.py:263-266](../apps/robots/src/rpa_engine/runtime/apply_agent.py#L263-L266) | `logger.exception("apply agent crashed")` | `capture_exception` com tag `automation_step=apply_agent` |
| 3 | [linkedin/engine.py:83-85](../apps/robots/src/rpa_engine/engines/linkedin/engine.py#L83-L85) | `logger.warning("nenhum link de vaga encontrado")` | `capture_message(level="error")` — **é a quebra de seletor da busca** |
| 4 | [linkedin/engine.py:122-168](../apps/robots/src/rpa_engine/engines/linkedin/engine.py#L122-L168) | `except PlaywrightTimeout: continue` silencioso | contador; ver §6.4 |
| 5 | [infojobs/engine.py:59-60](../apps/robots/src/rpa_engine/engines/infojobs/engine.py#L59-L60) | `RuntimeError("... dropdown option ... not found (R07)")` | já sobe até o orchestrator; ganha `selector_key` para fingerprint |
| 6 | [infojobs/engine.py:40](../apps/robots/src/rpa_engine/engines/infojobs/engine.py#L40) | `page.fill(SEARCH_KEYWORD_INPUT)` sem guarda | timeout propaga → capturado em (1). Só precisa da tag de passo |
| 7 | [apply_agent.py:120-124](../apps/robots/src/rpa_engine/runtime/apply_agent.py#L120-L124) | `logger.warning("não consegui anexar o currículo")` | breadcrumb, **não** evento — é ruidoso por natureza (roda a cada passo) |
| 8 | [engines/linkedin/engine.py:59-66](../apps/robots/src/rpa_engine/engines/linkedin/engine.py#L59-L66) | `RuntimeError("LinkedIn session invalid")` | **excluído** — ADR-04 |

Assimetria a notar: o LinkedIn engoli seletor quebrado com `continue`/`warning`; o InfoJobs deixa propagar. Depois de (3) e (4), os dois passam a produzir sinal — sem mudar o comportamento visível ao usuário.

### 6.4 O run silenciosamente vazio (OBJ-6)

O caso mais valioso e o que a v1.0 não modelava. Um `PlaywrightTimeout` isolado é rotina; a **taxa** é que denuncia.

```python
# engines/linkedin/engine.py — _iterate_jobs
timeouts = 0
for job_url in job_urls:
    ...
    except PlaywrightTimeout:
        timeouts += 1
        logger.info("vaga sem Easy Apply/timeout, pulando: %s", job_url)
        continue

# ponytail: um evento por run, não por vaga. O piso de 5 evita alarme em
# busca que legitimamente devolveu 3 vagas sem Easy Apply.
if job_urls and timeouts == len(job_urls) and timeouts >= 5:
    capture_selector_break("apply_open", "APPLY_BUTTON", total=timeouts)
```

O mesmo padrão vale para `_goto_jobs_search` com `len(self._job_urls) == 0` — ponto (3) da tabela.

Isso troca "N usuários abrem chamado dizendo que não candidatou nada" por "1 issue: `platform:linkedin automation_step:apply_open`, 14 usuários afetados, novo desde a v1.4.2".

### 6.5 Fingerprint — dois regimes

O agrupamento padrão do Sentry é por stack trace, e isso não serve: o mesmo `PlaywrightTimeout` sai da mesma linha para causas diferentes. Mas a v1.0 propunha um `selectorKey` universal, e ele não existe em toda parte:

- **Parte mecânica** (busca, filtros, abertura do modal): há seletores nomeados em [selectors.py](../apps/robots/src/rpa_engine/engines/linkedin/selectors.py) — `JOB_CARD`, `APPLY_BUTTON`, `APPLY_MODAL`, `RESUME_UPLOAD_BTN`, `WHERE_DROPDOWN_OPTION`. **O nome da constante é o `selector_key`**, e é estável quando o valor do seletor é corrigido — exatamente a propriedade que o SDD quer.
- **Parte cognitiva** (`agent.run()`): não há seletor. O browser-use decide por visão, e os índices são `backendNodeId` do CDP. Não existe chave de agrupamento por elemento; agrupa-se por plataforma + tipo da exceção.

```python
# apps/robots/src/rpa_engine/observability.py

def capture_selector_break(step: str, selector_key: str, **extra) -> None:
    """Quebra mecânica: 1 issue por (plataforma × passo × seletor)."""
    with sentry_sdk.new_scope() as scope:
        scope.set_tag("automation_step", step)
        scope.set_tag("selector_key", selector_key)
        scope.fingerprint = ["selector", "{{ tags.platform }}", step, selector_key]
        scope.set_context("automation", extra)
        sentry_sdk.capture_message(f"seletor não encontrado: {selector_key}", level="error")


def capture_agent_crash(exc: BaseException, platform: str) -> None:
    """Crash cognitivo: sem seletor. Agrupa por plataforma + tipo da exceção."""
    with sentry_sdk.new_scope() as scope:
        scope.set_tag("automation_step", "apply_agent")
        scope.fingerprint = ["apply_agent", platform, type(exc).__name__]
        sentry_sdk.capture_exception(exc)
```

O `jobRef` da v1.0 (hash da URL da vaga) permanece como **contexto**, nunca como parte do fingerprint — senão cada vaga vira um issue.

### 6.6 O que **não** capturar

Reforço do ADR-04, porque o engine é onde a tentação é maior:

- `Outcome.PAUSE_RETRY` com `error_log = "agente não concluiu dentro do limite de passos"` → Postgres. É o desfecho mais comum de candidatura mal-sucedida e afogaria a cota sozinho.
- `Outcome.SKIP_UNANSWERABLE` → Postgres. É o agente funcionando como projetado.
- `already_applied` → Postgres.
- Exceção do `_stream_frames` — [orchestrator.py:65](../apps/robots/src/rpa_engine/runtime/orchestrator.py#L65) já descarta de propósito, a ~2.5 fps. Capturar isso é auto-DDoS de cota.
- `asyncio.CancelledError` — é `stop()` do usuário, já re-raised corretamente em [orchestrator.py:132](../apps/robots/src/rpa_engine/runtime/orchestrator.py#L132).

---

## 7. Privacidade e LGPD — requisito bloqueante

O engine manipula **currículo estruturado, cookies de sessão do LinkedIn/InfoJobs e screenshots de páginas autenticadas**. Nada disso pode sair da máquina do usuário sem tratamento.

### 7.1 Onde o dado sensível efetivamente está

| Dado | Onde | Risco de captura acidental |
|---|---|---|
| Currículo completo (JSON) | `_build_task` — [apply_agent.py:131](../apps/robots/src/rpa_engine/runtime/apply_agent.py#L131) serializa em `resume_json`, variável **local** | **Altíssimo** — ver §7.2 |
| Currículo em `ctx.resume` | `EngineContext`, vivo durante todo o run | Alto — local de vários frames |
| Cookies de sessão | `storage_state_path`, carregado por `session_loader` | Médio — caminho é inócuo, conteúdo não |
| Screenshot da página logada | `_stream_frames`, JPEG base64 a ~2.5 fps | Alto se virar breadcrumb/anexo |
| Token da API web | `APLIQUEFY_WEB_TOKEN`, header do `WebApiClient` | Médio |
| URL e título da vaga | `logger.info` em vários pontos | Baixo, mas é PII de contexto |

### 7.2 Achado crítico — o default do sentry-sdk vaza o currículo

`sentry_sdk` tem `include_local_variables=True` **por padrão**. Com isso, qualquer exceção que passe por `execute_apply` anexa ao evento as variáveis locais do frame — inclusive `resume_json`, que é o currículo inteiro serializado, e `ctx`, que carrega o `resume` bruto.

Isso significa que o ponto de captura mais óbvio de todos — `except Exception` do agente, [apply_agent.py:263](../apps/robots/src/rpa_engine/runtime/apply_agent.py#L263) — enviaria o currículo completo do usuário para o Sentry na configuração default, sem nenhuma linha de código errada. É um vazamento por omissão.

Três defaults precisam ser invertidos, todos em §6.2:

| Opção | Default | Obrigatório | Por quê |
|---|---|---|---|
| `include_local_variables` | `True` | **`False`** | `resume_json`, `ctx.resume` nos frames |
| `auto_enabling_integrations` | `True` | **`False`** | A integração do OpenAI captura prompt/completion — e o prompt *é* o currículo |
| `LoggingIntegration` | breadcrumb em `INFO`, evento em `ERROR` | `level=None, event_level=None` | Logs do engine e do browser-use carregam URL, título e trechos do prompt |

Perde-se contexto de debug com `include_local_variables=False`. É o preço, e é o certo: o stack trace + as tags de §8 + o `job_ref` hasheado bastam para localizar o problema, e nenhum deles é PII.

### 7.3 Camadas de proteção

| # | Camada | Onde | O que faz |
|---|---|---|---|
| 1 | Defaults invertidos | SDK Python | §7.2 — a barreira que mais importa |
| 2 | `sendDefaultPii: false` | ambos SDKs | Não coleta IP nem headers de request |
| 3 | `before_breadcrumb` | SDK | Descarta breadcrumb de console/log/fetch com payload sensível |
| 4 | `before_send` | SDK | Redação por denylist de chaves — última barreira local |
| 5 | Data Scrubbing | Sentry | Filtros server-side (defesa em profundidade) |
| 6 | Retenção | Sentry | Prazo mínimo viável de retenção do projeto |

### 7.4 Scrubbing — TypeScript

```ts
// packages/observability/src/scrubbing.ts
const DENY_KEYS = [
  'password', 'senha', 'token', 'jwt', 'authorization', 'cookie', 'cookies',
  'session', 'sessao', 'storagestate', 'cpf', 'rg', 'email', 'phone', 'telefone',
  'endereco', 'address', 'personalinfo', 'resume', 'curriculo', 'education',
  'experience', 'skills', 'idioms', 'apikey', 'secret',
];

const REDACTED = '[Filtered]';

function redact(value: unknown, depth = 0): unknown {
  if (depth > 6 || value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map((v) => redact(v, depth + 1));

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([k, v]) => [
      k,
      DENY_KEYS.some((d) => k.toLowerCase().includes(d)) ? REDACTED : redact(v, depth + 1),
    ]),
  );
}

export function scrubEvent(event: Sentry.Event): Sentry.Event | null {
  delete (event as { attachments?: unknown }).attachments;   // nunca anexo binário

  if (event.request) {
    delete event.request.cookies;
    delete event.request.headers;
    delete event.request.data;
    event.request.query_string = undefined;
  }

  if (event.user) event.user = { id: event.user.id };

  event.extra    = redact(event.extra)    as Sentry.Event['extra'];
  event.contexts = redact(event.contexts) as Sentry.Event['contexts'];

  return event;
}

export function scrubBreadcrumb(bc: Sentry.Breadcrumb): Sentry.Breadcrumb | null {
  if (bc.category === 'console') return null;
  if (typeof bc.data?.url === 'string') bc.data.url = bc.data.url.split('?')[0];
  return bc;
}
```

### 7.5 Scrubbing — Python

Não é porte do TS: o formato do evento é o do SDK Python (`exception.values[].stacktrace.frames[].vars`) e o alvo é outro.

```python
# apps/robots/src/rpa_engine/observability.py
_DENY = (
    "password", "senha", "token", "jwt", "authorization", "cookie", "session",
    "storage_state", "cpf", "rg", "email", "phone", "telefone", "endereco",
    "address", "personal_info", "personalinfo", "resume", "curriculo",
    "education", "experience", "skills", "idioms", "api_key", "secret",
    "task",   # o `task` do browser-use Agent É o prompt com o currículo
)
_REDACTED = "[Filtered]"


def _redact(value, depth: int = 0):
    if depth > 6 or not isinstance(value, dict):
        return value
    return {
        k: _REDACTED if any(d in k.lower() for d in _DENY) else _redact(v, depth + 1)
        for k, v in value.items()
    }


def scrub_event(event, hint):
    # Cinto e suspensório: include_local_variables=False já deveria ter tirado,
    # mas se alguém reverter aquela linha, esta aqui segura.
    for exc in (event.get("exception") or {}).get("values", []):
        for frame in (exc.get("stacktrace") or {}).get("frames", []):
            frame.pop("vars", None)

    event.pop("request", None)
    if user := event.get("user"):
        event["user"] = {"id": user.get("id")}

    event["extra"] = _redact(event.get("extra") or {})
    event["contexts"] = _redact(event.get("contexts") or {})
    return event
```

### 7.6 Política sobre screenshots

**Decisão: screenshot não é enviado ao Sentry.** Mantida da v1.0, e agora com um vetor concreto a bloquear: `_stream_frames` produz JPEG base64 continuamente e esses frames circulam pelo `emit`. Nenhum deles pode virar breadcrumb, `extra` ou anexo.

O print de uma página logada do LinkedIn contém nome, foto, conexões e potencialmente dados de terceiros — que não consentiram nada. O tratamento:

1. Screenshot é salvo **localmente**, no `userData` do app
2. O evento no Sentry carrega apenas o **caminho relativo e o hash** do arquivo
3. Se o debug exigir a imagem, o suporte pede ao usuário com consentimento explícito
4. Rotação local: apagar prints com mais de 7 dias

### 7.7 Consentimento

O Runner roda na máquina do usuário: incluir no onboarding um toggle **"Enviar relatórios de erro anônimos"**, persistido no `store.ts` junto das demais `settings`. Padrão sugerido: ativado, com aviso claro e desligamento a um clique.

O toggle precisa desligar **os três** SDKs:
- main e renderer → `enabled` do `init`
- engine Python → basta **não** passar `SENTRY_DSN_RUNNER` no `buildEnv` (§5.4). Como o engine é reiniciável, mudar o toggle exige um `stopRpaProcess()` + `startRpaProcess()` para valer — ou aceitar que só vale no próximo boot. **Decisão: vale no próximo boot**, com aviso no toggle.

Refletir na Política de Privacidade e verificar necessidade de DPA com o provedor.

---

## 8. Taxonomia de tags

Padronizada em `packages/observability/taxonomy.json` (§4.1) e obrigatória nos três runtimes.

| Tag | Valores | Uso |
|---|---|---|
| `platform` | `linkedin` \| `infojobs` | Isolar quebra por plataforma |
| `automation_step` | ver §4.1 | Localizar a etapa |
| `selector_key` | nome da constante em `selectors.py` | Só na parte mecânica (§6.5) |
| `runner_version` | semver | Correlacionar com release |
| `os` | `win32` \| `darwin` \| `linux` | Bug específico de SO |
| `surface` | `web` \| `runner_main` \| `runner_renderer` \| `runner_engine` | Origem |
| `plan_tier` | `starter` \| `professional` \| `enterprise` | Priorizar por impacto comercial |

Consultas que isso viabiliza:

```
platform:linkedin automation_step:apply_open selector_key:APPLY_BUTTON
surface:runner_engine runner_version:1.4.2 is:unresolved
surface:runner_main os:win32 is:unresolved
```

---

## 9. Design — `apps/web` (Next.js 16)

Implementar por último. Enquanto o volume for baixo, os logs da plataforma bastam para o lado servidor.

> A estrutura de arquivos do `@sentry/nextjs` mudou entre versões maiores (`sentry.client.config.ts` → `instrumentation-client.ts`). Rodar `npx @sentry/wizard@latest -i nextjs` e conferir a documentação vigente antes de copiar o layout abaixo.

### 9.1 Correções sobre a v1.0

- **Não há `sentry.edge.config.ts`.** O projeto não tem `middleware.ts`: no Next 16 o arquivo virou [`proxy.ts`](../apps/web/proxy.ts) e roda `clerkMiddleware` no runtime Node por padrão. Criar o config de edge seria arquivo morto. Adicionar só se alguma rota for explicitamente marcada como edge.
- **`next.config.js`, não `.ts`** — é ESM (`export default`), então o `withSentryConfig` entra normalmente, mas o caminho do arquivo na v1.0 estava errado.
- **App Router em `apps/web/app/`**, sem `src/` → `instrumentation.ts` e `instrumentation-client.ts` na raiz de `apps/web/`.
- **`app/global-error.tsx` ainda não existe** — é arquivo novo, não edição.
- **`VERCEL_ENV` / `VERCEL_GIT_COMMIT_SHA`**: não há `vercel.json` nem workflow de deploy do web no repositório. Confirmar que o deploy é Vercel antes de amarrar o `release` a essas variáveis; se não for, usar o SHA do CI que existir.

### 9.2 Arquivos

| Arquivo | Runtime | Responsabilidade |
|---|---|---|
| `instrumentation-client.ts` | Browser | `init` do cliente; exporta `onRouterTransitionStart` |
| `sentry.server.config.ts` | Node | `init` do servidor |
| `instrumentation.ts` | — | `register()` carrega o acima; exporta `onRequestError` |
| `app/global-error.tsx` | Browser | Captura erro de render do App Router |
| `next.config.js` | Build | `withSentryConfig` — upload de source map |

```ts
// apps/web/instrumentation.ts
import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') await import('./sentry.server.config');
}

// Captura erros de Server Components, proxy e route handlers
export const onRequestError = Sentry.captureRequestError;
```

```js
// apps/web/next.config.js
import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: 'apliquefy-web',
  silent: !process.env.CI,
  tunnelRoute: '/monitoring',                      // contorna ad blockers
  sourcemaps: { deleteSourcemapsAfterUpload: true },
  disableLogger: true,
});
```

```ts
// apps/web/sentry.server.config.ts
Sentry.init({
  dsn: process.env.SENTRY_DSN_WEB,
  environment: process.env.VERCEL_ENV ?? 'development',
  release: process.env.VERCEL_GIT_COMMIT_SHA,
  enabled: process.env.VERCEL_ENV === 'production',
  sendDefaultPii: false,
  tracesSampleRate: 0,
  beforeSend: scrubEvent,
});
```

### 9.3 Rotas consumidas pelo engine

O engine chama de volta a API web ([`WebApiClient`](../apps/robots/src/rpa_engine/web_api/client.py)) em `/api/campaigns/[id]/runtime`, `/daily-status`, `/api/job-applications`, `/api/credits/debit-flat`. São o contrato com o Runner e a fonte mais provável de incidente correlacionado — merecem tag dedicada:

```ts
Sentry.setTag('surface', 'runner_api');
```

Um pico de 5xx aqui e um pico de `surface:runner_engine` são o mesmo incidente visto dos dois lados.

---

## 10. Releases e source maps

### 10.1 A armadilha do cache do Turbo — só existe no web

A v1.0 tratava isso como risco Alto e propunha `turbo.json` como mitigação principal. Metade está certa:

- **Desktop: não se aplica.** O [workflow de release](../.github/workflows/desktop-release.yml) roda `npm run release` com `working-directory: apps/desktop`, chamando o script do workspace direto. O Turbo não entra no caminho e não há cache a acertar.
- **Web: aplica.** `npm run build` na raiz passa por `turbo run build`, e um cache hit pularia o upload, deixando a release sem source map em silêncio.

**Mitigação (web):** declarar as variáveis no `turbo.json` para que participem da chave de cache:

```jsonc
// turbo.json
{
  "globalEnv": ["...", "SENTRY_ORG", "SENTRY_AUTH_TOKEN"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "env": ["SENTRY_DSN_WEB", "NEXT_PUBLIC_SENTRY_DSN", "SENTRY_RELEASE", "VERCEL_GIT_COMMIT_SHA"],
      "outputs": [".next/**", "!.next/cache/**"]
    }
  }
}
```

Preferencialmente, extrair o upload para uma task não cacheável (`"cache": false`) que chame `sentry-cli sourcemaps inject && upload`. Aí a garantia não depende do estado do cache.

**Risco reclassificado de Alto para Médio** (§14), porque a superfície afetada é uma, não duas.

### 10.2 Source maps do Electron — o main não passa pelo Vite

Correção importante da v1.0, que propunha `electron.vite.config.ts` com `sentryVitePlugin` cobrindo main e renderer. O build real é `tsc && vite build`:

| Processo | Compilador | Saída | Como subir o source map |
|---|---|---|---|
| main + preload | `tsc` (tsconfig com `include: electron/**/*`) | `dist-electron/` | `sentry-cli sourcemaps inject` + `upload` — **o Vite não vê esses arquivos** |
| renderer | `vite build` | `dist-react/` | `sentryVitePlugin` no `vite.config.ts` |

O `tsconfig.json` atual **não tem `"sourceMap": true`** e o `vite.config.ts` não tem `build.sourcemap`. Sem essas duas linhas não existe source map nenhum para subir, e o SDK reporta stack minificado sem avisar.

```jsonc
// apps/desktop/tsconfig.json
{ "compilerOptions": { "sourceMap": true, "...": "..." } }
```

```ts
// apps/desktop/vite.config.ts
export default defineConfig({
  plugins: [
    react(),
    sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: 'apliquefy-runner',
      authToken: process.env.SENTRY_AUTH_TOKEN,
      release: { name: `apliquefy-runner@${version}` },
      sourcemaps: { filesToDeleteAfterUpload: ['**/*.map'] },
    }),
  ],
  build: { outDir: 'dist-react', emptyOutDir: true, sourcemap: 'hidden' },
});
```

`sourcemap: 'hidden'` gera o arquivo sem deixar o comentário `sourceMappingURL` no bundle distribuído.

**Python não precisa de source map.** Stack trace de exceção Python já é legível; o PyInstaller preserva os nomes de arquivo e linha do código empacotado.

### 10.3 Convenção de release e o CI de 3 sistemas

| App | `release` | `dist` |
|---|---|---|
| Web | `VERCEL_GIT_COMMIT_SHA` (confirmar — §9.1) | — |
| Desktop + engine | `apliquefy-runner@<versão>` | `github.run_number` |

A versão do desktop vem da **tag**, não do `package.json`: o workflow roda `npm version --no-git-tag-version "${GITHUB_REF_NAME#v}"` antes do build. Então `app.getVersion()` em runtime bate com a tag — bom, funciona sem mudança.

`BUILD_NUMBER` da v1.0 não existe no CI. A fonte natural é `github.run_number`; adicionar ao `env` do passo "Build & publish".

Ponto de atenção: o job é `strategy.matrix` com `ubuntu`, `windows` e `macos`. Os três vão subir source map para a **mesma** release. O upload é idempotente do lado do Sentry, então não quebra — mas se o log ficar poluído ou o CI lento, restringir o upload a `matrix.os == 'ubuntu-latest'`.

---

## 11. Alertas

| Alerta | Condição | Canal | Severidade |
|---|---|---|---|
| Quebra de plataforma | Issue novo com `automation_step` afetando > 10 usuários em 1h | Slack + e-mail | Crítico |
| Busca vazia sistemática | `selector_key:JOB_CARD` em > 5 usuários em 1h | Slack + e-mail | Crítico |
| Regressão | Issue marcado como regressão em release nova | Slack | Alto |
| Queda de estabilidade | Crash-free session rate < 95% em 24h | Slack | Alto |
| Engine não sobe | `surface:runner_main` + falha de `startRpaProcess` > 10 em 1h | Slack | Alto |
| Erro 5xx no contrato do Runner | `surface:runner_api`, > 25 eventos em 10 min | Slack | Alto |
| Cota | 80% da cota mensal consumida | E-mail | Médio |

Regra de higiene: alerta que dispara e não gera ação é alerta a ser removido. Revisar mensalmente.

---

## 12. Plano de implementação

Reordenado: a v1.0 punha o Electron main na Fase 1. Ele é a superfície de menor rendimento — quase todo erro real está no engine.

| Fase | Entrega | Status | Critério de saída |
|---|---|---|---|
| **0** | `@repo/observability` com scrubbing TS + `taxonomy.json` + teste de paridade | ✅ código | Testes passando em CI |
| **1** | **Engine Python**: `observability.py` com os defaults invertidos de §7.2, init no `__main__`, capturas (1) e (2) de §6.3 | ✅ | Crash do agente chega agrupado, e a auditoria de payload confirma zero currículo |
| **2** | **Detecção de quebra de seletor**: capturas (3)–(6), agregado do run vazio (§6.4), fingerprint de §6.5 | ✅ código · ⏳ alertas | Seletor quebrado simulado → 1 issue com contador de usuários |
| **3** | **Electron**: main + renderer + crash nativo + release health + propagação de DSN por `buildEnv` | ✅ | Crash-free session rate visível por versão |
| **4** | **Consentimento** (§7.7) + `tsconfig`/`vite.config` com source map + upload no CI | ✅ | Toggle desliga os três SDKs; stack de-minificado |
| **5** | `apps/web`: server, client, `global-error.tsx`, source maps, `turbo.json` | ✅ | Erro em Server Action visível com release correta |
| **6** | Remover o fluxo de e-mail do fluxograma do Runner | ⏳ | Fluxograma do SAD atualizado |

Fases 1–2 são o núcleo de valor e podem ser entregues sem tocar em nada do Electron além de três linhas em `buildEnv`.

### 12.1 O que falta e não é código

Nada disso é implementável a partir do repositório — depende de acesso ao Sentry:

1. Criar os projetos `apliquefy-runner` e `apliquefy-web` e pegar os DSNs.
2. Gravar os secrets: `SENTRY_DSN_RUNNER`, `SENTRY_ORG` e `SENTRY_AUTH_TOKEN` no GitHub (já referenciados no `desktop-release.yml`); `SENTRY_DSN_WEB` e `NEXT_PUBLIC_SENTRY_DSN` no host do web.
3. Configurar as regras de alerta de §11 e o Data Scrubbing server-side (§7.3, camada 5).
4. Definir o prazo de retenção e revisar manualmente os 50 primeiros eventos em staging (§14).
5. Refletir o toggle de consentimento na Política de Privacidade e avaliar o DPA.

Até o passo 1, tudo fica inerte por construção: sem DSN o SDK Python não sobe, e no Electron/web o `enabled` fica falso.

---

## 13. Fora de escopo

| Item | Motivo |
|---|---|
| Tracing / APM (`tracesSampleRate > 0`) | Sem gargalo de latência conhecido; consome cota rapidamente |
| Session Replay | **Vetado.** Gravaria a tela do usuário logado no LinkedIn — inaceitável neste produto |
| Profiling | Sem necessidade |
| Cron Monitors | Reavaliar quando houver jobs agendados no backend |
| Integração OpenAI/LLM do Sentry | **Vetada.** Captura prompt e completion — o prompt é o currículo (§7.2) |

---

## 14. Riscos

| Risco | Prob. | Impacto | Mitigação |
|---|---|---|---|
| **Currículo vazando por `include_local_variables`** | **Alta** (é o default) | **Crítico** | §7.2 — as três opções invertidas + teste que injeta exceção em `execute_apply` e afirma ausência de `vars` no payload |
| Vazamento de PII por outro caminho | Média | Crítico | Scrubbing em 2 camadas + revisão manual dos 50 primeiros eventos em staging |
| Estouro de cota por erro em loop | Média | Médio | `ignoreErrors`, agregação por run (§6.4), rate limit no projeto, alerta em 80% |
| Ruído de erro de negócio no Sentry | Alta | Alto | ADR-04 aplicado como regra de code review |
| `sentry_sdk` ausente do binário PyInstaller | Média | Médio | §6.1 — `collect_all` + smoke test que dispara evento no binário empacotado |
| Cache do Turbo pulando upload de source map | Média | Médio | §10.1 — só afeta o web; task de upload não cacheável |
| Divergência da taxonomia TS↔Python | Média | Baixo | Teste de paridade contra `taxonomy.json` (ADR-03) |
| Aumento de custo com a base de usuários | Média | Médio | GlitchTip como plano B (ADR-01) |

---

## 15. Critérios de aceite

**Engine (Fases 1–2)**
- [ ] Exceção não tratada no `runner()` do Orchestrator aparece em `apliquefy-runner` com `surface:runner_engine` em < 60s
- [ ] Crash do `agent.run()` gera evento com `automation_step:apply_agent`
- [ ] Auditoria do payload: nenhum evento contém currículo, cookie, token ou o `task` do browser-use
- [ ] Exceção injetada dentro de `execute_apply` **não** traz `stacktrace.frames[].vars`
- [ ] `RuntimeError("LinkedIn session invalid")` **não** gera evento
- [ ] `Outcome.SKIP_UNANSWERABLE` e `PAUSE_RETRY` **não** geram evento
- [ ] Busca que devolve 0 URLs gera 1 evento com `selector_key:JOB_CARD`
- [ ] Run em que 100% das vagas caem no `except PlaywrightTimeout` gera **1** evento, não N
- [ ] `selector_key` diferente gera issues **separados**; mesma `selector_key` em 3 máquinas agrupa em **1** issue com "3 usuários afetados"
- [ ] Binário PyInstaller (não o venv de dev) envia evento com sucesso

**Desktop (Fases 3–4)**
- [ ] Exceção não tratada no main process aparece em < 60s
- [ ] Crash nativo do Chromium gera evento com minidump simbolizado
- [ ] Stack trace do main e do renderer de-minificados
- [ ] Crash-free session rate visível por versão do Runner
- [ ] Toggle de consentimento desativa main, renderer **e** engine (este no próximo boot)
- [ ] Nenhum evento carrega anexo de imagem

**Web (Fase 5)**
- [ ] Erro em Server Action visível com a release correta
- [ ] Build com cache hit do Turbo ainda resulta em release com source map

---

## 16. Variáveis de ambiente

| Variável | Escopo | Segredo | Observação |
|---|---|---|---|
| `SENTRY_DSN_RUNNER` | desktop (build) → engine (runtime) | Não¹ | Embutida no binário; repassada ao Python via `buildEnv` |
| `SENTRY_RELEASE` | engine (runtime) | Não | Injetada pelo `buildEnv` a partir de `app.getVersion()` |
| `SENTRY_USER_ID` | engine (runtime) | Não | UUID interno, injetado pelo `buildEnv` |
| `SENTRY_DSN_WEB` | web (server) | Não¹ | — |
| `NEXT_PUBLIC_SENTRY_DSN` | web (client) | Não¹ | Pública por natureza |
| `SENTRY_AUTH_TOKEN` | CI | **Sim** | Upload de source map. Nunca no bundle |
| `SENTRY_ORG` | CI | Não | — |
| `BUILD_NUMBER` | CI (desktop) | Não | Campo `dist`; usar `github.run_number` |

¹ O DSN é público por design (só permite escrita de evento), mas mantê-lo fora do repositório reduz risco de flood por terceiros.

As três primeiras entram no `buildEnv` de [rpa-process-service.ts](../apps/desktop/electron/services/rpa-process-service.ts#L67-L77) — ver §5.4. As de CI entram no `env` do passo "Build & publish" do [desktop-release.yml](../.github/workflows/desktop-release.yml).

---

## 17. Referências

- Sentry — Electron: `docs.sentry.io/platforms/javascript/guides/electron/`
- Sentry — Python (configuration options): `docs.sentry.io/platforms/python/configuration/options/`
- Sentry — Next.js (manual setup): `docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/`
- Turborepo — Environment Variables & caching
- LGPD — Lei 13.709/2018, arts. 6º (necessidade e minimização) e 46 (segurança)

---

*Documento vivo — revisar ao concluir cada fase do §12.*
