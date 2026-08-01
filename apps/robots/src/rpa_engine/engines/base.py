"""Common engine contract and shared types."""
from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any, Awaitable, Callable

from browser_use import BrowserSession
from playwright.async_api import Page

from ..config import Settings
from ..web_api.client import WebApiClient


class BusinessError(Exception):
    """Falha esperada e já modelada no produto.

    NÃO vai para o Sentry (ADR-04): o ciclo de vida dela vive no Postgres ou no
    evento de WebSocket que o desktop já trata. Mandar isso para o error tracking
    destrói o sinal e estoura a cota.
    """


class SessionInvalidError(BusinessError):
    """Cookie de sessão morto no servidor da plataforma. O desktop pausa a
    campanha e pede reconexão a partir do evento `paused/session_invalid`."""


class CampaignMisconfiguredError(BusinessError):
    """Campanha em estado que impede o run (ex.: currículo excluído na web)."""


class SelectorNotFoundError(Exception):
    """Seletor mecânico esperado não existe mais na página. ESTE vai para o
    Sentry, com fingerprint por (plataforma × passo × seletor) — §6.5.

    `selector_key` é o nome da constante em `selectors.py`, não o valor do
    seletor: o agrupamento tem que sobreviver à correção do seletor.
    """

    def __init__(self, selector_key: str, *, step: str, platform: str, detail: str = "") -> None:
        self.selector_key = selector_key
        self.step = step
        self.platform = platform
        suffix = f": {detail}" if detail else ""
        super().__init__(f"seletor não encontrado: {selector_key} ({platform}/{step}){suffix}")


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
