"""Async HTTP client for the Apliquefy Next.js backend."""
from __future__ import annotations

from typing import Any

import httpx

from ..config import Settings


class WebApiClient:
    def __init__(self, settings: Settings, token: str | None = None) -> None:
        self.settings = settings
        # Token fresco do usuário passado por-run (POST /runs). Fallback pro token
        # de env, que é congelado no spawn do engine e pode estar vazio/expirado.
        auth_token = token or settings.web_api_token
        headers = {"Content-Type": "application/json"}
        if auth_token:
            headers["Authorization"] = f"Bearer {auth_token}"
        self._client = httpx.AsyncClient(base_url=settings.web_api_url, headers=headers, timeout=30)

    async def close(self) -> None:
        await self._client.aclose()

    async def _post(self, path: str, json: dict) -> dict:
        res = await self._client.post(path, json=json)
        res.raise_for_status()
        return res.json()

    async def _get(self, path: str) -> dict:
        res = await self._client.get(path)
        res.raise_for_status()
        return res.json()

    async def _patch(self, path: str, json: dict) -> dict:
        res = await self._client.patch(path, json=json)
        res.raise_for_status()
        return res.json()

    async def get_campaign_runtime(self, campaign_id: str) -> dict[str, Any]:
        body = await self._get(f"/api/campaigns/{campaign_id}/runtime")
        return body["data"]

    async def get_daily_status(self, campaign_id: str) -> dict[str, int]:
        body = await self._get(f"/api/campaigns/{campaign_id}/daily-status")
        return body["data"]

    async def create_application(
        self,
        *,
        campaign_id: str,
        platform: str,
        company_name: str | None,
        job_title: str | None,
        job_url: str | None,
    ) -> dict[str, Any]:
        body = await self._post(
            "/api/job-applications",
            {
                "campaignId": campaign_id,
                "platform": platform,
                "companyName": company_name,
                "jobTitle": job_title,
                "jobUrl": job_url,
            },
        )
        return body["data"]

    async def update_application(
        self,
        *,
        application_id: str,
        status: str | None = None,
        error_log: str | None = None,
    ) -> dict[str, Any]:
        payload: dict[str, Any] = {}
        if status is not None:
            payload["status"] = status
        if error_log is not None:
            payload["errorLog"] = error_log
        body = await self._patch(f"/api/job-applications/{application_id}", payload)
        return body["data"]

    async def debit_flat(
        self,
        *,
        campaign_id: str,
        job_application_id: str,
        idempotency_key: str,
        questions: int = 0,
        steps: int = 0,
    ) -> dict[str, Any]:
        # questions/steps são o esforço medido pelo agente; o web calcula o custo
        # (base + peso por pergunta). Ver debitFlat no credits.service.
        body = await self._post(
            "/api/credits/debit-flat",
            {
                "campaignId": campaign_id,
                "jobApplicationId": job_application_id,
                "idempotencyKey": idempotency_key,
                "questions": questions,
                "steps": steps,
            },
        )
        return body["data"]
