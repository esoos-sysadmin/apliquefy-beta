from types import SimpleNamespace

import pytest
from playwright.async_api import async_playwright

from rpa_engine.runtime.fit_gate import (
    _MIN_DESCRIPTION_CHARS,
    FIT_MARKER,
    FitVerdict,
    _read_description,
    _SYSTEM,
    passes,
    should_skip,
    skip_reason,
)


def _verdict(**kwargs) -> FitVerdict:
    return FitVerdict(**{"score": 90, "blocker": "", "reason": "", **kwargs})


def test_blocker_skips_regardless_of_score() -> None:
    # Bloqueio é eliminação, não nota: mesmo com 100 a vaga não vale candidatura.
    assert should_skip(_verdict(score=100, blocker="exige CRM ativo"), minimum=50)


def test_score_below_minimum_skips_and_above_applies() -> None:
    assert should_skip(_verdict(score=30), minimum=50)
    assert not should_skip(_verdict(score=50), minimum=50)  # limiar é inclusivo


def test_no_verdict_never_blocks() -> None:
    """Fail-open: gate desligado ou avaliação falha não pode impedir a candidatura —
    barrar todas por um seletor quebrado custa a campanha inteira do usuário."""
    assert not should_skip(None, minimum=90)


def test_skip_reason_prefixes_the_marker_and_prefers_the_blocker() -> None:
    """O prefixo é o que o web usa para agrupar (classifyErrorLog); sem ele cada frase
    do LLM viraria um bucket de contagem 1 no painel."""
    blocked = skip_reason(_verdict(score=0, blocker="exige CNH categoria D", reason="x"))
    assert blocked.startswith(FIT_MARKER)
    assert "CNH categoria D" in blocked and "0/100" not in blocked

    low = skip_reason(_verdict(score=41, reason="sem experiência com Java"))
    assert low.startswith(FIT_MARKER)
    assert "41/100" in low and "sem experiência com Java" in low


def test_skip_reason_never_comes_out_empty() -> None:
    # errorLog vazio cai no bucket "Sem detalhe" do web e não explica nada ao usuário.
    assert skip_reason(_verdict(score=10, reason="")).strip() != FIT_MARKER


def test_system_prompt_keeps_the_two_gates_apart_from_scoring() -> None:
    # Requisito desejável não elimina; era o erro óbvio de um gate ingênuo.
    assert "desejável" in _SYSTEM and "NÃO bloqueia" in _SYSTEM
    # Sem humano no loop, idioma acima do nível declarado derruba a nota mas não barra.
    assert "reduz a nota e segue" in _SYSTEM
    # O idioma do anúncio não é requisito do cargo.
    assert "idioma em que o anúncio está escrito não é requisito" in _SYSTEM
    # Função > título de cargo.
    assert "FUNÇÃO" in _SYSTEM


@pytest.mark.asyncio
async def test_gate_is_off_by_default_and_costs_no_llm_call() -> None:
    ctx = SimpleNamespace(
        settings=SimpleNamespace(fit_min_score=0, openai_api_key="sk-x", openai_model="m"),
        page=None,  # tocar na página já seria erro: o gate desligado sai antes disso
        resume={},
    )
    assert await passes(ctx, platform="linkedin", job_title="Dev") is None


@pytest.fixture
async def page():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(channel="chrome")
        pg = await browser.new_page()
        yield pg
        await browser.close()


@pytest.mark.asyncio
async def test_reads_description_from_the_job_container(page) -> None:
    body = "Buscamos pessoa desenvolvedora Python. " * 20
    await page.set_content(f"<main><div id='job-details'>{body}</div></main>")
    assert "desenvolvedora Python" in await _read_description(page)


@pytest.mark.asyncio
async def test_falls_back_to_main_when_the_container_selector_breaks(page) -> None:
    body = "Vaga para pessoa engenheira de dados com experiência em ETL. " * 20
    await page.set_content(f"<main>{body}</main>")
    assert "engenheira de dados" in await _read_description(page)


@pytest.mark.asyncio
async def test_page_too_short_is_not_a_description(page) -> None:
    # Página meio carregada não dá para julgar — melhor candidatar do que barrar no escuro.
    await page.set_content("<main>Carregando...</main>")
    assert await _read_description(page) == ""
    assert _MIN_DESCRIPTION_CHARS > 0
