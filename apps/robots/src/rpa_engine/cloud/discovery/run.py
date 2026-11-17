"""Uma rodada de descoberta (§7.2): boards públicos + Apify → catálogo `job_postings`."""
from __future__ import annotations

import asyncio
import logging

import httpx

from . import apify
from .ats_sources import FETCHERS

logger = logging.getLogger(__name__)

PER_ATS_PARALLEL = 4


async def run_discovery(client, http: httpx.AsyncClient, *, apify_token: str = "", apify_actor: str = "") -> dict:
    postings: dict[str, dict] = {}
    failed = 0
    sems = {ats: asyncio.Semaphore(PER_ATS_PARALLEL) for ats in FETCHERS}

    async def fetch(board: dict) -> None:
        nonlocal failed
        async with sems[board["ats"]]:
            try:
                for p in await FETCHERS[board["ats"]](http, board["token"], board.get("companyName")):
                    postings[p["canonicalUrl"]] = p
            except Exception as exc:  # noqa: BLE001 — board fechado/fora do ar não para a rodada
                failed += 1
                logger.info("descoberta: board %s/%s falhou (%s)", board["ats"], board["token"], type(exc).__name__)

    boards = [b for b in await client.list_boards() if b["ats"] in FETCHERS]
    await asyncio.gather(*(fetch(b) for b in boards))

    new_boards: dict[tuple[str, str], dict] = {}
    if apify_token:
        known = {(b["ats"], b["token"]) for b in boards}
        # Uma execução por busca distinta, não por campanha.
        searches = {(c["config"]["searchTerms"], c["config"].get("locationTerm")) for c in await client.active_campaigns()}
        for terms, location in searches:
            try:
                items = await apify.search(http, apify_token, apify_actor, terms, location)
            except Exception as exc:  # noqa: BLE001 — Apify é fonte secundária (§12)
                logger.warning("descoberta: apify falhou (%s)", type(exc).__name__)
                continue
            for item in items:
                if not (p := apify.normalize_item(item)):
                    continue
                postings.setdefault(p["canonicalUrl"], p)  # a API do ATS ganha do Apify
                if (b := apify.board_of(p["applyUrl"])) and b not in known:
                    new_boards[b] = {"ats": b[0], "token": b[1], "companyName": p.get("companyName")}

    totals = await client.upsert_postings(list(postings.values())) if postings else {"upserted": 0, "created": 0}
    created_boards = await client.upsert_boards(list(new_boards.values())) if new_boards else 0
    stats = {"postings": totals["upserted"], "created": totals["created"], "boards": created_boards, "failed_boards": failed}
    if not totals["created"]:
        logger.warning("descoberta: nenhuma vaga nova %s", stats)  # §10: rodada silenciosamente vazia
    logger.info("descoberta: %s", stats)
    return stats
