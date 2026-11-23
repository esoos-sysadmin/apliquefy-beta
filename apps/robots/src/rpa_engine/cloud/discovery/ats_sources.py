"""APIs públicas de job board (Greenhouse, Lever, Ashby) → JobPostingInput.
Portado de candidata/sources.py; a saída é o corpo de POST internal/postings/upsert."""
from __future__ import annotations

import re
from datetime import datetime, timezone
from typing import Callable

import httpx

from ..adapters.greenhouse import apply_url as greenhouse_apply_url
from .canonical import canonical_url, html_to_text, norm

MAX_DESCRIPTION = 20_000
_REMOTE = re.compile(r"remot", re.I)


def workplace_from_text(text: str | None) -> str | None:
    """'hybrid' | 'remote' | None pelo texto do local/título. Híbrido antes de remoto: "Hybrid / Remote"
    prende a pessoa a uma cidade."""
    n = norm(text or "")
    return "hybrid" if re.search(r"hybrid|hibrid", n) else "remote" if "remot" in n else None


def _posting(**kw) -> dict:
    if kw.get("workplaceType") is None:
        kw.pop("workplaceType", None)  # o upsert aceita ausente, não null
    kw["description"] = (kw.get("description") or "")[:MAX_DESCRIPTION] or None
    return {"source": "ats_api", **kw}


def from_greenhouse(j: dict, token: str, company: str | None) -> dict:
    location = (j.get("location") or {}).get("name") or ""
    return _posting(
        # absolute_url costuma ser o site da empresa (gh_jid=…): a canônica sai do board.
        canonicalUrl=f"https://greenhouse.io/{token}/jobs/{j['id']}",
        applyUrl=greenhouse_apply_url(token, str(j["id"])),
        ats="greenhouse", boardToken=token, externalId=str(j["id"]),
        title=j["title"].strip(), companyName=company, location=location or None,
        isRemote=bool(_REMOTE.search(location)), workplaceType=workplace_from_text(location),
        description=html_to_text(j.get("content", "")),
        postedAt=j.get("first_published") or j.get("updated_at"),
    )


def from_lever(j: dict, slug: str, company: str | None) -> dict:
    cat = j.get("categories") or {}
    lists = "\n".join(f"{x.get('text', '')}\n{html_to_text(x.get('content', ''))}" for x in j.get("lists", []))
    created = j.get("createdAt")
    return _posting(
        canonicalUrl=canonical_url(j["hostedUrl"]),
        applyUrl=j.get("applyUrl") or j["hostedUrl"] + "/apply",
        ats="lever", boardToken=slug, externalId=j["id"],
        title=j["text"].strip(), companyName=company, location=cat.get("location") or None,
        isRemote=(j.get("workplaceType") == "remote") or bool(_REMOTE.search(cat.get("location") or "")),
        workplaceType=j.get("workplaceType") if j.get("workplaceType") in ("remote", "hybrid", "onsite") else None,
        description="\n".join(filter(None, [j.get("descriptionPlain"), lists, j.get("additionalPlain")])),
        postedAt=datetime.fromtimestamp(created / 1000, timezone.utc).isoformat() if created else None,
    )


def from_ashby(j: dict, slug: str, company: str | None) -> dict:
    places = [j.get("location", "")] + [s.get("location", "") for s in j.get("secondaryLocations") or []]
    return _posting(
        canonicalUrl=canonical_url(j["jobUrl"]),
        applyUrl=j.get("applyUrl") or j["jobUrl"] + "/application",
        ats="ashby", boardToken=slug, externalId=j["id"],
        title=j["title"].strip(), companyName=company, location=", ".join(filter(None, places)) or None,
        isRemote=bool(j.get("isRemote")),
        workplaceType={"remote": "remote", "hybrid": "hybrid", "onsite": "onsite"}.get(
            (j.get("workplaceType") or "").lower()) or ("remote" if j.get("isRemote") else None),
        description=j.get("descriptionPlain") or html_to_text(j.get("descriptionHtml", "")),
        postedAt=j.get("publishedAt"),
    )


async def _greenhouse(client: httpx.AsyncClient, token: str, company: str | None) -> list[dict]:
    r = await client.get(f"https://boards-api.greenhouse.io/v1/boards/{token}/jobs?content=true")
    r.raise_for_status()
    return [from_greenhouse(j, token, company) for j in r.json().get("jobs", [])]


async def _lever(client: httpx.AsyncClient, slug: str, company: str | None) -> list[dict]:
    r = await client.get(f"https://api.lever.co/v0/postings/{slug}?mode=json")
    r.raise_for_status()
    return [from_lever(j, slug, company) for j in r.json()]


async def _ashby(client: httpx.AsyncClient, slug: str, company: str | None) -> list[dict]:
    r = await client.get(f"https://api.ashbyhq.com/posting-api/job-board/{slug}")
    r.raise_for_status()
    return [from_ashby(j, slug, company) for j in r.json().get("jobs", []) if j.get("isListed") is not False]


FETCHERS: dict[str, Callable] = {"greenhouse": _greenhouse, "lever": _lever, "ashby": _ashby}
