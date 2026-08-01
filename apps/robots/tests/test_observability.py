"""Guardas do error tracking do engine (SDD §7.2, §14).

O que estes testes protegem, em ordem de gravidade:
  1. o currículo não sair da máquina num evento de erro;
  2. a taxonomia Python não divergir da do lado TypeScript;
  3. falha de negócio não virar issue no Sentry (ADR-04).
"""
from __future__ import annotations

import json
from pathlib import Path

import pytest
import sentry_sdk

from rpa_engine import observability as obs
from rpa_engine.engines.base import (
    BusinessError,
    CampaignMisconfiguredError,
    SelectorNotFoundError,
    SessionInvalidError,
)

TAXONOMY_JSON = (
    Path(__file__).resolve().parents[3] / "packages" / "observability" / "src" / "taxonomy.json"
)


# --- Paridade da taxonomia (ADR-03) ---------------------------------------


def test_taxonomia_bate_com_o_lado_typescript():
    taxonomy = json.loads(TAXONOMY_JSON.read_text(encoding="utf-8"))
    assert list(obs.AUTOMATION_STEPS) == taxonomy["automationStep"]
    assert list(obs.SURFACES) == taxonomy["surface"]
    assert list(obs.PLATFORMS) == taxonomy["platform"]


# --- Scrubbing (§7.5) -----------------------------------------------------


def test_scrub_remove_locais_do_frame():
    """O vazamento mais provável: `resume_json` e `ctx` são locais do frame de
    execute_apply, e o sentry-sdk manda locais por padrão."""
    event = obs.scrub_event(
        {
            "exception": {
                "values": [
                    {
                        "stacktrace": {
                            "frames": [
                                {
                                    "function": "execute_apply",
                                    "vars": {"resume_json": '{"nome": "Fulano"}'},
                                }
                            ]
                        }
                    }
                ]
            }
        }
    )
    frame = event["exception"]["values"][0]["stacktrace"]["frames"][0]
    assert "vars" not in frame
    assert frame["function"] == "execute_apply"


def test_scrub_redige_chaves_sensiveis_em_profundidade():
    event = obs.scrub_event(
        {
            "extra": {
                "campaign_id": "abc",
                "resume": {"personal_info": {"email": "a@b.com"}},
                "nested": [{"authorization": "Bearer x", "safe": 1}],
                # O prompt do browser-use inteiro
                "task": "Você está numa página do linkedin... Currículo (JSON): {...}",
            }
        }
    )
    assert event["extra"]["campaign_id"] == "abc"
    assert event["extra"]["resume"] == "[Filtered]"
    assert event["extra"]["task"] == "[Filtered]"
    assert event["extra"]["nested"][0]["authorization"] == "[Filtered]"
    assert event["extra"]["nested"][0]["safe"] == 1


def test_scrub_descarta_request_e_reduz_user_ao_id():
    event = obs.scrub_event(
        {
            "request": {"data": {"storageStatePath": "/home/u/sessions/linkedin"}},
            "user": {"id": "uuid-1", "email": "a@b.com", "ip_address": "1.2.3.4"},
        }
    )
    assert "request" not in event
    assert event["user"] == {"id": "uuid-1"}


def test_scrub_nao_estoura_com_estrutura_profunda():
    deep: dict = {"safe": 1}
    for _ in range(50):
        deep = {"level": deep}
    assert obs.scrub_event({"extra": deep}) is not None


def test_job_ref_e_estavel_e_nao_reversivel():
    ref = obs.job_ref("https://www.linkedin.com/jobs/view/123")
    assert ref == obs.job_ref("https://www.linkedin.com/jobs/view/123")
    assert ref != obs.job_ref("https://www.linkedin.com/jobs/view/456")
    assert "linkedin" not in ref


# --- ADR-04: quem é erro de negócio ---------------------------------------


def test_erros_de_negocio_compartilham_a_base_que_o_orchestrator_filtra():
    assert issubclass(SessionInvalidError, BusinessError)
    assert issubclass(CampaignMisconfiguredError, BusinessError)
    # Quebra de seletor NÃO é negócio: tem que chegar no Sentry.
    assert not issubclass(SelectorNotFoundError, BusinessError)


def test_selector_not_found_carrega_a_chave_para_o_fingerprint():
    exc = SelectorNotFoundError("APPLY_BUTTON", step="apply_open", platform="linkedin")
    assert exc.selector_key == "APPLY_BUTTON"
    assert exc.step == "apply_open"
    assert exc.platform == "linkedin"
    assert "APPLY_BUTTON" in str(exc)


# --- Init (§6.2) ----------------------------------------------------------


@pytest.fixture
def restore_global_client():
    """`sentry_sdk.init` liga o cliente GLOBAL — sem restaurar, o cliente de teste
    vazaria para os testes seguintes (e para qualquer coisa que rode depois)."""
    previous = sentry_sdk.get_global_scope().client
    yield
    sentry_sdk.get_global_scope().set_client(previous)


def test_init_e_no_op_sem_dsn(monkeypatch):
    """Sem DSN o SDK não sobe — é assim que o toggle de consentimento desliga o
    engine: o Electron simplesmente não passa a variável (§7.7)."""
    monkeypatch.delenv("SENTRY_DSN_RUNNER", raising=False)
    assert obs.init_observability() is False


def test_init_aplica_as_opcoes_que_impedem_o_vazamento(monkeypatch, restore_global_client):
    """A guarda mais importante do módulo. Se alguém remover uma destas opções do
    init, o currículo volta a poder sair da máquina — e nada mais no sistema
    reclamaria (§7.2)."""
    monkeypatch.setenv("SENTRY_DSN_RUNNER", "https://key@example.invalid/1")
    monkeypatch.setenv("SENTRY_RELEASE", "apliquefy-runner@9.9.9")

    with sentry_sdk.isolation_scope():
        assert obs.init_observability() is True
        options = sentry_sdk.get_client().options

        assert options["include_local_variables"] is False
        assert options["auto_enabling_integrations"] is False
        assert options["max_request_body_size"] == "never"
        assert options["send_default_pii"] is False
        assert options["before_send"] is obs.scrub_event
        # Release health é do Electron; run de campanha não é sessão de app.
        assert options["auto_session_tracking"] is False
        # Tracing custa cota e não há gargalo de latência conhecido (§13).
        assert options["traces_sample_rate"] == 0
        assert options["release"] == "apliquefy-runner@9.9.9"


# --- Fingerprint (§6.5) ---------------------------------------------------


class _MemoryTransport(sentry_sdk.transport.Transport):
    """Transport in-process: recebe o envelope já com o before_send aplicado, que
    é exatamente o payload que sairia pela rede."""

    def __init__(self, events: list[dict]) -> None:
        super().__init__({})
        self.events = events

    def capture_envelope(self, envelope) -> None:
        for item in envelope.items:
            if item.headers.get("type") == "event":
                self.events.append(item.payload.json)


@pytest.fixture
def captured():
    events: list[dict] = []
    client = sentry_sdk.Client(
        dsn="https://key@example.invalid/1",
        transport=_MemoryTransport(events),
        before_send=obs.scrub_event,
        include_local_variables=False,
        auto_enabling_integrations=False,
        default_integrations=False,
        auto_session_tracking=False,
    )
    with sentry_sdk.isolation_scope() as scope:
        scope.set_client(client)
        yield events


def test_selector_break_agrupa_por_plataforma_passo_e_seletor(captured):
    obs.capture_selector_break("apply_open", "APPLY_BUTTON", "linkedin", total_jobs=12)
    sentry_sdk.get_client().flush()

    assert len(captured) == 1
    event = captured[0]
    assert event["fingerprint"] == ["selector", "linkedin", "apply_open", "APPLY_BUTTON"]
    assert event["tags"]["selector_key"] == "APPLY_BUTTON"
    assert event["contexts"]["automation"]["total_jobs"] == 12


def test_selectors_diferentes_geram_fingerprints_diferentes(captured):
    obs.capture_selector_break("job_search", "JOB_CARD", "linkedin")
    obs.capture_selector_break("apply_open", "APPLY_BUTTON", "linkedin")
    sentry_sdk.get_client().flush()

    assert captured[0]["fingerprint"] != captured[1]["fingerprint"]


def test_run_crash_com_selector_key_usa_o_fingerprint_do_seletor(captured):
    obs.capture_run_crash(
        SelectorNotFoundError("JOB_CARD", step="job_search", platform="infojobs")
    )
    sentry_sdk.get_client().flush()

    assert captured[0]["fingerprint"] == ["selector", "infojobs", "job_search", "JOB_CARD"]


def test_run_crash_generico_usa_agrupamento_padrao(captured):
    obs.capture_run_crash(RuntimeError("boom"))
    sentry_sdk.get_client().flush()

    assert "fingerprint" not in captured[0]


def test_agent_crash_agrupa_por_tipo_de_excecao(captured):
    obs.capture_agent_crash(TimeoutError("x"), "linkedin", job_ref="abc123")
    sentry_sdk.get_client().flush()

    assert captured[0]["fingerprint"] == ["apply_agent", "linkedin", "TimeoutError"]
    assert captured[0]["tags"]["automation_step"] == "apply_agent"


def test_evento_do_agent_crash_nao_carrega_locais_do_frame(captured):
    """Ponta a ponta do §7.2: uma exceção levantada num frame que tem o currículo
    como variável local não pode chegar ao transport carregando esse valor.

    O e-mail é montado por concatenação de propósito. O Sentry envia as linhas de
    CÓDIGO-FONTE do frame (`pre_context`/`context_line`/`post_context`) — o que é
    inócuo, é o nosso próprio repositório — então um literal escrito aqui apareceria
    no payload como fonte e o teste passaria a medir a coisa errada. O que precisa
    sumir é o VALOR em runtime.
    """
    email = "vitima" + "@" + "exemplo.com"

    def frame_com_curriculo():
        resume_json = json.dumps({"personalInfo": {"email": email}})  # noqa: F841
        raise ValueError("boom")

    try:
        frame_com_curriculo()
    except ValueError as exc:
        obs.capture_agent_crash(exc, "linkedin")

    sentry_sdk.get_client().flush()
    payload = json.dumps(captured[0])
    assert "vitima@exemplo.com" not in payload

    frames = captured[0]["exception"]["values"][0]["stacktrace"]["frames"]
    assert frames, "sanidade: o evento tem stack trace"
    assert all("vars" not in frame for frame in frames)
