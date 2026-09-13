"""Gate de aderência: decide se vale gastar uma candidatura nesta vaga.

Sem ele, a campanha candidata em TUDO que a busca devolveu — e busca por palavra-chave
devolve vaga que exige inglês fluente para quem não fala inglês, sênior para júnior,
formação que o candidato não tem. Cada uma dessas custa 1 crédito do usuário, ~45 passos
de agente com visão e uma rejeição no histórico dele.

O gate roda ANTES de abrir o formulário: uma chamada de LLM só-texto (sem screenshot)
contra a descrição da vaga. Vaga reprovada não vira JobApplication e não debita nada.

Adaptado do framework de avaliação do ai-job-search (MIT, MadsLorentzen) com duas
mudanças que o nosso contexto exige:
  - Lá existe um humano para desempatar, então requisito de idioma acima do nível
    declarado vira "FLAG, pergunte ao candidato". Aqui não há humano no loop: FLAG não
    bloqueia, só derruba a nota.
  - Elegibilidade lá é cidadania/visto (mercado internacional). Aqui é requisito
    eliminatório do anúncio brasileiro: formação exigida, CNH, certificação obrigatória,
    exigência de morar em outro país.

ponytail: uma nota 0-100 só, não as cinco dimensões separadas do original. O consumidor
é um `if score < limiar` — cinco números para colapsar num só é relatório que ninguém lê.
Separar quando a nota por dimensão aparecer na UI.
"""
from __future__ import annotations

import json
import logging

from browser_use import ChatOpenAI
from browser_use.llm.messages import SystemMessage, UserMessage
from pydantic import BaseModel, Field

from ..observability import breadcrumb
from ..util.resume import normalize

logger = logging.getLogger(__name__)

# Prefixo do errorLog de vaga descartada pelo gate. Mesma convenção do SKIP_MARKER do
# apply_agent: o motivo é texto livre do LLM, então o web agrupa pelo prefixo e mostra
# o texto inteiro na linha do histórico. Sem ele, cada frase distinta virava um bucket.
FIT_MARKER = "FIT:"

# Descrição da vaga na página aberta. Lista genérica + fallback para o <main>: o gate
# NUNCA pode ser o motivo de um run não candidatar, então seletor que quebrou cai no
# texto da página inteira em vez de virar erro.
_DESCRIPTION_SELECTORS = (
    "#job-details",
    ".jobs-description__content",
    ".jobs-box__html-content",
    "[class*='vacancydetail' i]",
    "[class*='job-description' i]",
    "main",
)

# Acima disso é boilerplate do rodapé (vagas relacionadas, sobre a empresa, cookies).
_MAX_DESCRIPTION_CHARS = 6_000
# Abaixo disso não é descrição: é página meio carregada. Não dá para julgar — deixa passar.
_MIN_DESCRIPTION_CHARS = 200


class FitVerdict(BaseModel):
    """Resposta estruturada do avaliador."""

    score: int = Field(ge=0, le=100)
    blocker: str = Field(
        default="",
        description="Requisito eliminatório que o currículo não atende. Vazio se não houver.",
    )
    reason: str = Field(default="", description="Uma frase, em português.")

    @property
    def blocked(self) -> bool:
        return bool(self.blocker.strip())


_SYSTEM = (
    "Você avalia a aderência entre um currículo e uma vaga. Responda apenas com o "
    "JSON pedido, em português.\n\n"
    "PRIMEIRO, os dois bloqueios. Eles não são nota — são eliminação:\n"
    "1. REQUISITO ELIMINATÓRIO: o anúncio exige, como condição obrigatória, algo que o "
    "currículo não tem — formação concluída específica, certificação ou registro em "
    "conselho, CNH, ou residir em outro país. Cite o trecho do anúncio em `blocker`. "
    "Requisito escrito como desejável, diferencial ou 'será um plus' NÃO bloqueia.\n"
    "2. IDIOMA: o anúncio exige, como condição do trabalho, um idioma que NÃO aparece "
    "em `idioms` do currículo. Bloqueia. Atenção: exigir idioma que o candidato TEM, só "
    "que num nível acima do declarado, NÃO bloqueia — reduz a nota e segue. E o idioma "
    "em que o anúncio está escrito não é requisito do cargo.\n\n"
    "Só se nenhum dos dois bloquear, dê a nota 0-100 pesando, nesta ordem: quanto das "
    "competências obrigatórias o currículo cobre; se a experiência bate em FUNÇÃO e não "
    "em título de cargo (um 'Analista de Dados' e um 'Cientista de Dados' podem ser o "
    "mesmo trabalho); e se a senioridade pedida bate com o tempo de carreira "
    "(`totalExperienceMonths`). 80+ = requisitos centrais são as habilidades principais "
    "do candidato; 60-79 = a maioria bate, uma ou duas lacunas aprendíveis; 40-59 = "
    "parcial, exige requalificação; abaixo de 40 = incompatível. Havendo bloqueio, "
    "devolva score 0."
)


async def _read_description(page) -> str:
    for selector in _DESCRIPTION_SELECTORS:
        try:
            element = page.locator(selector).first
            if await element.count() == 0:
                continue
            text = (await element.inner_text(timeout=3_000) or "").strip()
        except Exception:  # noqa: BLE001 — página re-renderizando; tenta o próximo
            continue
        if len(text) >= _MIN_DESCRIPTION_CHARS:
            return text[:_MAX_DESCRIPTION_CHARS]
    return ""


async def passes(ctx, *, platform: str, job_title: str | None) -> FitVerdict | None:
    """Avalia a vaga aberta na página. `None` = não avaliou, siga com a candidatura.

    Fail-open de propósito: gate desligado, descrição ilegível, LLM fora do ar ou resposta
    torta NUNCA impedem uma candidatura. O custo de deixar passar uma vaga ruim é 1
    crédito; o de barrar todas por um seletor quebrado é a campanha inteira do usuário.
    """
    minimum = ctx.settings.fit_min_score
    if minimum <= 0 or not ctx.settings.openai_api_key:
        return None

    description = await _read_description(ctx.page)
    if not description:
        logger.info("fit: descrição não encontrada, candidatando sem avaliar")
        breadcrumb("fit_gate", "descrição ilegível", platform=platform)
        return None

    resume_json = json.dumps(normalize(ctx.resume), ensure_ascii=False)
    llm = ChatOpenAI(model=ctx.settings.openai_model, api_key=ctx.settings.openai_api_key)
    try:
        result = await llm.ainvoke(
            [
                SystemMessage(content=_SYSTEM),
                UserMessage(
                    content=(
                        f"VAGA ({platform}) — {job_title or 'sem título'}\n{description}\n\n"
                        f"CURRÍCULO (JSON): {resume_json}"
                    )
                ),
            ],
            output_format=FitVerdict,
        )
    except Exception as exc:  # noqa: BLE001
        logger.warning("fit: avaliação falhou (%s), candidatando sem avaliar", exc)
        breadcrumb("fit_gate", "avaliação falhou", error=type(exc).__name__)
        return None

    verdict = result.completion
    logger.info(
        "fit: score=%s blocker=%r vaga=%r", verdict.score, verdict.blocker, job_title
    )
    return verdict


def should_skip(verdict: FitVerdict | None, minimum: int) -> bool:
    """Traduz o veredito em decisão. Separado de `passes` para ser testável sem LLM."""
    if verdict is None:
        return False
    return verdict.blocked or verdict.score < minimum


def skip_reason(verdict: FitVerdict) -> str:
    """Motivo do descarte como ele aparece para o usuário em /relatorios."""
    if verdict.blocked:
        return f"{FIT_MARKER} requisito não atendido — {verdict.blocker.strip()}"
    detail = verdict.reason.strip() or "perfil distante do exigido pela vaga"
    return f"{FIT_MARKER} aderência {verdict.score}/100 — {detail}"
