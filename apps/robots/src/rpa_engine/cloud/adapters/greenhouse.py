"""Adapter Greenhouse (Fase 2). As perguntas vêm da API pública do board, então o
mapeamento campo → resposta é checado ANTES de abrir o navegador (ADR-05): vaga com
pergunta obrigatória sem resposta confiável falha sem gastar sessão no Browserbase."""
from __future__ import annotations

import re

import httpx

from ..answers import Answerer
from ..discovery.canonical import canonical_url
from .base import _GENERIC_SUCCESS, Field, FormAdapter, standard_value

GREENHOUSE = FormAdapter("greenhouse", "button[type=submit]:visible", _GENERIC_SUCCESS)

_CANON = re.compile(r"^https://greenhouse\.io/([^/]+)/jobs/(\d+)$")
_MULTI = "multi_value_multi_select"


def greenhouse_ids(url: str) -> tuple[str, str] | None:
    """(board, job_id) de qualquer uma das três URLs do Greenhouse."""
    m = _CANON.match(canonical_url(url))
    return (m[1], m[2]) if m else None


def apply_url(board: str, job_id: str) -> str:
    # absolute_url costuma ser o site da empresa (gh_jid=…); o embed é o formulário puro,
    # igual para todo board — é nele que o adapter trabalha.
    return f"https://job-boards.greenhouse.io/embed/job_app?for={board}&token={job_id}"


async def fetch_questions(client: httpx.AsyncClient, board: str, job_id: str) -> list[dict]:
    r = await client.get(f"https://boards-api.greenhouse.io/v1/boards/{board}/jobs/{job_id}?questions=true")
    r.raise_for_status()
    return r.json().get("questions") or []


async def precheck(questions: list[dict], answerer: Answerer, resume: dict) -> list[str]:
    """Rótulos das perguntas obrigatórias sem resposta confiável. [] = pode abrir o navegador.
    Arquivo (currículo/carta) e campo padrão do currículo não passam pelo LLM."""
    missing = []
    for q in questions:
        if not q.get("required"):
            continue
        label = (q.get("label") or "").strip()
        fields = q.get("fields") or []
        # Arquivo OU texto colado: o PDF cobre o currículo; carta não geramos (§14).
        if any(f.get("type") == "input_file" for f in fields):
            if not any(f.get("name") == "resume" for f in fields):
                missing.append(label)
            continue
        for f in fields:
            options = [v["label"] for v in f.get("values") or []] or None
            kind = "checkbox" if f.get("type") == _MULTI else ("select" if options else "text")
            probe = Field(i=0, kind=kind, label=label, required=True, options=options, filled=False, key=f.get("name", ""))
            if standard_value(probe, resume) is not None:
                continue
            if await answerer.answer(label, options, multi=f.get("type") == _MULTI) is None:
                missing.append(label)
            break  # uma resposta por pergunta
    return missing
