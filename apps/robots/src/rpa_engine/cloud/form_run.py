"""Abre a sessão, preenche e envia UM formulário de ATS. Sem rede com a web do Apliquefy:
quem chama (o spike da Fase 0 ou o ciclo da §7.4) decide o que fazer com o resultado."""
from __future__ import annotations

import logging
from dataclasses import dataclass

from playwright.async_api import async_playwright

from .adapters.base import FormAdapter, FormFiller
from .answers import Answerer
from .browser import Browserbase

logger = logging.getLogger(__name__)


@dataclass
class FormResult:
    # submitted | challenge | validation | blocked | missing | filled (dry-run)
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
) -> FormResult:
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
                result = await adapter.submit(page)
                kind, _, detail = result.partition(":")
                return FormResult(kind, detail, filler.questions)
            finally:
                await browser.close()
    finally:
        await bb.close(session.id)
