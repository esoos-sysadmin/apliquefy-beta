"""Worker da nuvem: `python -m rpa_engine.cloud` (Railway, código-fonte com uv).

Quatro tarefas no mesmo processo (§7.1), sem FastAPI: o desktop não fala com ele.
- descoberta: na subida e a cada DISCOVERY_INTERVAL_HOURS;
- matching: a cada hora (o limite diário libera vaga todo dia);
- varredor: a cada 5 min (handoff vencido, tentativas esgotadas — §7.6);
- envio: claim de até WORKER_CONCURRENCY itens, 30 s de espera com a fila vazia.
Mais réplicas funcionam sem mudança: o claim é exclusivo.
"""
from __future__ import annotations

import asyncio
import logging
import os
from typing import Awaitable, Callable

import httpx
import sentry_sdk

from ..observability import init_observability
from .answers import default_ask
from .apply import process
from .browser import Browserbase
from .config import CloudSettings, load_cloud_settings
from .discovery.run import run_discovery
from .internal_client import InternalClient
from .matching import default_score, match_and_enqueue

logger = logging.getLogger("rpa_engine.cloud")

IDLE_SECONDS = 30
MATCH_INTERVAL_SECONDS = 3600
SWEEP_INTERVAL_SECONDS = 300


async def fill_slots(client, tasks: set, *, worker_id: str, concurrency: int, supported: set[str],
                     work: Callable[[dict], Awaitable]) -> int:
    """Pega da fila só o que cabe nas vagas livres do semáforo."""
    free = concurrency - len(tasks)
    if free <= 0:
        return 0
    items = await client.claim(worker_id, free, sorted(supported))
    for item in items:
        task = asyncio.create_task(work(item))
        tasks.add(task)
        task.add_done_callback(tasks.discard)
    return len(items)


async def _every(seconds: float, name: str, fn: Callable[[], Awaitable]) -> None:
    while True:
        try:
            await fn()
        except Exception as exc:  # noqa: BLE001 — uma rodada ruim não derruba o worker
            logger.warning("%s falhou: %s", name, type(exc).__name__)
            sentry_sdk.capture_exception(exc)
        await asyncio.sleep(seconds)


async def _send_loop(s: CloudSettings, client: InternalClient, http: httpx.AsyncClient) -> None:
    if not (s.browser_api_key and s.browser_project_id):
        logger.error("envio desligado: BROWSER_PROVIDER_API_KEY/PROJECT_ID ausentes")
        return
    bb = Browserbase(s.browser_api_key, s.browser_project_id, s.ats_proxy)
    ask = default_ask()
    tasks: set[asyncio.Task] = set()

    async def work(item: dict) -> None:
        outcome = await process(item, client=client, bb=bb, http=http, ask=ask, handoff_min=s.handoff_timeout_min)
        logger.info("candidatura %s: %s", item["application"]["id"], outcome)

    while True:
        try:
            got = await fill_slots(client, tasks, worker_id=s.worker_id, concurrency=s.concurrency,
                                   supported=s.supported_ats, work=work)
        except Exception as exc:  # noqa: BLE001
            logger.warning("claim falhou: %s", type(exc).__name__)
            got = 0
        await asyncio.sleep(1 if got else IDLE_SECONDS)


async def main() -> None:
    s = load_cloud_settings()
    os.environ.setdefault("SENTRY_DSN_RUNNER", os.environ.get("SENTRY_DSN", ""))
    if init_observability():
        sentry_sdk.set_tag("surface", "cloud-worker")
    client = InternalClient(s.web_url, s.worker_token)
    async with httpx.AsyncClient(timeout=30) as http:

        async def discover() -> None:
            await run_discovery(client, http, apify_token=s.apify_token, apify_actor=s.apify_actor)

        score = default_score()

        async def match() -> None:
            for campaign in await client.active_campaigns():
                await match_and_enqueue(client, campaign, s.supported_ats, score=score)

        # ponytail: descoberta roda em toda subida (não guardamos a hora da última);
        # gravar em ats_boards.last_fetched_at se redeploys frequentes pesarem no Apify.
        await asyncio.gather(
            _every(s.discovery_interval_hours * 3600, "descoberta", discover),
            _every(MATCH_INTERVAL_SECONDS, "matching", match),
            _every(SWEEP_INTERVAL_SECONDS, "varredor", client.sweep),
            _send_loop(s, client, http),
        )


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
    asyncio.run(main())
