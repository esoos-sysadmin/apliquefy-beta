"""Error tracking do engine (SDD §6).

O engine reporta no MESMO projeto Sentry do Runner (`apliquefy-runner`),
distinguido pela tag `surface=runner_engine` — ADR-05. O DSN, o release e o
id do usuário chegam por env, injetados pelo `buildEnv` do Electron.

Sem `SENTRY_DSN_RUNNER` o `init` não roda e todas as funções deste módulo viram
no-op (as APIs do sentry_sdk já são seguras sem init). É assim que o toggle de
consentimento desliga o engine: o Electron simplesmente não passa a variável.
"""
from __future__ import annotations

import hashlib
import logging
import os
from contextlib import contextmanager
from typing import Any, Iterator

import sentry_sdk
from sentry_sdk.integrations.logging import LoggingIntegration

logger = logging.getLogger(__name__)

# --- Taxonomia (SDD §4.1) -------------------------------------------------
# Duplicada de packages/observability/src/taxonomy.json de propósito: um pacote
# npm não atravessa para o uv. tests/test_observability.py falha se divergir.

AUTOMATION_STEPS = (
    "session_check",
    "job_search",
    "job_filters",
    "job_iteration",
    "apply_open",
    "resume_attach",
    "apply_agent",
    "debit",
)
SURFACES = ("web", "runner_api", "runner_main", "runner_renderer", "runner_engine")
PLATFORMS = ("linkedin", "infojobs")

# Piso para o alarme agregado de §6.4: só grita quando TODAS as vagas do run
# caíram no mesmo ponto E havia vagas suficientes para isso significar algo.
# Uma busca que devolveu 3 vagas, todas sem Easy Apply, é rotina.
MIN_JOBS_FOR_SELECTOR_ALARM = 5


# --- Scrubbing (SDD §7.5) -------------------------------------------------

_DENY = (
    "password", "senha", "token", "jwt", "authorization", "cookie", "session",
    "sessao", "storage_state", "storagestate", "cpf", "rg", "email", "phone",
    "telefone", "endereco", "address", "personal_info", "personalinfo", "resume",
    "curriculo", "education", "experience", "skills", "idioms", "api_key",
    "apikey", "secret",
    # O `task` do Agent do browser-use É o prompt — e o prompt carrega o
    # currículo inteiro serializado (_build_task em apply_agent.py).
    "task",
)
_REDACTED = "[Filtered]"
_MAX_DEPTH = 6


def _redact(value: Any, depth: int = 0) -> Any:
    if depth > _MAX_DEPTH:
        return _REDACTED
    if isinstance(value, dict):
        return {
            k: _REDACTED if any(d in str(k).lower() for d in _DENY) else _redact(v, depth + 1)
            for k, v in value.items()
        }
    if isinstance(value, (list, tuple)):
        return [_redact(item, depth + 1) for item in value]
    return value


def scrub_event(event: dict, hint: dict | None = None) -> dict:
    """`before_send`: última barreira antes do envelope sair da máquina."""
    # Cinto e suspensório. `include_local_variables=False` no init já deveria ter
    # tirado os locais do frame, mas se alguém reverter aquela linha é AQUI que o
    # currículo (resume_json, ctx.resume) para de vazar.
    for exc in (event.get("exception") or {}).get("values", []):
        for frame in (exc.get("stacktrace") or {}).get("frames", []):
            frame.pop("vars", None)

    # O engine é um servidor HTTP local: o corpo do POST /runs carrega caminhos de
    # storageState e do PDF. Nada disso ajuda no debug.
    event.pop("request", None)

    user = event.get("user")
    if user:
        event["user"] = {"id": user.get("id")}

    if "extra" in event:
        event["extra"] = _redact(event["extra"])
    if "contexts" in event:
        event["contexts"] = _redact(event["contexts"])

    return event


# --- Init (SDD §6.2) ------------------------------------------------------


def init_observability() -> bool:
    """Liga o Sentry. Devolve True se ficou ativo. Idempotente na prática."""
    dsn = os.environ.get("SENTRY_DSN_RUNNER")
    if not dsn:
        logger.info("sentry desativado (sem SENTRY_DSN_RUNNER)")
        return False

    sentry_sdk.init(
        dsn=dsn,
        release=os.environ.get("SENTRY_RELEASE"),
        environment=os.environ.get("SENTRY_ENVIRONMENT", "production"),

        # ── As três inversões de default que impedem o vazamento do currículo ──
        # (SDD §7.2 — conferidas contra sentry-sdk 2.66)
        #
        # 1. O default é True: os locais de CADA frame vão no evento. O frame de
        #    execute_apply tem `resume_json` (currículo inteiro serializado) e
        #    `ctx` (com ctx.resume). Um único crash do agente vazaria tudo.
        include_local_variables=False,
        # 2. As auto-integrações leem as libs instaladas. A do OpenAI captura
        #    prompt e completion — e o nosso prompt É o currículo.
        auto_enabling_integrations=False,
        # 3. Corpo de request nunca.
        max_request_body_size="never",

        send_default_pii=False,

        # O logging vira breadcrumb (INFO) e evento (ERROR) por padrão. Os logs do
        # engine e do browser-use carregam URL de vaga, título e trechos do prompt.
        # level=None/event_level=None desliga os dois lados sem tirar a integração.
        integrations=[LoggingIntegration(level=None, event_level=None)],

        # Release health é do Electron (ADR-05). Um run de campanha não é uma
        # "sessão" de app: ligar isso aqui destruiria o crash-free rate.
        auto_session_tracking=False,

        traces_sample_rate=0,
        max_breadcrumbs=50,
        before_send=scrub_event,
    )

    sentry_sdk.set_tag("surface", "runner_engine")
    if user_id := os.environ.get("SENTRY_USER_ID"):
        sentry_sdk.set_user({"id": user_id})

    logger.info("sentry ativo (release=%s)", os.environ.get("SENTRY_RELEASE"))
    return True


# --- Captura (SDD §6.3, §6.5) --------------------------------------------


def job_ref(job_url: str) -> str:
    """Hash curto da URL da vaga. Vai como contexto, NUNCA no fingerprint —
    senão cada vaga viraria um issue separado."""
    return hashlib.sha256(job_url.encode("utf-8")).hexdigest()[:12]


def breadcrumb(step: str, message: str, **data: Any) -> None:
    """Rastro navegacional do run.

    Existe porque a LoggingIntegration está desligada (§7.2) — sem estas chamadas
    explícitas os eventos chegariam sem breadcrumb nenhum. Só passe dado já
    inócuo: job_ref hasheado, contadores, nome de passo. Nunca URL crua, título
    de vaga ou qualquer campo de currículo.
    """
    sentry_sdk.add_breadcrumb(
        category="automation", level="info", message=message, data={"step": step, **data}
    )


def capture_selector_break(
    step: str,
    selector_key: str,
    platform: str,
    **extra: Any,
) -> None:
    """Quebra mecânica: 1 issue por (plataforma × passo × seletor).

    `selector_key` é o NOME da constante em `selectors.py`, não o valor do
    seletor CSS — assim o agrupamento sobrevive à correção do seletor.
    """
    with sentry_sdk.new_scope() as scope:
        scope.set_tag("platform", platform)
        scope.set_tag("automation_step", step)
        scope.set_tag("selector_key", selector_key)
        scope.fingerprint = ["selector", platform, step, selector_key]
        if extra:
            scope.set_context("automation", extra)
        sentry_sdk.capture_message(
            f"seletor não encontrado: {selector_key} ({platform}/{step})", level="error"
        )


def capture_run_crash(exc: BaseException) -> None:
    """Único ponto de captura do run inteiro (orchestrator). Erros de negócio já
    foram filtrados pelo caller — aqui só chega o inesperado.

    Um `SelectorNotFoundError` que subiu até aqui ganha o fingerprint específico
    em vez do agrupamento por stack trace, que juntaria seletores diferentes no
    mesmo issue por virem da mesma linha.
    """
    selector_key = getattr(exc, "selector_key", None)
    with sentry_sdk.new_scope() as scope:
        if selector_key:
            platform = getattr(exc, "platform", "unknown")
            step = getattr(exc, "step", "unknown")
            scope.set_tag("platform", platform)
            scope.set_tag("automation_step", step)
            scope.set_tag("selector_key", selector_key)
            scope.fingerprint = ["selector", platform, step, selector_key]
        sentry_sdk.capture_exception(exc)


@contextmanager
def run_scope(run_id: str, campaign_id: str) -> Iterator[None]:
    """Isola tags/contexto por run. Runs concorrem como tasks asyncio no mesmo
    processo; sem isolamento a tag `platform` de um vazaria para o outro."""
    with sentry_sdk.isolation_scope() as scope:
        # run_id e campaign_id como CONTEXTO, não tag: são alta cardinalidade e
        # como tag inutilizariam o agrupamento e a busca.
        scope.set_context("run", {"run_id": run_id, "campaign_id": campaign_id})
        yield


def set_run_platform(platform: str) -> None:
    """Tag `platform` do run corrente (dentro do `run_scope`)."""
    sentry_sdk.set_tag("platform", platform)


def capture_agent_crash(exc: BaseException, platform: str, **extra: Any) -> None:
    """Crash do agente cognitivo. Não há seletor aqui — o browser-use decide por
    visão e os índices são backendNodeId do CDP. Agrupa por tipo de exceção."""
    with sentry_sdk.new_scope() as scope:
        scope.set_tag("platform", platform)
        scope.set_tag("automation_step", "apply_agent")
        scope.fingerprint = ["apply_agent", platform, type(exc).__name__]
        if extra:
            scope.set_context("automation", extra)
        sentry_sdk.capture_exception(exc)
