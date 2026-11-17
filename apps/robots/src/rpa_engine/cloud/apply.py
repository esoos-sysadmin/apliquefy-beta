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

import httpx

from ..observability import capture_agent_crash
from ..util.resume import normalize
from .adapters.base import FormAdapter
from .adapters.greenhouse import GREENHOUSE, fetch_questions, precheck
from .answers import Answerer, AskFn
from .form_run import run_form

logger = logging.getLogger(__name__)

ADAPTERS: dict[str, FormAdapter] = {"greenhouse": GREENHOUSE}

# desfecho do run_form → prefixo do errorLog (buckets do /relatorios)
_FAIL_PREFIX = {"missing": "PERGUNTA", "blocked": "BLOQUEIO", "validation": "FORMULÁRIO", "challenge": "DESAFIO"}


async def precheck_posting(http: httpx.AsyncClient, posting: dict, answerer: Answerer, resume: dict) -> list[str]:
    """Perguntas obrigatórias sem resposta, antes de abrir o navegador (só Greenhouse tem API)."""
    if posting["ats"] != "greenhouse" or not posting.get("boardToken") or not posting.get("externalId"):
        return []
    return await precheck(await fetch_questions(http, posting["boardToken"], posting["externalId"]), answerer, resume)


async def _debit(client, **kw) -> None:
    # Idempotente pela chave: repetir é seguro, perder não (candidatura enviada sem cobrança).
    for attempt in range(3):
        try:
            await client.debit_flat(**kw)
            return
        except Exception as exc:  # noqa: BLE001
            logger.warning("débito falhou (tentativa %d): %s", attempt + 1, type(exc).__name__)
            await asyncio.sleep(2 ** attempt)
    logger.error("débito não registrado para a candidatura %s", kw["application_id"])


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

        resume = normalize(await client.resume(user_id, campaign["resumeId"]))
        answerer = Answerer(resume, ask)
        if missing := await precheck_posting(http, posting, answerer, resume):
            return await fail(f"PERGUNTA: {missing[0]}")

        fd, pdf_path = tempfile.mkstemp(suffix=".pdf", prefix="apliquefy-")
        with os.fdopen(fd, "wb") as fh:
            fh.write(await client.resume_pdf(user_id, campaign["resumeId"]))

        result = await run_form(bb, adapter, posting["applyUrl"], resume, pdf_path, answerer)
        if result.outcome != "submitted":
            # ponytail: desafio vira failed até a Fase 3 (handoff com live view).
            return await fail(f"{_FAIL_PREFIX.get(result.outcome, 'ERRO')}: {result.detail}")

        await client.patch_application(user_id, app_id, status="applied")
        settled = True
        await _debit(client, user_id=user_id, campaign_id=campaign["id"], application_id=app_id, questions=result.questions)
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
            try:  # solta o lock: volta para a fila na próxima rodada
                await client.patch_application(user_id, app_id, errorLog=f"ERRO: {error}")
            except Exception as exc:  # noqa: BLE001 — o lock vence sozinho em 15 min
                logger.warning("não soltou o lock de %s: %s", app_id, type(exc).__name__)

