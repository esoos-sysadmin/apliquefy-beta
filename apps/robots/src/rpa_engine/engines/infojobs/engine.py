"""Infojobs mechanical engine.

Critical: location must be picked via the autocomplete dropdown,
never typed as free text (R07).
"""
from __future__ import annotations

import logging
from typing import Any

from playwright.async_api import Page, TimeoutError as PlaywrightTimeout

from ..base import BaseEngine, SelectorNotFoundError
from ...observability import MIN_JOBS_FOR_SELECTOR_ALARM, breadcrumb, capture_selector_break
from ...runtime import fit_gate
from ...runtime.apply_agent import execute_apply, record_skip
from ...runtime.daily_limit import remaining_for_campaign
from ...runtime.state_machine import Outcome
from . import selectors as S

logger = logging.getLogger(__name__)


class InfojobsEngine(BaseEngine):
    BASE_URL = "https://www.infojobs.com.br"

    async def execute(self) -> None:
        cfg = self.ctx.campaign.get("infojobsConfig") or {}
        page: Page = self.ctx.page

        await page.goto(self.BASE_URL, wait_until="domcontentloaded")

        await self._fill_search(cfg)
        await self._select_location_via_dropdown(cfg)
        await self._submit_search()
        await self._apply_listing_filters(cfg)
        await self._iterate_jobs()

    async def _fill_search(self, cfg: dict[str, Any]) -> None:
        page: Page = self.ctx.page
        terms = cfg.get("searchTerms") or ""
        try:
            await page.fill(S.SEARCH_KEYWORD_INPUT, terms)
        except PlaywrightTimeout as exc:
            # Sobe até o orchestrator, que captura com o fingerprint do seletor.
            raise SelectorNotFoundError(
                "SEARCH_KEYWORD_INPUT", step="job_search", platform="infojobs"
            ) from exc

    async def _select_location_via_dropdown(self, cfg: dict[str, Any]) -> None:
        """R07: localização SEMPRE via dropdown, nunca texto livre."""
        page: Page = self.ctx.page
        state_key = cfg.get("locationState")
        if not state_key:
            return

        label = S.BRAZIL_STATE_LABEL.get(state_key)
        if not label:
            return

        await page.click(S.WHERE_INPUT)
        await page.fill(S.WHERE_INPUT, label[:3])  # trigger suggestions
        try:
            option = page.locator(S.WHERE_DROPDOWN_OPTION).filter(has_text=label).first
            await option.wait_for(state="visible", timeout=5_000)
            await option.click()
        except PlaywrightTimeout as exc:
            raise SelectorNotFoundError(
                "WHERE_DROPDOWN_OPTION",
                step="job_search",
                platform="infojobs",
                detail=f"opção '{label}' não apareceu no dropdown (R07)",
            ) from exc

    async def _submit_search(self) -> None:
        page: Page = self.ctx.page
        await page.click(S.SEARCH_SUBMIT_BTN)
        try:
            await page.wait_for_selector(S.JOB_CARD, timeout=15_000)
        except PlaywrightTimeout as exc:
            # Diferente do LinkedIn, aqui a lista vazia já aborta o run — então
            # basta tipar o erro; a captura acontece uma vez no orchestrator.
            raise SelectorNotFoundError(
                "JOB_CARD", step="job_search", platform="infojobs"
            ) from exc

    async def _apply_listing_filters(self, cfg: dict[str, Any]) -> None:
        # The Infojobs results page uses a sidebar with checkboxes.
        # For each filter present in the config, click the matching label.
        # Implementation kept minimal here; details refined per filter set.
        _ = cfg
        return

    async def _iterate_jobs(self) -> None:
        page: Page = self.ctx.page
        cards = page.locator(S.JOB_CARD)
        count = await cards.count()
        logger.info("found %s Infojobs jobs", count)
        timeouts = 0

        for i in range(count):
            remaining = await remaining_for_campaign(self.ctx.client, self.ctx.campaign["id"])
            if remaining <= 0:
                await self.ctx.emit({
                    "runId": self.ctx.run_id,
                    "type": "paused",
                    "reason": "dailyLimit reached",
                })
                return

            breadcrumb("job_iteration", "abrindo vaga", index=i)

            card = cards.nth(i)
            try:
                await card.scroll_into_view_if_needed()
                await card.click()
                await page.wait_for_selector(S.APPLY_BUTTON, timeout=6_000)

                raw_title = await card.locator(S.JOB_CARD_LINK).first.text_content()
                title = (raw_title or "").strip() or None
                job_url = page.url
                await self.ctx.emit({
                    "runId": self.ctx.run_id,
                    "type": "job_found",
                    "jobUrl": job_url,
                    "jobTitle": title,
                    "companyName": None,
                })

                # Gate ANTES de abrir o formulário: vaga reprovada não vira
                # JobApplication e não debita crédito.
                verdict = await fit_gate.passes(
                    self.ctx, platform="infojobs", job_title=title
                )
                if fit_gate.should_skip(verdict, self.ctx.settings.fit_min_score):
                    reason = fit_gate.skip_reason(verdict)
                    logger.info("fit: descartando vaga %s (%s)", title, reason)
                    await record_skip(
                        self.ctx,
                        platform="infojobs",
                        job_url=job_url,
                        job_title=title,
                        company_name=None,
                        reason=reason,
                    )
                    continue

                await page.click(S.APPLY_BUTTON)
                outcome = await execute_apply(
                    self.ctx,
                    platform="infojobs",
                    job_url=job_url,
                    job_title=title,
                    company_name=None,
                )
                if outcome is Outcome.PAUSE_SESSION_INVALID:
                    return

                # CB04: dispense Infojobs retention popup if shown.
                try:
                    await page.click(S.RETENTION_POPUP_DISMISS, timeout=1_500)
                except PlaywrightTimeout:
                    pass
            except PlaywrightTimeout:
                timeouts += 1
                continue

        # SDD §6.4: mesmo agregado do LinkedIn — 1 evento por run, não por vaga.
        if timeouts and timeouts == count and timeouts >= MIN_JOBS_FOR_SELECTOR_ALARM:
            capture_selector_break("apply_open", "APPLY_BUTTON", "infojobs", total_jobs=count)
