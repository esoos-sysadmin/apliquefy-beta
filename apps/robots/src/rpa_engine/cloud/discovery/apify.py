"""Vagas do LinkedIn via Apify (harvestapi/linkedin-job-search), sem login.

Só interessa a vaga cujo botão "candidatar" leva a um ATS (`applyMethod.companyApplyUrl`):
Easy Apply e site próprio ficam fora — LinkedIn é do desktop (§0). O ATS é detectado
pela URL; o campo `applicantTrackingSystem` do ator não tem valores documentados.
Cada URL de Greenhouse/Lever/Ashby também alimenta `ats_boards` (ADR-09).
"""
from __future__ import annotations

import logging
import re
from urllib.parse import urlsplit

import httpx

from ..adapters.greenhouse import greenhouse_ids
from .ats_sources import MAX_DESCRIPTION, workplace_from_text
from .canonical import BOARD_TOKEN, canonical_url, detect_ats

logger = logging.getLogger(__name__)

API = "https://api.apify.com/v2/acts"
# ATS que a nuvem conhece; o resto (Gupy, Workday…) exige conta e não entra no catálogo.
CLOUD_ATS = {"greenhouse", "lever", "ashby", "workable", "recruitee", "breezy", "teamtailor", "quickin"}


def _auth(token: str) -> dict:
    # No cabeçalho, não na query: URL com token vai parar em log e no Sentry.
    return {"Authorization": f"Bearer {token}"}


def normalize_item(item: dict) -> dict | None:
    url = ((item.get("applyMethod") or {}).get("companyApplyUrl") or "").strip()
    ats = detect_ats(url) if url.startswith("https://") else None
    if ats not in CLOUD_ATS:
        return None
    location = (item.get("location") or {}).get("linkedinText") or None
    workplace = (item.get("workplaceType") or "").lower()
    kind = {"remote": "remote", "hybrid": "hybrid", "on-site": "onsite", "onsite": "onsite"}.get(workplace) \
        or workplace_from_text(location)
    return {**({"workplaceType": kind} if kind else {}),
        "canonicalUrl": canonical_url(url),
        "applyUrl": url,
        "ats": ats,
        "title": (item.get("title") or "").strip(),
        "companyName": (item.get("company") or {}).get("name"),
        "location": location,
        "isRemote": workplace == "remote" or bool(item.get("workRemoteAllowed")),
        "description": (item.get("descriptionText") or "")[:MAX_DESCRIPTION] or None,
        "postedAt": item.get("postedDate"),
        "source": "apify_linkedin",
        "sourceRef": str(item["id"]) if item.get("id") else None,
    }


_SLUG = {"lever": re.compile(r"^/([^/]+)/"), "ashby": re.compile(r"^/([^/]+)/")}


def board_of(url: str) -> tuple[str, str] | None:
    """(ats, token) do board público por trás da URL, para a descoberta varrer depois."""
    ats = detect_ats(url)
    token = None
    if ats == "greenhouse":
        token = (greenhouse_ids(url) or (None,))[0]
    elif ats in _SLUG and (m := _SLUG[ats].match(urlsplit(url).path + "/")):
        token = m[1]
    return (ats, token) if token and BOARD_TOKEN.match(token) else None


async def search(client: httpx.AsyncClient, token: str, actor: str, terms: str, location: str | None,
                 max_items: int = 100) -> list[dict]:
    """Uma execução do ator por (termos, local). Síncrona: o worker não tem pressa."""
    body = {"jobTitles": [terms], "maxItems": max_items, "sortBy": "date"}
    if location:
        body["locations"] = [location]
    r = await client.post(
        f"{API}/{actor}/run-sync-get-dataset-items", headers=_auth(token), json=body, timeout=600
    )
    r.raise_for_status()
    return r.json()


async def seed_greenhouse_boards(client: httpx.AsyncClient, token: str, max_companies: int = 5000) -> list[dict]:
    """Execução única do johnvc/greenhouse-job-board-api em modo companiesOnly (~4.400 boards).
    As chaves da linha não estão documentadas: aceita as variações prováveis."""
    # Run assíncrono + polling: o run-sync do Apify corta a conexão em ~300 s e a varredura
    # completa leva mais. maxJobs (default 100 no ator) também limita as linhas de empresa.
    r = await client.post(
        f"{API}/johnvc~greenhouse-job-board-api/runs",
        params={"waitForFinish": 60},
        headers=_auth(token),
        json={"outputMode": "companiesOnly", "verifyCompanies": True,
              "maxCompanies": max_companies, "maxJobs": max_companies},
        timeout=120,
    )
    r.raise_for_status()
    run = r.json()["data"]
    while run["status"] in ("READY", "RUNNING"):
        r = await client.get(f"https://api.apify.com/v2/actor-runs/{run['id']}",
                             params={"waitForFinish": 60}, headers=_auth(token), timeout=120)
        r.raise_for_status()
        run = r.json()["data"]
    if run["status"] != "SUCCEEDED":
        raise RuntimeError(f"apify: run {run['id']} terminou {run['status']}")
    r = await client.get(f"https://api.apify.com/v2/datasets/{run['defaultDatasetId']}/items",
                         headers=_auth(token), timeout=300)
    r.raise_for_status()
    boards = []
    for row in r.json():
        tok = row.get("boardToken") or row.get("board_token") or row.get("token")
        if tok:
            boards.append({"ats": "greenhouse", "token": tok, "companyName": row.get("companyName") or row.get("name")})
    return boards
