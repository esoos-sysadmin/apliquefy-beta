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

        async def fake_run_form(bb, adapter, url, resume, pdf, answerer, *, submit=True):
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
    item = {**ITEM, "posting": {**ITEM["posting"], "ats": "workable"}}
    client = ApplyClient()
    assert await apply_mod.process(item, client=client, bb=object(), http=object(), ask=None) == "failed"
    assert _patches(client) == [{"status": "failed", "errorLog": "SEM ADAPTER: workable"}]


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

    async def fake_run_form(bb, adapter, url, resume, pdf, answerer, *, submit=True):
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

    async def fake_run_form(bb, adapter, url, resume, pdf, answerer, *, submit=True):
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
