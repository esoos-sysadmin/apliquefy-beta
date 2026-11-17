"""Configuração do worker da nuvem a partir do env (SDD-candidatura-nuvem §11)."""
from __future__ import annotations

import os
import socket
from dataclasses import dataclass


def _set(name: str, default: str) -> set[str]:
    return {x.strip().lower() for x in os.environ.get(name, default).split(",") if x.strip()}


@dataclass(frozen=True)
class CloudSettings:
    web_url: str
    worker_token: str
    worker_id: str
    concurrency: int
    browser_api_key: str
    browser_project_id: str
    ats_proxy: set[str]
    supported_ats: set[str]
    apify_token: str
    apify_actor: str
    discovery_interval_hours: float
    handoff_timeout_min: float


def load_cloud_settings() -> CloudSettings:
    web_url = os.environ.get("APLIQUEFY_WEB_URL", "").rstrip("/")
    token = os.environ.get("WORKER_API_TOKEN", "")
    if not web_url or not token:
        raise RuntimeError("APLIQUEFY_WEB_URL e WORKER_API_TOKEN são obrigatórios")
    return CloudSettings(
        web_url=web_url,
        worker_token=token,
        worker_id=os.environ.get("WORKER_ID") or socket.gethostname(),
        concurrency=max(1, int(os.environ.get("WORKER_CONCURRENCY", "2"))),
        browser_api_key=os.environ.get("BROWSER_PROVIDER_API_KEY", ""),
        browser_project_id=os.environ.get("BROWSER_PROVIDER_PROJECT_ID", ""),
        ats_proxy=_set("ATS_PROXY", "greenhouse,ashby"),
        # Pausa um ATS sem deploy: tirar daqui para de enfileirar e de enviar.
        supported_ats=_set("SUPPORTED_ATS", "greenhouse"),
        apify_token=os.environ.get("APIFY_TOKEN", ""),
        apify_actor=os.environ.get("APIFY_LINKEDIN_ACTOR", "harvestapi~linkedin-job-search"),
        discovery_interval_hours=float(os.environ.get("DISCOVERY_INTERVAL_HOURS", "24")),
        # 0 desliga o handoff: desafio vira falha direta (DESAFIO:).
        handoff_timeout_min=float(os.environ.get("HANDOFF_TIMEOUT_MIN", "10")),
    )
