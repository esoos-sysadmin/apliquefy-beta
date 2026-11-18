"""Worker da nuvem: matching (termos, local, remoto, limite do dia) e o ciclo de uma
candidatura (§7.4) com o navegador e a web falsos. O que importa é dinheiro e privacidade:
débito só depois de `applied`, uma vez; PDF apagado e lock solto em qualquer desfecho."""
from __future__ import annotations

import os

import pytest

from rpa_engine.cloud import apply as apply_mod
from rpa_engine.cloud.form_run import FormResult
from rpa_engine.cloud.matching import location_matches, match_and_enqueue, title_matches


# ── matching ────────────────────────────────────────────────────────────────

def test_title_matches_content_words_any_order_and_accents() -> None:
    terms = ["engenheiro de dados", "data engineer"]
    assert title_matches("Engenheiro(a) de Dados Sênior", terms)
    assert title_matches("Senior Data Engineer", terms)
    assert not title_matches("Analista de Dados", terms)
    assert not title_matches("Engenheiro Civil", terms)


def _p(location: str | None, remote: bool | None = None) -> dict:
    return {"location": location, "isRemote": remote}


def test_location_matches() -> None:
    assert location_matches(_p("Recife, PE"), "Recife", remote_only=False)
    assert not location_matches(_p("São Paulo"), "Recife", remote_only=False)
    assert location_matches(_p("Remote - Brazil", True), "Recife", remote_only=False)
    assert location_matches(_p("Remote", True), "Recife", remote_only=True)
    # remoto, mas só para quem mora nos EUA: não serve para o usuário daqui
    assert not location_matches(_p("Remote - US", True), None, remote_only=True)
    assert not location_matches(_p("Recife, PE", False), "Recife", remote_only=True)
    assert location_matches(_p("San Francisco"), None, remote_only=False)  # sem filtro de local


class MatchClient:
    def __init__(self, candidates: list[dict], conflict: set[str] = frozenset()) -> None:
        self._cands, self.conflict = candidates, conflict
        self.asked_ats: list[str] = []
        self.enqueued: list[str] = []

    async def candidates(self, user_id, ats, limit=1000, terms=None):
        self.asked_ats, self.asked_terms = ats, terms
        return self._cands

    async def enqueue(self, *, user_id, campaign_id, job_posting_id, run_after=None):
        self.enqueued.append(job_posting_id)
        return None if job_posting_id in self.conflict else {"id": "a-" + job_posting_id}


CAMPAIGN = {
    "campaignId": "c1", "userId": "u1", "remainingToday": 2,
    "config": {"searchTerms": "engenheiro de dados, data engineer", "locationTerm": "Recife",
               "remoteOnly": False, "atsAllowlist": ["greenhouse", "lever"], "fitMinScore": 0},
}


async def test_match_and_enqueue_respects_allowlist_supported_and_daily_limit() -> None:
    cands = [
        {"id": "p1", "title": "Data Engineer", "location": "Recife", "isRemote": False},
        {"id": "p2", "title": "Engenheiro de Dados", "location": "Remote - Brazil", "isRemote": True},
        {"id": "p3", "title": "Data Engineer", "location": "Recife", "isRemote": False},
        {"id": "p4", "title": "Designer", "location": "Recife", "isRemote": False},
    ]
    client = MatchClient(cands, conflict={"p1"})
    n = await match_and_enqueue(client, CAMPAIGN, supported={"greenhouse"})
    assert client.asked_ats == ["greenhouse"]  # allowlist ∩ suportados
    assert client.asked_terms == "engenheiro de dados, data engineer"  # pré-filtro no banco
    assert client.enqueued == ["p1", "p2", "p3"]  # 409 do p1 não conta no limite
    assert n == 2


async def test_match_skips_when_nothing_supported_or_no_room() -> None:
    client = MatchClient([{"id": "p1", "title": "Data Engineer", "location": "Recife"}])
    assert await match_and_enqueue(client, {**CAMPAIGN, "config": {**CAMPAIGN["config"], "atsAllowlist": ["lever"]}},
                                   supported={"greenhouse"}) == 0
    assert await match_and_enqueue(client, {**CAMPAIGN, "remainingToday": 0}, supported={"greenhouse"}) == 0
    assert client.enqueued == []


# ── ciclo de uma candidatura ────────────────────────────────────────────────

ITEM = {
    "application": {"id": "a1", "userId": "u1", "campaignId": "c1", "attempts": 1, "ats": "greenhouse"},
    "posting": {"id": "p1", "applyUrl": "https://job-boards.greenhouse.io/embed/job_app?for=acme&token=9",
                "ats": "greenhouse", "boardToken": "acme", "externalId": "9", "title": "Dados", "companyName": "Acme"},
    "campaign": {"id": "c1", "userId": "u1", "resumeId": "r1", "config": {}},
}


class ApplyClient:
    def __init__(self) -> None:
        self.calls: list[tuple] = []

    async def resume(self, user_id, resume_id):
        self.calls.append(("resume", user_id, resume_id))
        return {"personalInfo": {"name": "Ana Souza", "email": "a@x"}, "experience": []}

    async def resume_pdf(self, user_id, resume_id):
        return b"%PDF-1.4"

    async def patch_application(self, user_id, application_id, **fields):
        self.calls.append(("patch", fields))
        return {}

    async def debit_flat(self, *, user_id, campaign_id, application_id, questions=0):
        self.calls.append(("debit", application_id, questions))
        return {}


@pytest.fixture
def run(monkeypatch: pytest.MonkeyPatch):
    """Roda o ciclo com `run_form` e a pré-checagem trocados; devolve (client, pdf_paths)."""
    seen_pdfs: list[str] = []

    async def go(result: FormResult | Exception, missing: list[str] | None = None):
        async def fake_precheck_greenhouse(http, posting, answerer, resume):
            return missing or []

        async def fake_run_form(bb, adapter, url, resume, pdf, answerer, *, submit=True, handoff=None):
            seen_pdfs.append(pdf)
            assert os.path.exists(pdf)
            if isinstance(result, Exception):
                raise result
            return result

        monkeypatch.setattr(apply_mod, "precheck_posting", fake_precheck_greenhouse)
        monkeypatch.setattr(apply_mod, "run_form", fake_run_form)
        client = ApplyClient()
        outcome = await apply_mod.process(ITEM, client=client, bb=object(), http=object(), ask=None)
        return outcome, client, seen_pdfs

    return go


def _patches(client: ApplyClient) -> list[dict]:
    return [c[1] for c in client.calls if c[0] == "patch"]


async def test_submitted_patches_applied_then_debits_once(run) -> None:
    outcome, client, pdfs = await run(FormResult("submitted", questions=2))
    assert outcome == "applied"
    kinds = [c[0] for c in client.calls]
    assert kinds.index("patch") < kinds.index("debit")  # débito só depois de applied
    assert _patches(client) == [{"status": "applied"}]
    assert [c for c in client.calls if c[0] == "debit"] == [("debit", "a1", 2)]
    assert not os.path.exists(pdfs[0])


@pytest.mark.parametrize("result, log", [
    (FormResult("missing", "Pretensão salarial"), "PERGUNTA: Pretensão salarial"),
    (FormResult("blocked", "greenhouse"), "BLOQUEIO: greenhouse"),
    (FormResult("validation", "Email is invalid"), "FORMULÁRIO: Email is invalid"),
    (FormResult("challenge", "captcha"), "DESAFIO: captcha"),
])
async def test_non_success_fails_without_debit(run, result, log) -> None:
    outcome, client, pdfs = await run(result)
    assert outcome == "failed"
    assert _patches(client) == [{"status": "failed", "errorLog": log}]
    assert not any(c[0] == "debit" for c in client.calls)
    assert not os.path.exists(pdfs[0])


async def test_precheck_missing_fails_before_browser(run) -> None:
    outcome, client, pdfs = await run(FormResult("submitted"), missing=["Cover Letter"])
    assert outcome == "failed"
    assert pdfs == []  # nem abriu sessão nem gravou PDF
    assert _patches(client) == [{"status": "failed", "errorLog": "PERGUNTA: Cover Letter"}]


async def test_crash_releases_lock_and_deletes_pdf(run) -> None:
    outcome, client, pdfs = await run(RuntimeError("cdp caiu com dado sensível"))
    assert outcome == "retry"
    # volta para a fila (attempts já contou no claim); a mensagem do erro não vai para a web
    assert [{k: v for k, v in p.items() if k != "runAfter"} for p in _patches(client)] == [{"errorLog": "ERRO: RuntimeError"}]
    assert not any(c[0] == "debit" for c in client.calls)
    assert not os.path.exists(pdfs[0])


async def test_unknown_ats_fails_without_browser(run, monkeypatch: pytest.MonkeyPatch) -> None:
    item = {**ITEM, "posting": {**ITEM["posting"], "ats": "gupy"}}  # exige conta: Fase 7
    client = ApplyClient()
    assert await apply_mod.process(item, client=client, bb=object(), http=object(), ask=None) == "failed"
    assert _patches(client) == [{"status": "failed", "errorLog": "SEM ADAPTER: gupy"}]


async def test_fill_slots_claims_only_free_slots_of_supported_ats() -> None:
    import asyncio

    from rpa_engine.cloud.__main__ import fill_slots

    asked = []

    class C:
        async def claim(self, worker_id, limit, ats):
            asked.append((worker_id, limit, ats))
            return [{"n": i} for i in range(limit)]

    gate = asyncio.Event()
    started = []

    async def work(item):
        started.append(item["n"])
        await gate.wait()

    tasks: set = set()
    assert await fill_slots(C(), tasks, worker_id="w", concurrency=3, supported={"lever", "greenhouse"}, work=work) == 3
    assert asked == [("w", 3, ["greenhouse", "lever"])]
    assert await fill_slots(C(), tasks, worker_id="w", concurrency=3, supported={"greenhouse"}, work=work) == 0
    assert len(asked) == 1  # sem vaga livre, nem chama o claim
    gate.set()
    await asyncio.gather(*tasks)


# ── revisão final ───────────────────────────────────────────────────────────

async def test_greenhouse_url_is_rebuilt_from_ids_not_trusted(run, monkeypatch) -> None:
    urls = []

    async def fake_run_form(bb, adapter, url, resume, pdf, answerer, *, submit=True, handoff=None):
        urls.append(url)
        return FormResult("submitted")

    async def no_precheck(*a):
        return []

    monkeypatch.setattr(apply_mod, "run_form", fake_run_form)
    monkeypatch.setattr(apply_mod, "precheck_posting", no_precheck)
    item = {**ITEM, "posting": {**ITEM["posting"], "applyUrl": "https://boards.greenhouse.io.evil.example/acme/jobs/9"}}
    assert await apply_mod.process(item, client=ApplyClient(), bb=object(), http=object(), ask=None) == "applied"
    assert urls == ["https://job-boards.greenhouse.io/embed/job_app?for=acme&token=9"]


async def test_untrusted_url_without_ids_fails_without_browser(monkeypatch) -> None:
    async def boom(*a, **k):
        raise AssertionError("não pode abrir o navegador")

    monkeypatch.setattr(apply_mod, "run_form", boom)
    item = {**ITEM, "posting": {**ITEM["posting"], "boardToken": None, "externalId": None,
                                "applyUrl": "https://boards.greenhouse.io.evil.example/acme/jobs/9"}}
    client = ApplyClient()
    assert await apply_mod.process(item, client=client, bb=object(), http=object(), ask=None) == "failed"
    assert _patches(client) == [{"status": "failed", "errorLog": "URL: fora do domínio do ATS"}]


async def test_patch_applied_failure_is_retried_never_resubmitted(run, monkeypatch) -> None:
    monkeypatch.setattr(apply_mod.asyncio, "sleep", _no_sleep)
    sent = []

    async def fake_run_form(bb, adapter, url, resume, pdf, answerer, *, submit=True, handoff=None):
        sent.append(url)
        return FormResult("submitted")

    async def no_precheck(*a):
        return []

    class Flaky(ApplyClient):
        fails = 1

        async def patch_application(self, user_id, application_id, **fields):
            if fields.get("status") == "applied" and Flaky.fails:
                Flaky.fails -= 1
                raise RuntimeError("504")
            return await super().patch_application(user_id, application_id, **fields)

    monkeypatch.setattr(apply_mod, "run_form", fake_run_form)
    monkeypatch.setattr(apply_mod, "precheck_posting", no_precheck)
    client = Flaky()
    assert await apply_mod.process(ITEM, client=client, bb=object(), http=object(), ask=None) == "applied"
    assert _patches(client) == [{"status": "applied"}]  # nenhum release: o item não volta à fila
    assert len(sent) == 1
    assert any(c[0] == "debit" for c in client.calls)


async def test_crash_release_backs_off(run) -> None:
    outcome, client, _ = await run(RuntimeError("x"))
    patch = _patches(client)[0]
    assert patch["errorLog"] == "ERRO: RuntimeError"
    assert "runAfter" in patch  # sem backoff, uma queda de 1 min queimava as 3 tentativas


async def _no_sleep(*a, **k):
    return None


# ── handoff (Fase 3, §8) ────────────────────────────────────────────────────

class FakeBB:
    async def live_view_url(self, session_id):
        return f"https://live/{session_id}"


async def _handoff_run(monkeypatch, confirms: list[bool], minutes: float = 10):
    """run_form falso que cai em desafio e chama o handoff; `confirms` = o que a página
    mostra a cada checagem. O relógio anda 5 s por sleep (sem esperar de verdade)."""
    clock = [0.0]

    async def fake_sleep(s, *a, **k):
        clock[0] += s

    monkeypatch.setattr(apply_mod.asyncio, "sleep", fake_sleep)
    monkeypatch.setattr(apply_mod.time, "monotonic", lambda: clock[0])
    checks = iter(confirms)

    async def confirmed():
        return next(checks, False)

    async def fake_run_form(bb, adapter, url, resume, pdf, answerer, *, submit=True, handoff=None):
        assert handoff is not None
        ok = await handoff("s1", confirmed)
        return FormResult("submitted", "handoff", 1) if ok else FormResult("handoff", "tempo esgotado")

    async def no_precheck(*a):
        return []

    monkeypatch.setattr(apply_mod, "run_form", fake_run_form)
    monkeypatch.setattr(apply_mod, "precheck_posting", no_precheck)
    client = ApplyClient()
    outcome = await apply_mod.process(ITEM, client=client, bb=FakeBB(), http=object(), ask=None, handoff_min=minutes)
    return outcome, client, clock[0]


async def test_handoff_resolved_by_user_applies_and_debits_once(monkeypatch) -> None:
    outcome, client, _ = await _handoff_run(monkeypatch, [False, False, True])
    assert outcome == "applied"
    first, *rest = _patches(client)
    assert first["status"] == "needs_user" and first["liveViewUrl"] == "https://live/s1"
    assert first["needsUserUntil"]  # a web mostra a contagem regressiva
    assert rest == [{"status": "applied"}]
    assert [c for c in client.calls if c[0] == "debit"] == [("debit", "a1", 1)]


async def test_handoff_timeout_fails_without_debit(monkeypatch) -> None:
    outcome, client, elapsed = await _handoff_run(monkeypatch, [], minutes=1)
    assert outcome == "failed"
    assert _patches(client)[-1] == {"status": "failed", "errorLog": "HANDOFF: tempo esgotado"}
    assert not any(c[0] == "debit" for c in client.calls)
    assert 60 <= elapsed <= 65  # espera o prazo, não mais


async def test_handoff_off_when_timeout_is_zero(run) -> None:
    # HANDOFF_TIMEOUT_MIN=0 desliga: desafio volta a ser falha direta.
    outcome, client, _ = await run(FormResult("challenge", "captcha"))
    assert _patches(client) == [{"status": "failed", "errorLog": "DESAFIO: captcha"}]


async def test_sweep_runs_on_its_own_schedule() -> None:
    from rpa_engine.cloud.internal_client import InternalClient
    import httpx

    seen = []

    def handler(request: httpx.Request) -> httpx.Response:
        seen.append((request.method, request.url.path))
        return httpx.Response(200, json={"data": {"failed": 2}})

    client = InternalClient("https://app.example", "t", transport=httpx.MockTransport(handler))
    assert await client.sweep() == 2
    assert seen == [("POST", "/api/internal/applications/sweep")]
    await client.aclose()


async def test_handoff_checks_one_last_time_at_the_deadline(monkeypatch) -> None:
    # 1 min / 5 s = 12 checagens falsas; a 13ª, no prazo, vê a tela de sucesso.
    outcome, client, _ = await _handoff_run(monkeypatch, [False] * 12 + [True], minutes=1)
    assert outcome == "applied"
    assert [c for c in client.calls if c[0] == "debit"] == [("debit", "a1", 1)]


def test_handoff_pins_navigation_to_the_ats() -> None:
    # Navegar para fora do ATS no live view esconderia a tela de sucesso (envio sem débito).
    from rpa_engine.cloud.form_run import leaves_ats

    assert not leaves_ats("https://job-boards.greenhouse.io/embed/job_app/confirmation", "greenhouse")
    assert not leaves_ats("https://boards.greenhouse.io/acme/jobs/1", "greenhouse")
    assert leaves_ats("https://google.com/", "greenhouse")
    assert leaves_ats("https://greenhouse.io.evil.example/", "greenhouse")
    assert not leaves_ats("https://jobs.lever.co/acme/1/thanks", "lever")


# ── Fase 4: Lever, Ashby e agente genérico ─────────────────────────────────

def test_lever_and_ashby_have_deterministic_adapters() -> None:
    from rpa_engine.cloud.adapters.base import classify_page_text

    lever, ashby = apply_mod.ADAPTERS["lever"], apply_mod.ADAPTERS["ashby"]
    assert classify_page_text("https://jobs.lever.co/acme/1/thanks", "", lever.success) == "submitted"
    assert classify_page_text("https://jobs.ashbyhq.com/acme/1", "Thank you for applying!", ashby.success) == "submitted"
    assert "Submit Application" in ashby.submit_selector


WORKABLE = {**ITEM, "posting": {**ITEM["posting"], "ats": "workable", "boardToken": "acme", "externalId": "J1",
                                "applyUrl": "https://apply.workable.com/acme/j/J1/apply"}}


async def _agent_run(monkeypatch, result: FormResult):
    seen = {}

    async def fake_agent(bb, ats, url, resume, pdf, job_title=None):
        seen.update(ats=ats, url=url, pdf_exists=os.path.exists(pdf))
        return result

    async def boom(*a, **k):
        raise AssertionError("ATS genérico não passa pelo adapter")

    monkeypatch.setattr(apply_mod, "run_agent", fake_agent)
    monkeypatch.setattr(apply_mod, "run_form", boom)
    client = ApplyClient()
    outcome = await apply_mod.process(WORKABLE, client=client, bb=object(), http=object(), ask=None)
    return outcome, client, seen


async def test_generic_ats_goes_to_the_agent_and_debits_on_success(monkeypatch) -> None:
    outcome, client, seen = await _agent_run(monkeypatch, FormResult("submitted", questions=3))
    assert outcome == "applied"
    assert seen == {"ats": "workable", "url": "https://apply.workable.com/acme/j/J1/apply", "pdf_exists": True}
    assert [c for c in client.calls if c[0] == "debit"] == [("debit", "a1", 3)]


@pytest.mark.parametrize("result, log", [
    (FormResult("agent", "botão travou"), "AGENTE: botão travou"),
    (FormResult("missing", "Possui CNH?"), "PERGUNTA: Possui CNH?"),
])
async def test_generic_ats_agent_failure_does_not_charge(monkeypatch, result, log) -> None:
    outcome, client, _ = await _agent_run(monkeypatch, result)
    assert outcome == "failed"
    assert _patches(client) == [{"status": "failed", "errorLog": log}]
    assert not any(c[0] == "debit" for c in client.calls)


def test_agent_result_mapping() -> None:
    from rpa_engine.cloud.agent import agent_result
    from rpa_engine.runtime.apply_agent import AgentRun
    from rpa_engine.runtime.state_machine import Outcome

    assert agent_result(AgentRun(Outcome.SUCCESS, None, 2, 9)) == FormResult("submitted", "", 2)
    assert agent_result(AgentRun(Outcome.SKIP_UNANSWERABLE, "ELEGIBILIDADE: Possui CNH?", 0, 5)) == \
        FormResult("missing", "Possui CNH?", 0)
    assert agent_result(AgentRun(Outcome.PAUSE_RETRY, "agent crashed: x", 0, 0)).outcome == "agent"


def test_agent_task_keeps_answer_rules_and_never_logs_in() -> None:
    from rpa_engine.cloud.agent import build_task
    from rpa_engine.runtime.apply_agent import ANSWER_RULES

    task = build_task("workable", {"personalInfo": {"name": "Ana", "linkedin": "https://linkedin.com/in/ana"}}, "Dev")
    assert ANSWER_RULES in task
    assert "upload_file" in task and "login" in task.lower()
    assert "https://apply.workable.com" not in task  # a URL vai como ação inicial, não no texto


# ── Fase 5: fit gate por texto (ADR-07) ─────────────────────────────────────

class FitClient(MatchClient):
    def __init__(self, candidates, descriptions):
        super().__init__(candidates)
        self.descriptions, self.patched, self.skip_reason = descriptions, [], {}

    async def enqueue(self, *, user_id, campaign_id, job_posting_id, run_after=None, skip_reason=None):
        self.skip_reason[job_posting_id] = skip_reason
        return await super().enqueue(user_id=user_id, campaign_id=campaign_id, job_posting_id=job_posting_id)

    async def posting_description(self, posting_id):
        return self.descriptions[posting_id]

    async def resume(self, user_id, resume_id):
        return {"personalInfo": {"name": "Ana"}, "experience": []}

    async def patch_application(self, user_id, application_id, **fields):
        self.patched.append((application_id, fields))


async def test_fit_gate_skips_before_queue_without_using_daily_room() -> None:
    from rpa_engine.runtime.fit_gate import FitVerdict

    cands = [{"id": f"p{i}", "title": "Data Engineer", "location": "Recife"} for i in (1, 2, 3)]
    client = FitClient(cands, {"p1": "ruim", "p2": "boa", "p3": "boa"})
    seen = []

    async def score(description, resume, posting):
        seen.append(description)
        return FitVerdict(score=30 if description == "ruim" else 90, reason="pouco a ver")

    campaign = {**CAMPAIGN, "resumeId": "r1", "config": {**CAMPAIGN["config"], "fitMinScore": 70}}
    assert await match_and_enqueue(client, campaign, supported={"greenhouse"}, score=score) == 2
    assert client.enqueued == ["p1", "p2", "p3"]
    # reprovada nasce skipped numa escrita só: se a rede cair, nada fica na fila para enviar
    assert client.skip_reason == {"p1": "FIT: aderência 30/100 — pouco a ver", "p2": None, "p3": None}
    assert client.patched == []


async def test_fit_gate_off_by_default_never_scores() -> None:
    async def score(*a):
        raise AssertionError("gate desligado não chama o LLM")

    client = FitClient([{"id": "p1", "title": "Data Engineer", "location": "Recife"}], {})
    assert await match_and_enqueue(client, CAMPAIGN, supported={"greenhouse"}, score=score) == 1


async def test_score_text_fails_open() -> None:
    from rpa_engine.runtime.fit_gate import score_text

    class Boom:
        async def ainvoke(self, *a, **k):
            raise RuntimeError("fora do ar")

    assert await score_text("x" * 500, {}, llm=Boom(), platform="ats", job_title="Dev") is None
    assert await score_text("curta", {}, llm=Boom(), platform="ats", job_title="Dev") is None
