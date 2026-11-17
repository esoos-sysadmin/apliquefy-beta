"""Ciclo de UMA candidatura vinda do claim (§7.4).

Ordem do dinheiro igual à do desktop (apply_agent): PATCH `applied` e só depois o débito,
com a chave `application:<id>` — qualquer desfecho que não seja sucesso não cobra nada,
e reprocessar depois de um crash não cobra duas vezes.

Privacidade (§9.2): sessão do navegador encerrada pelo `run_form` em qualquer desfecho,
PDF apagado no `finally`, e a mensagem de exceção (pode ter dado do formulário) nunca
vai para a web — só a classe.
"""
from __future__ import annotations

import asyncio
import logging
import os
import tempfile
from datetime import datetime, timedelta, timezone

import httpx

from ..observability import capture_agent_crash
from ..util.resume import normalize
from .adapters.base import FormAdapter
from .adapters.greenhouse import GREENHOUSE, apply_url, fetch_questions, greenhouse_ids, precheck
from .answers import Answerer, AskFn
from .discovery.canonical import BOARD_TOKEN, detect_ats
from .form_run import run_form

logger = logging.getLogger(__name__)

ADAPTERS: dict[str, FormAdapter] = {"greenhouse": GREENHOUSE}

# desfecho do run_form → prefixo do errorLog (buckets do /relatorios)
_FAIL_PREFIX = {"missing": "PERGUNTA", "blocked": "BLOQUEIO", "validation": "FORMULÁRIO", "challenge": "DESAFIO"}


def safe_apply_url(posting: dict) -> str | None:
    """URL que o navegador vai abrir — e onde o currículo vai parar. Nunca a URL raspada
    sem conferir: no Greenhouse ela é remontada a partir dos ids; nos demais, o host
    precisa ser exatamente do ATS da vaga. None = não abrir."""
    if posting["ats"] == "greenhouse":
        board, job = posting.get("boardToken"), posting.get("externalId")
        if not (board and job and BOARD_TOKEN.match(board) and str(job).isdigit()):
            ids = greenhouse_ids(posting["applyUrl"]) if detect_ats(posting["applyUrl"]) == "greenhouse" else None
            board, job = ids if ids else (None, None)
        return apply_url(board, str(job)) if board and BOARD_TOKEN.match(board) else None
    return posting["applyUrl"] if detect_ats(posting["applyUrl"]) == posting["ats"] else None


async def _retry(fn, what: str, tries: int = 5) -> bool:
    """Repete uma chamada idempotente. False = desistiu (já logado)."""
    for attempt in range(tries):
        try:
            await fn()
            return True
        except Exception as exc:  # noqa: BLE001
            logger.warning("%s falhou (tentativa %d): %s", what, attempt + 1, type(exc).__name__)
            await asyncio.sleep(2 ** attempt)
    logger.error("%s: desisti depois de %d tentativas", what, tries)
    return False


async def precheck_posting(http: httpx.AsyncClient, posting: dict, answerer: Answerer, resume: dict) -> list[str]:
    """Perguntas obrigatórias sem resposta, antes de abrir o navegador (só Greenhouse tem API)."""
    if posting["ats"] != "greenhouse" or not posting.get("boardToken") or not posting.get("externalId"):
        return []
    return await precheck(await fetch_questions(http, posting["boardToken"], posting["externalId"]), answerer, resume)


async def process(item: dict, *, client, bb, http, ask: AskFn | None) -> str:
    """'applied' | 'failed' | 'retry' (volta para a fila; o claim já contou a tentativa)."""
    app, posting, campaign = item["application"], item["posting"], item["campaign"]
    user_id, app_id = app["userId"], app["id"]
    pdf_path: str | None = None
    settled = False
    error = "interrompido"

    async def fail(log: str) -> str:
        nonlocal settled
        await client.patch_application(user_id, app_id, status="failed", errorLog=log[:4000])
        settled = True
        return "failed"

    try:
        adapter = ADAPTERS.get(posting["ats"])
        if adapter is None:  # agente genérico é da Fase 4
            return await fail(f"SEM ADAPTER: {posting['ats']}")
        url = safe_apply_url(posting)
        if url is None:
            return await fail("URL: fora do domínio do ATS")

        resume = normalize(await client.resume(user_id, campaign["resumeId"]))
        answerer = Answerer(resume, ask)
        if missing := await precheck_posting(http, posting, answerer, resume):
            return await fail(f"PERGUNTA: {missing[0]}")

        fd, pdf_path = tempfile.mkstemp(suffix=".pdf", prefix="apliquefy-")
        with os.fdopen(fd, "wb") as fh:
            fh.write(await client.resume_pdf(user_id, campaign["resumeId"]))

        result = await run_form(bb, adapter, url, resume, pdf_path, answerer)
        if result.outcome != "submitted":
            # ponytail: desafio vira failed até a Fase 3 (handoff com live view).
            return await fail(f"{_FAIL_PREFIX.get(result.outcome, 'ERRO')}: {result.detail}")

        # Enviado ao empregador: daqui em diante o item NUNCA volta para a fila, senão
        # o candidato aparece duplicado na empresa. PATCH e débito são idempotentes.
        settled = True
        await _retry(lambda: client.patch_application(user_id, app_id, status="applied"), f"applied {app_id}")
        await _retry(
            lambda: client.debit_flat(user_id=user_id, campaign_id=campaign["id"], application_id=app_id,
                                      questions=result.questions),
            f"débito {app_id}",
        )
        return "applied"
    except Exception as exc:  # noqa: BLE001
        error = type(exc).__name__
        logger.warning("candidatura %s: %s", app_id, error)
        capture_agent_crash(exc, posting.get("ats") or "ats")
        return "retry"
    finally:
        if pdf_path:
            try:
                os.remove(pdf_path)
            except OSError:
                pass
        if not settled:
            # Solta o lock com backoff: sem ele, uma queda de 1 min do provedor queimava as
            # 3 tentativas em segundos. Na 3ª, a web marca failed (TENTATIVAS).
            delay = timedelta(minutes=2 ** max(1, app.get("attempts", 1)))
            try:
                await client.patch_application(
                    user_id, app_id, errorLog=f"ERRO: {error}",
                    runAfter=(datetime.now(timezone.utc) + delay).isoformat(),
                )
            except Exception as exc:  # noqa: BLE001 — o lock vence sozinho em 15 min
                logger.warning("não soltou o lock de %s: %s", app_id, type(exc).__name__)

