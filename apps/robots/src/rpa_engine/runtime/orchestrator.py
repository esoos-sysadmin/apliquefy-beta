"""Run orchestration: coordinates engines, agent, debit, daily limit."""
from __future__ import annotations

import asyncio
import base64
import logging
from dataclasses import dataclass, field
from typing import Literal

from ..config import Settings
from ..engines.base import EngineContext
from ..engines.infojobs.engine import InfojobsEngine
from ..engines.linkedin.engine import LinkedinEngine
from ..web_api.client import WebApiClient
from .session_loader import open_browser_context

logger = logging.getLogger(__name__)

State = Literal["pending", "running", "paused", "stopped", "finished"]


@dataclass
class RunHandle:
    run_id: str
    task: asyncio.Task
    subscribers: list[asyncio.Queue] = field(default_factory=list)
    state: State = "running"

    def subscribe(self) -> asyncio.Queue:
        q: asyncio.Queue = asyncio.Queue()
        self.subscribers.append(q)
        return q

    def unsubscribe(self, q: asyncio.Queue) -> None:
        if q in self.subscribers:
            self.subscribers.remove(q)

    async def emit(self, event: dict) -> None:
        for q in list(self.subscribers):
            await q.put(event)

    async def stop(self) -> None:
        self.state = "stopped"
        self.task.cancel()
        try:
            await self.task
        except (asyncio.CancelledError, Exception):
            pass


async def _stream_frames(page, emit, run_id: str, interval: float = 0.4) -> None:
    """Screenshot periódico da página → evento `frame` (JPEG base64) p/ a prévia
    ao vivo no desktop. Puramente cosmético: não toca no browser de automação
    além de ler um screenshot, então não muda a superfície anti-detecção.

    ponytail: screenshot da página conhecida a ~2.5fps; durante navegação o
    screenshot lança e o frame é só descartado. Se um dia precisar seguir troca
    de aba, migrar p/ CDP screencast.
    """
    while True:
        try:
            shot = await page.screenshot(type="jpeg", quality=45)
            await emit({"runId": run_id, "type": "frame", "data": base64.b64encode(shot).decode()})
        except Exception:  # noqa: BLE001 — nav em progresso / target ocupado: descarta o frame
            pass
        await asyncio.sleep(interval)


class Orchestrator:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    async def start(
        self,
        run_id: str,
        campaign_id: str,
        storage_state_path: str,
        resume_pdf_path: str,
        web_token: str | None = None,
    ) -> RunHandle:
        loop = asyncio.get_running_loop()
        handle = RunHandle(run_id=run_id, task=loop.create_task(asyncio.sleep(0)))

        async def runner() -> None:
            client = WebApiClient(self.settings, token=web_token)
            try:
                runtime = await client.get_campaign_runtime(campaign_id)
                campaign = runtime["campaign"]
                resume = runtime["resume"]
                platform = campaign["platform"]

                engine_cls = LinkedinEngine if platform == "linkedin" else InfojobsEngine
                async with open_browser_context(
                    storage_state_path,
                    headless=self.settings.headless,
                    slow_mo_ms=self.settings.slow_mo_ms,
                    devtools=self.settings.devtools,
                    browser_channel=self.settings.browser_channel,
                ) as bridge:
                    ctx = EngineContext(
                        page=bridge.page,
                        browser_session=bridge.session,
                        campaign=campaign,
                        resume=resume,
                        resume_pdf_path=resume_pdf_path,
                        client=client,
                        settings=self.settings,
                        emit=handle.emit,
                        run_id=run_id,
                    )
                    frame_task = asyncio.create_task(
                        _stream_frames(bridge.page, handle.emit, run_id)
                    )
                    try:
                        await engine_cls(ctx).execute()
                    finally:
                        frame_task.cancel()

                handle.state = "finished"
                await handle.emit({"runId": run_id, "type": "finished", "total": 0})
            except asyncio.CancelledError:
                raise
            except Exception as exc:  # noqa: BLE001
                logger.exception("run %s crashed", run_id)
                handle.state = "stopped"
                await handle.emit({"runId": run_id, "type": "paused", "reason": str(exc)})
            finally:
                await client.close()

        handle.task = loop.create_task(runner())
        return handle
