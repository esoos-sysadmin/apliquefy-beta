"""Browser bootstrap: browser-use sobe o Chrome; Playwright conecta via CDP.

O browser-use (CDP) dirige o apply cognitivo (screenshot → LLM → ação). O
Playwright, conectado no MESMO Chrome via `connect_over_cdp`, faz os passos
mecânicos e determinísticos (busca, filtros, coleta de vagas, abrir vaga). Os
dois compartilham a sessão porque é o mesmo browser (storage_state aplicado no
launch pelo browser-use).

Mantidos os ajustes anti-automação da captura de sessão — sem eles LinkedIn/
InfoJobs detectam o controle automatizado e deslogam.
"""
from __future__ import annotations

from contextlib import asynccontextmanager
from dataclasses import dataclass
from pathlib import Path
from typing import AsyncIterator

from browser_use import BrowserProfile, BrowserSession
from playwright.async_api import Page, async_playwright

_ANTI_AUTOMATION_ARGS = ["--disable-blink-features=AutomationControlled"]
_IGNORE_DEFAULT_ARGS = ["--enable-automation"]


@dataclass
class BrowserBridge:
    session: BrowserSession  # dono do browser; passado ao Agent do browser-use
    page: Page  # Playwright sobre CDP; passos mecânicos


@asynccontextmanager
async def open_browser_context(
    storage_state_path: str,
    headless: bool = False,
    slow_mo_ms: int = 0,  # ponytail: browser-use não expõe slow_mo; ignorado
    devtools: bool = False,  # ponytail: idem; mantido só p/ compat de assinatura
    browser_channel: str | None = "chrome",
) -> AsyncIterator[BrowserBridge]:
    path = Path(storage_state_path)
    if not path.exists():
        raise FileNotFoundError(f"storage_state not found: {path}")

    profile = BrowserProfile(
        channel=browser_channel or None,
        headless=headless,
        storage_state=str(path),
        args=_ANTI_AUTOMATION_ARGS,
        ignore_default_args=_IGNORE_DEFAULT_ARGS,
        # headed usa o tamanho real da janela (igual à captura); headless usa o
        # viewport padrão.
        no_viewport=not headless,
        keep_alive=True,  # não derruba o Chrome entre tarefas do Agent
    )
    session = BrowserSession(browser_profile=profile)
    await session.start()

    cdp_url = session.cdp_url
    if not cdp_url:
        await session.stop()
        raise RuntimeError("browser-use não expôs cdp_url após start()")

    pw = await async_playwright().start()
    try:
        browser = await pw.chromium.connect_over_cdp(cdp_url)
        context = browser.contexts[0] if browser.contexts else await browser.new_context()
        page = context.pages[0] if context.pages else await context.new_page()
        yield BrowserBridge(session=session, page=page)
    finally:
        # pw.stop() apenas desconecta (não fecha o Chrome, que é do browser-use).
        await pw.stop()
        await session.stop()
