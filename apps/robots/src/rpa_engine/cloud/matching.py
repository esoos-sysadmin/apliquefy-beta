"""Matching e enfileiramento (§7.3): campanha ativa × catálogo → itens na fila.

A web já filtra o grosso (48 h, aberta, ATS, vaga que o usuário ainda não tem); aqui
fica o que é texto: termos no título e local/remoto. Fit gate por texto é da Fase 5.
"""
from __future__ import annotations

import logging
import os
import re

from ..runtime import fit_gate
from .discovery.apify import CLOUD_ATS
from .discovery.canonical import norm

logger = logging.getLogger(__name__)

_STOP = set("a o as os de da do das dos e em para com of the and for in at to".split())
# Remoto que serve a quem mora no Brasil. "Remote - US" quase sempre exige residência lá.
_REMOTE_OK = re.compile(r"\b(brazil|brasil|latam|latin america|americas|anywhere|worldwide|global)\b")
_REMOTE_ONLY_TEXT = {"", "remote", "remoto", "100 remote", "fully remote"}


def terms_of(search_terms: str) -> list[str]:
    return [t.strip() for t in re.split(r"[,;|]", search_terms or "") if t.strip()]


def title_matches(title: str, terms: list[str]) -> bool:
    """Algum termo com TODAS as palavras de conteúdo no título, em qualquer ordem.
    ponytail: palavra exata (engenheiro ≠ engenheira); stemming se o usuário reclamar."""
    words = set(norm(title).split())
    return any((content := set(norm(t).split()) - _STOP) and content <= words for t in terms)


def _remote_reachable(p: dict) -> bool:
    loc = norm(p.get("location") or "")
    remote = bool(p.get("isRemote")) or "remot" in loc
    return remote and (loc in _REMOTE_ONLY_TEXT or bool(_REMOTE_OK.search(loc)))


def location_matches(p: dict, location_term: str | None, remote_only: bool) -> bool:
    if _remote_reachable(p):
        return True
    if remote_only:
        return False
    if not location_term:
        return True
    return f" {norm(location_term)} " in f" {norm(p.get('location') or '')} "


def default_score():
    """Fit gate da nuvem: ChatOpenAI direto (o proxy /api/ai exige Clerk). None = sem chave."""
    key = os.environ.get("OPENAI_API_KEY")
    if not key:
        return None
    from browser_use import ChatOpenAI

    llm = ChatOpenAI(model=os.environ.get("OPENAI_MODEL", "gpt-4.1-mini"), api_key=key)

    async def score(description: str, resume: dict, posting: dict):
        return await fit_gate.score_text(description, resume, llm=llm, platform=posting.get("ats") or "ats",
                                         job_title=posting.get("title"))

    return score


async def match_and_enqueue(client, campaign: dict, supported: set[str], score=None) -> int:
    """Enfileira até `remainingToday` vagas novas para a campanha. Devolve quantas.

    Com `fitMinScore > 0`, a vaga reprovada nem entra na fila (ADR-07): vira `skipped`
    com `FIT:`, criada assim numa escrita só (nunca fica claimável no meio do caminho)."""
    room = campaign["remainingToday"]
    config = campaign["config"]
    ats = sorted((set(config.get("atsAllowlist") or CLOUD_ATS)) & supported)
    if room <= 0 or not ats:
        return 0
    terms = terms_of(config["searchTerms"])
    enqueued = 0
    minimum = int(config.get("fitMinScore") or 0)
    resume = None
    for p in await client.candidates(campaign["userId"], ats, terms=config["searchTerms"]):
        if enqueued >= room:
            break
        if not title_matches(p["title"], terms) or not location_matches(p, config.get("locationTerm"), config.get("remoteOnly")):
            continue
        if minimum > 0 and score is not None:
            if resume is None:
                resume = await client.resume(campaign["userId"], campaign["resumeId"])
            verdict = await score(await client.posting_description(p["id"]), resume, p)
            if fit_gate.should_skip(verdict, minimum):
                await client.enqueue(user_id=campaign["userId"], campaign_id=campaign["campaignId"],
                                     job_posting_id=p["id"], skip_reason=fit_gate.skip_reason(verdict))
                continue
        got = await client.enqueue(user_id=campaign["userId"], campaign_id=campaign["campaignId"], job_posting_id=p["id"])
        enqueued += got is not None  # 409 = já registrada para o usuário: não ocupa vaga
    logger.info("matching: campanha %s enfileirou %d", campaign["campaignId"], enqueued)
    return enqueued
