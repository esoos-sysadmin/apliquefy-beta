"""Descoberta da nuvem: normalização das fontes, boards novos vindos do Apify e o
cliente das rotas internas (token, lotes de 500, 409)."""
from __future__ import annotations

import json

import httpx
import pytest

from rpa_engine.cloud.config import load_cloud_settings
from rpa_engine.cloud.discovery.apify import board_of, normalize_item
from rpa_engine.cloud.discovery.ats_sources import from_ashby, from_greenhouse, from_lever
from rpa_engine.cloud.internal_client import InternalClient


def test_greenhouse_posting_uses_canonical_and_embed() -> None:
    job = {
        "id": 123, "title": " Engenheiro de Dados ", "absolute_url": "https://acme.com/careers?gh_jid=123",
        "location": {"name": "Remote - Brazil"}, "content": "&lt;p&gt;Vaga &amp;amp; dados&lt;/p&gt;",
        "first_published": "2026-11-10T10:00:00-03:00",
    }
    p = from_greenhouse(job, "acme", "Acme")
    assert p["canonicalUrl"] == "https://greenhouse.io/acme/jobs/123"  # não o site da empresa
    assert p["applyUrl"] == "https://job-boards.greenhouse.io/embed/job_app?for=acme&token=123"
    assert p["title"] == "Engenheiro de Dados"
    assert p["isRemote"] is True
    assert p["description"] == "Vaga & dados"
    assert p["postedAt"] == "2026-11-10T10:00:00-03:00"
    assert p["source"] == "ats_api" and p["ats"] == "greenhouse" and p["boardToken"] == "acme"


def test_lever_and_ashby_postings() -> None:
    lever = from_lever({
        "id": "abc", "text": "Data Engineer", "hostedUrl": "https://jobs.lever.co/acme/abc",
        "applyUrl": "https://jobs.lever.co/acme/abc/apply", "categories": {"location": "São Paulo"},
        "workplaceType": "remote", "descriptionPlain": "x", "createdAt": 1762770000000,
    }, "acme", "Acme")
    assert lever["canonicalUrl"] == "https://jobs.lever.co/acme/abc"
    assert lever["isRemote"] is True and lever["workplaceType"] == "remote"
    unspecified = from_lever({"id": "z", "text": "Dev", "hostedUrl": "https://jobs.lever.co/acme/z",
                              "categories": {}, "workplaceType": "unspecified"}, "acme", "Acme")
    assert "workplaceType" not in unspecified  # NULL = não informado: a chave nem vai no upsert
    assert lever["postedAt"].startswith("2025-")
    ashby = from_ashby({
        "id": "u1", "title": "Dev", "jobUrl": "https://jobs.ashbyhq.com/acme/u1", "location": "Recife",
        "isRemote": False, "descriptionPlain": "d", "publishedAt": "2026-11-01T00:00:00Z",
    }, "acme", "Acme")
    assert ashby["applyUrl"] == "https://jobs.ashbyhq.com/acme/u1/application"
    assert ashby["isRemote"] is False and "workplaceType" not in ashby
    base = {"id": "u2", "title": "Dev", "jobUrl": "https://jobs.ashbyhq.com/acme/u2", "location": "X", "descriptionPlain": "d"}
    assert from_ashby({**base, "workplaceType": "OnSite", "isRemote": False}, "acme", None)["workplaceType"] == "onsite"
    assert from_ashby({**base, "workplaceType": "Hybrid"}, "acme", None)["workplaceType"] == "hybrid"
    assert from_ashby({**base, "isRemote": True}, "acme", None)["workplaceType"] == "remote"  # fallback
    gh = from_greenhouse({"id": 1, "title": "Dev", "location": {"name": "São Paulo (Hybrid)"}, "content": ""}, "acme", None)
    assert gh["workplaceType"] == "hybrid"


def test_apify_item_keeps_only_ats_apply_urls() -> None:
    item = {
        "id": "42", "title": "Engenheiro de Dados", "company": {"name": "Acme"},
        "location": {"linkedinText": "Recife, PE"}, "descriptionText": "texto",
        "applyMethod": {"companyApplyUrl": "https://job-boards.greenhouse.io/acme/jobs/9?gh_src=li"},
        "workplaceType": "remote", "postedDate": "2026-11-10T00:00:00.000Z",
    }
    p = normalize_item(item)
    assert p["canonicalUrl"] == "https://greenhouse.io/acme/jobs/9"
    assert p["ats"] == "greenhouse" and p["source"] == "apify_linkedin" and p["sourceRef"] == "42"
    assert p["isRemote"] is True and p["location"] == "Recife, PE" and p["workplaceType"] == "remote"
    assert normalize_item({**item, "workplaceType": "on-site"})["workplaceType"] == "onsite"
    no_kind = normalize_item({**item, "workplaceType": None, "workRemoteAllowed": False})
    assert "workplaceType" not in no_kind  # sem informação nem no texto do local
    # Easy Apply / site próprio: fica fora (LinkedIn é do desktop)
    assert normalize_item({**item, "applyMethod": {"companyApplyUrl": None}}) is None
    assert normalize_item({**item, "applyMethod": {"companyApplyUrl": "https://acme.com/vaga"}}) is None


def test_board_of() -> None:
    assert board_of("https://job-boards.greenhouse.io/embed/job_app?for=acme&token=9") == ("greenhouse", "acme")
    assert board_of("https://jobs.lever.co/acme/abc") == ("lever", "acme")
    assert board_of("https://jobs.ashbyhq.com/acme/u1/application") == ("ashby", "acme")
    assert board_of("https://portal.gupy.io/x") is None


def test_settings_defaults(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("APLIQUEFY_WEB_URL", "https://app.example/")
    monkeypatch.setenv("WORKER_API_TOKEN", "t" * 32)
    for k in ("SUPPORTED_ATS", "ATS_PROXY", "WORKER_CONCURRENCY", "WORKER_ID"):
        monkeypatch.delenv(k, raising=False)
    s = load_cloud_settings()
    assert s.web_url == "https://app.example"
    assert s.supported_ats == {"greenhouse"}
    assert s.ats_proxy == {"greenhouse", "ashby"}
    assert s.concurrency == 2 and s.worker_id


def test_settings_require_token(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("APLIQUEFY_WEB_URL", "https://app.example")
    monkeypatch.delenv("WORKER_API_TOKEN", raising=False)
    with pytest.raises(RuntimeError):
        load_cloud_settings()


async def test_internal_client_token_batches_and_409() -> None:
    calls: list[httpx.Request] = []

    def handler(request: httpx.Request) -> httpx.Response:
        calls.append(request)
        if request.url.path == "/api/internal/postings/upsert":
            n = len(json.loads(request.content)["postings"])
            return httpx.Response(200, json={"data": {"upserted": n, "created": n}})
        if request.url.path == "/api/internal/applications/enqueue":
            return httpx.Response(409, json={"message": "já existe"})
        return httpx.Response(404)

    client = InternalClient("https://app.example", "secret", transport=httpx.MockTransport(handler))
    total = await client.upsert_postings([{"canonicalUrl": f"u{i}"} for i in range(1001)])
    assert total == {"upserted": 1001, "created": 1001, "rejected": 0}
    assert [len(json.loads(c.content)["postings"]) for c in calls] == [500, 500, 1]
    assert all(c.headers["x-worker-token"] == "secret" for c in calls)
    assert await client.enqueue(user_id="u", campaign_id="c", job_posting_id="p") is None
    await client.aclose()


class FakeClient:
    def __init__(self) -> None:
        self.postings: list[dict] = []
        self.boards: list[dict] = []

    async def list_boards(self, ats=None):
        return [{"ats": "greenhouse", "token": "acme", "companyName": "Acme"},
                {"ats": "greenhouse", "token": "morto", "companyName": None},
                {"ats": "workday", "token": "x", "companyName": None}]  # sem fetcher: ignorado

    async def active_campaigns(self):
        c = {"config": {"searchTerms": "dados", "locationTerm": "Recife"}}
        return [c, dict(c)]  # mesma busca em 2 campanhas → 1 execução do Apify

    async def upsert_postings(self, postings):
        self.postings += postings
        return {"upserted": len(postings), "created": len(postings)}

    async def upsert_boards(self, boards):
        self.boards += boards
        return len(boards)


async def test_run_discovery() -> None:
    from rpa_engine.cloud.discovery.run import run_discovery

    apify_runs = []

    def handler(request: httpx.Request) -> httpx.Response:
        url = str(request.url)
        if "boards-api.greenhouse.io/v1/boards/acme/" in url:
            return httpx.Response(200, json={"jobs": [{"id": 1, "title": "Dados", "absolute_url": "x", "location": {"name": "Recife"}}]})
        if "boards/morto/" in url:
            return httpx.Response(404)  # board fechado não derruba a descoberta
        if "api.apify.com" in url:
            apify_runs.append(json.loads(request.content))
            return httpx.Response(200, json=[{
                "id": "7", "title": "Dados", "company": {"name": "Beta"},
                "applyMethod": {"companyApplyUrl": "https://jobs.lever.co/beta/abc"},
            }])
        return httpx.Response(500)

    client = FakeClient()
    async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as http:
        stats = await run_discovery(client, http, apify_token="tok", apify_actor="a~b")
    assert len(apify_runs) == 1 and apify_runs[0]["locations"] == ["Recife"]
    assert {p["canonicalUrl"] for p in client.postings} == {
        "https://greenhouse.io/acme/jobs/1", "https://jobs.lever.co/beta/abc"}
    assert client.boards == [{"ats": "lever", "token": "beta", "companyName": "Beta"}]
    assert stats == {"postings": 2, "created": 2, "boards": 1, "failed_boards": 1}


def test_board_of_rejects_tokens_that_are_not_plain_slugs() -> None:
    # O token vira caminho de URL na descoberta: nada de "..", "%2F" ou query.
    assert board_of("https://jobs.lever.co/../abc") is None
    assert board_of("https://jobs.ashbyhq.com/a%2F..%2Fb/u1") is None
    assert board_of("https://job-boards.greenhouse.io/x.y/jobs/1") is None


def test_apify_item_with_spoofed_host_is_dropped() -> None:
    item = {"id": "1", "title": "Dados", "applyMethod": {"companyApplyUrl": "https://boards.greenhouse.io.x.com/acme/jobs/1"}}
    assert normalize_item(item) is None


async def test_apify_token_goes_in_header_not_url() -> None:
    from rpa_engine.cloud.discovery.apify import search

    seen = []

    def handler(request: httpx.Request) -> httpx.Response:
        seen.append(request)
        return httpx.Response(200, json=[])

    async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as http:
        await search(http, "segredo", "a~b", "dados", None)
    assert "segredo" not in str(seen[0].url)
    assert seen[0].headers["authorization"] == "Bearer segredo"


async def test_upsert_batches_by_size() -> None:
    sizes = []

    def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)["postings"]
        sizes.append(len(request.content))
        return httpx.Response(200, json={"data": {"upserted": len(body), "created": 0, "rejected": 0}})

    client = InternalClient("https://app.example", "t", transport=httpx.MockTransport(handler))
    big = [{"canonicalUrl": f"u{i}", "description": "x" * 20_000} for i in range(300)]
    total = await client.upsert_postings(big)
    assert total["upserted"] == 300
    assert max(sizes) < 4_000_000  # limite de corpo das funções da Vercel é 4,5 MB
    await client.aclose()
