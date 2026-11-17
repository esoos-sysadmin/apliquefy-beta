"""Abre a sessão, preenche e envia UM formulário de ATS. Sem rede com a web do Apliquefy:
quem chama (o spike da Fase 0 ou o ciclo da §7.4) decide o que fazer com o resultado."""
from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Awaitable, Callable

from playwright.async_api import async_playwright

from .adapters.base import FormAdapter, FormFiller, page_text
from .answers import Answerer
from .browser import Browserbase
from .discovery.canonical import detect_ats

logger = logging.getLogger(__name__)


def leaves_ats(url: str, ats: str) -> bool:
    return detect_ats(url) != ats


async def _pin_to_ats(page, ats: str) -> None:
    """Durante o handoff o usuário controla a página. Enviar e navegar para outro site
    esconderia a tela de sucesso: envio sem débito. Só o frame principal é preso; os
    iframes do captcha vêm de outro domínio e seguem livres."""
    async def guard(route) -> None:
        req = route.request
        if req.is_navigation_request() and req.frame == page.main_frame and leaves_ats(req.url, ats):
            await route.abort()
        else:
            await route.continue_()

    await page.route("**/*", guard)


@dataclass
class FormResult:
    # submitted | challenge | handoff | validation | blocked | missing | filled (dry-run)
    outcome: str
    detail: str = ""
    questions: int = 0


async def run_form(
    bb: Browserbase,
    adapter: FormAdapter,
    url: str,
    resume: dict,
    pdf: str,
    answerer: Answerer,
    *,
    submit: bool = True,
    handoff: Callable[[str, Callable[[], Awaitable[bool]]], Awaitable[bool]] | None = None,
) -> FormResult:
    """`handoff(session_id, confirmed)`: no desafio, entrega a sessão ao usuário (§8) e diz se
    ele concluiu. A sessão só fecha depois, no `finally` — é ela que o live view mostra."""
    session = await bb.open(adapter.name)
    try:
        async with async_playwright() as pw:
            browser = await pw.chromium.connect_over_cdp(session.connect_url)
            try:
                context = browser.contexts[0] if browser.contexts else await browser.new_context()
                page = context.pages[0] if context.pages else await context.new_page()
                await page.goto(url, wait_until="domcontentloaded", timeout=60_000)
                if not await adapter.check_access(page):
                    return FormResult("blocked", adapter.name)
                filler = FormFiller(page, answerer, resume, pdf)
                await adapter.fill(page, filler)
                if filler.missing:
                    return FormResult("missing", filler.missing[0], filler.questions)
                if not submit:
                    return FormResult("filled", questions=filler.questions)
                baseline = await page_text(page)
                result = await adapter.submit(page, baseline=baseline)
                kind, _, detail = result.partition(":")
                if kind == "challenge" and handoff is not None:
                    await _pin_to_ats(page, adapter.name)
                    if await handoff(session.id, lambda: adapter.confirmed(page, baseline)):
                        return FormResult("submitted", "handoff", filler.questions)
                    return FormResult("handoff", "tempo esgotado", filler.questions)
                return FormResult(kind, detail, filler.questions)
            finally:
                await browser.close()
    finally:
        await bb.close(session.id)
