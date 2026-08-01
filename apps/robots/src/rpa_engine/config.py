"""Runtime configuration loaded from environment variables."""
from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Settings:
    auth_token: str
    user_data_dir: Path
    web_api_url: str
    web_api_token: str | None
    openai_api_key: str | None
    openai_model: str
    cost_per_application: int
    headless: bool
    slow_mo_ms: int
    devtools: bool
    browser_channel: str | None


def load_settings() -> Settings:
    token = os.environ.get("RPA_AUTH_TOKEN")
    if not token:
        raise RuntimeError("RPA_AUTH_TOKEN env var is required")

    user_data = Path(os.environ.get("RPA_USER_DATA_DIR") or Path.home() / ".apliquefy")
    user_data.mkdir(parents=True, exist_ok=True)

    return Settings(
        auth_token=token,
        user_data_dir=user_data,
        web_api_url=os.environ.get("APLIQUEFY_WEB_URL", "http://localhost:3000").rstrip("/"),
        web_api_token=os.environ.get("APLIQUEFY_WEB_TOKEN"),
        openai_api_key=os.environ.get("OPENAI_API_KEY"),
        # browser-use precisa de um modelo capaz de visão+decisão; gpt-4o-mini é
        # fraco pro loop de navegação. Default gpt-4.1-mini (bom custo-benefício).
        openai_model=os.environ.get("OPENAI_MODEL", "gpt-4.1-mini"),
        cost_per_application=max(1, int(os.environ.get("COST_PER_APPLICATION", "1"))),
        headless=os.environ.get("RPA_HEADLESS", "false").lower() == "true",
        # Debug visual: atrasa cada ação em N ms para acompanhar a olho.
        slow_mo_ms=max(0, int(os.environ.get("RPA_SLOWMO", "0"))),
        # Abre o DevTools do Chrome junto (só faz efeito quando headed).
        devtools=os.environ.get("RPA_DEVTOOLS", "false").lower() == "true",
        # Usa o Chrome real (mesmo canal da captura de sessão) para evitar
        # detecção de automação. String vazia => Chromium empacotado.
        browser_channel=(os.environ.get("RPA_BROWSER_CHANNEL", "chrome").strip() or None),
    )
