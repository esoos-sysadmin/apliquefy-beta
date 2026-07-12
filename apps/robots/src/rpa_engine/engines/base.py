"""Common engine contract and shared types."""
from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any, Awaitable, Callable

from browser_use import BrowserSession
from playwright.async_api import Page

from ..config import Settings
from ..web_api.client import WebApiClient


@dataclass
class EngineContext:
    page: Page  # Playwright (CDP) — passos mecânicos: busca, filtros, abrir vaga
    browser_session: BrowserSession  # browser-use — apply cognitivo no mesmo browser
    campaign: dict[str, Any]
    resume: dict[str, Any]
    resume_pdf_path: str
    client: WebApiClient
    settings: Settings
    emit: Callable[[dict[str, Any]], Awaitable[None]]
    run_id: str


class BaseEngine(ABC):
    def __init__(self, context: EngineContext) -> None:
        self.ctx = context

    @abstractmethod
    async def execute(self) -> None:
        ...
