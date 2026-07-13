"""LinkedIn mechanical engine.

Login is assumed (storage_state). Flow:
  1. Open `/feed`, abort if redirected to login.
  2. Search with keywords + location, switch to Jobs tab.
  3. Apply filters from CampaignLinkedin config via UI.
  4. Activate the **Easy Apply** toggle (mandatory; abort if missing).
  5. Iterate cards → click → wait detail panel → click Easy Apply →
     hand off to the visual agent loop (M6).
"""
from __future__ import annotations

import logging
from typing import Any
from urllib.parse import quote

from playwright.async_api import Page, TimeoutError as PlaywrightTimeout

from ..base import BaseEngine
from ...runtime.apply_agent import execute_apply
from ...runtime.daily_limit import remaining_for_campaign
from ...runtime.state_machine import Outcome
from . import selectors as S

logger = logging.getLogger(__name__)


class LinkedinEngine(BaseEngine):
    BASE_URL = "https://www.linkedin.com"

    async def execute(self) -> None:
        cfg = self.ctx.campaign.get("linkedinConfig") or {}
        logger.info("linkedin: verificando login")
        await self._ensure_logged_in()
        logger.info("linkedin: abrindo busca de vagas (keywords=%r)", cfg.get("searchTerms"))
        await self._goto_jobs_search(cfg)
        logger.info("linkedin: aplicando filtros")
        await self._apply_filters(cfg)
        await self._require_easy_apply_toggle()
        logger.info("linkedin: iterando vagas")
        await self._iterate_jobs(cfg)
        logger.info("linkedin: fim do run")

    async def _ensure_logged_in(self) -> None:
        page: Page = self.ctx.page
        await page.goto(f"{self.BASE_URL}/feed", wait_until="domcontentloaded")
        # Cookie morto no servidor redireciona /feed para /login (o layout atual NÃO
        # tem mais o input[name=session_key], por isso o check antigo deixava passar
        # deslogado e tentava candidatar). Detecta por URL de auth-wall + campo de
        # senha — sinal robusto confirmado nos testes de rede.
        await page.wait_for_timeout(1_500)
        url = page.url
        on_auth_wall = any(
            seg in url for seg in ("/login", "/authwall", "/checkpoint", "/uas")
        )
        has_password = (
            await page.locator("input[type='password'], " + S.LOGIN_FALLBACK_INDICATOR).count() > 0
        )
        if on_auth_wall or has_password:
            logger.warning("linkedin: sessão inválida (url=%s)", url)
            await self.ctx.emit({
                "runId": self.ctx.run_id,
                "type": "paused",
                "reason": "session_invalid",
            })
            raise RuntimeError("LinkedIn session invalid")

    async def _goto_jobs_search(self, cfg: dict[str, Any]) -> None:
        page: Page = self.ctx.page
        keywords = cfg.get("searchTerms") or ""
        location = cfg.get("locationTerm") or ""
        url = f"{self.BASE_URL}/jobs/search/?keywords={quote(keywords)}&location={quote(location)}&f_AL=true"
        await page.goto(url, wait_until="domcontentloaded")
        # A lista de resultados é virtualizada/lazy; dá um tempo pra hidratar.
        await page.wait_for_timeout(3_000)
        logger.info("jobs search url=%s", page.url)

        # No DOM logado, o sinal estável de "vaga" é o link /jobs/view/{id}.
        # Coletamos as URLs únicas AGORA (a lista some quando re-renderiza), e
        # depois navegamos direto para cada vaga — mais robusto que clicar nos
        # cards da lista virtualizada.
        try:
            await page.wait_for_selector(S.JOB_CARD, timeout=20_000)
        except PlaywrightTimeout:
            logger.warning("nenhum link de vaga encontrado em %s", page.url)
        self._job_urls = await page.eval_on_selector_all(
            S.JOB_CARD,
            "els => Array.from(new Set(els.map(e => e.href.split('?')[0])))",
        )
        logger.info("coletadas %s URLs de vaga", len(self._job_urls))

    async def _apply_filters(self, cfg: dict[str, Any]) -> None:
        # Granular filter clicks intentionally minimal here; the URL `f_*`
        # query string encodes most LinkedIn filters and is more stable than
        # the popover UI. We only use the popovers for filters not present
        # in the URL (sort, etc).
        page: Page = self.ctx.page
        if cfg.get("sortBy") and cfg["sortBy"] != "relevant":
            try:
                await page.click(S.FILTER_SORT, timeout=3_000)
                option = "Mais recentes" if cfg["sortBy"] == "recent" else "Mais relevantes"
                await page.click(f"label:has-text('{option}')", timeout=3_000)
                await page.click(S.APPLY_FILTERS_BTN, timeout=3_000)
            except PlaywrightTimeout:
                logger.warning("sort filter not available")

    async def _require_easy_apply_toggle(self) -> None:
        # O filtro Easy Apply já é garantido pelo parâmetro de URL `f_AL=true`.
        # O toggle/rádio na UI mudou de forma com o tempo, então não tratamos
        # mais sua ausência como erro fatal — apenas tentamos reforçar pela UI.
        page: Page = self.ctx.page
        try:
            toggle = page.locator(S.EASY_APPLY_TOGGLE_BTN).first
            await toggle.wait_for(state="visible", timeout=5_000)
            pressed = await toggle.get_attribute("aria-pressed")
            if pressed not in ("true", None):
                await toggle.click()
                await page.wait_for_timeout(800)
        except PlaywrightTimeout:
            logger.info("Easy Apply toggle não encontrado na UI; mantendo filtro via f_AL=true")

    async def _iterate_jobs(self, cfg: dict[str, Any]) -> None:
        page: Page = self.ctx.page
        job_urls: list[str] = getattr(self, "_job_urls", [])
        logger.info("iterando %s vagas", len(job_urls))

        for job_url in job_urls:
            remaining = await remaining_for_campaign(self.ctx.client, self.ctx.campaign["id"])
            if remaining <= 0:
                await self.ctx.emit({
                    "runId": self.ctx.run_id,
                    "type": "paused",
                    "reason": "dailyLimit reached",
                })
                return

            try:
                # Navega direto para a vaga em vez de clicar no card (a lista é
                # virtualizada e some ao re-renderizar).
                await page.goto(job_url, wait_until="domcontentloaded")
                await page.wait_for_selector(S.APPLY_BUTTON, timeout=6_000)
                title = (await page.title()).split(" | ")[0].strip() or None
                logger.info("vaga: %s (%s)", title, job_url)

                await self.ctx.emit({
                    "runId": self.ctx.run_id,
                    "type": "job_found",
                    "jobUrl": job_url,
                    "jobTitle": title,
                    "companyName": None,
                })

                await page.click(S.APPLY_BUTTON)
                outcome = await execute_apply(
                    self.ctx,
                    platform="linkedin",
                    job_url=job_url,
                    job_title=title,
                    company_name=None,
                )
                if outcome is Outcome.PAUSE_SESSION_INVALID:
                    return
            except PlaywrightTimeout:
                logger.info("vaga sem Easy Apply/timeout, pulando: %s", job_url)
                continue
