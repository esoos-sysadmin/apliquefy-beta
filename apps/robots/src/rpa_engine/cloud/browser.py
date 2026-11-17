"""Navegador gerenciado (Browserbase) via API REST: uma sessão nova por candidatura,
encerrada no fim (ADR-06, §9.2). httpx puro: o SDK não traz nada que 3 chamadas não façam."""
from __future__ import annotations

import logging
from dataclasses import dataclass

import httpx

logger = logging.getLogger(__name__)

API = "https://api.browserbase.com/v1"


def session_payload(project_id: str, ats: str, proxy_ats: set[str]) -> dict:
    """Corpo do POST /v1/sessions conforme a §9.3. Sem `context`: nenhum cookie
    sobrevive à candidatura. Proxy residencial só nos ATS de ATS_PROXY (é o item mais caro)."""
    body: dict = {
        "projectId": project_id,
        "browserSettings": {"solveCaptchas": True, "recordSession": True, "logSession": True},
    }
    if ats in proxy_ats:
        body["proxies"] = [{"type": "browserbase", "geolocation": {"country": "BR"}}]
    return body


@dataclass
class Session:
    id: str
    connect_url: str


class Browserbase:
    def __init__(self, api_key: str, project_id: str, proxy_ats: set[str]) -> None:
        self.project_id, self.proxy_ats = project_id, proxy_ats
        self._http = httpx.AsyncClient(base_url=API, headers={"X-BB-API-Key": api_key}, timeout=30)

    async def aclose(self) -> None:
        await self._http.aclose()

    async def open(self, ats: str) -> Session:
        r = await self._http.post("/sessions", json=session_payload(self.project_id, ats, self.proxy_ats))
        r.raise_for_status()
        body = r.json()
        return Session(id=body["id"], connect_url=body["connectUrl"])

    async def live_view_url(self, session_id: str) -> str:
        r = await self._http.get(f"/sessions/{session_id}/debug")
        r.raise_for_status()
        return r.json()["debuggerFullscreenUrl"]

    async def close(self, session_id: str) -> None:
        """Nunca levanta: roda no `finally` do ciclo da candidatura."""
        try:
            r = await self._http.post(
                f"/sessions/{session_id}", json={"projectId": self.project_id, "status": "REQUEST_RELEASE"}
            )
            r.raise_for_status()
        except Exception as exc:  # noqa: BLE001
            logger.warning("browserbase: não encerrou a sessão %s: %s", session_id, type(exc).__name__)
