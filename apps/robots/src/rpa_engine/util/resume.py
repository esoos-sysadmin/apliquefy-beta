"""Forma canônica do currículo, única para todos os consumidores do engine.

O JSONB de `resumes` guarda o que o form web valida (`resumeSchema` em
`apps/web/app/lib/validations/resume.ts`): `companyName`, `jobArea`,
`jobStartDate`, `isActualJob`, `nameOfInstitution`, `StartDateOfGraduation`…
Os consumidores daqui liam nomes inventados (`company`, `role`, `start`,
`school`, `phone`) que nunca existiram no banco — e como ler chave ausente é
silencioso, o PDF saía sem empresa, sem cargo, sem datas e sem formação, e o
agente não achava no JSON os campos que o próprio prompt mandava usar.

Cada consumidor traduzir por conta própria só multiplica esse erro, então a
tradução mora aqui e todo mundo lê `normalize()`. Aceita os dois jogos de nomes
(o do form e o "curto") porque o schema web ainda permite os dois em
personalInfo (`contact|phone`, `linkedin|linkedinUrl`, `summary|professionalSummary`).

`durationMonths` é calculado aqui de propósito: pergunta de "anos de experiência"
é a mais comum do Easy Apply e deixar o LLM fazer aritmética de data em cima de
"2022-01" era chute desnecessário — o número vem pronto.
"""
from __future__ import annotations

from datetime import date
from typing import Any

__all__ = ["normalize", "months_to_years", "is_empty"]


def _pick(src: dict[str, Any], *keys: str) -> str:
    """Primeiro valor não-vazio entre as chaves, já como string limpa."""
    for key in keys:
        value = src.get(key)
        if value not in (None, ""):
            return str(value).strip()
    return ""


def _dicts(value: Any) -> list[dict[str, Any]]:
    return [v for v in value if isinstance(v, dict)] if isinstance(value, list) else []


def _parse_ym(value: str) -> tuple[int, int] | None:
    """'2025-06' (ou '2025-06-01', '06/2025') -> (2025, 6). Qualquer outra coisa -> None."""
    value = value.strip()
    if not value:
        return None
    if "/" in value:  # form antigo digitava MM/AAAA
        month, _, year = value.partition("/")
        parts = [year, month]
    else:
        parts = value.split("-")[:2]
    try:
        year, month = int(parts[0]), int(parts[1]) if len(parts) > 1 else 1
    except (ValueError, IndexError):
        return None
    return (year, month) if 1 <= month <= 12 else None


def _duration_months(start: str, end: str, current: bool) -> int | None:
    """Meses entre início e fim. None quando não dá para saber o início."""
    begin = _parse_ym(start)
    if begin is None:
        return None
    today = date.today()
    finish = None if current else _parse_ym(end)
    if finish is None:
        finish = (today.year, today.month)
    return max(0, (finish[0] - begin[0]) * 12 + finish[1] - begin[1])


def months_to_years(months: int | None) -> int:
    """Meses -> anos inteiros arredondando para baixo (0 quando desconhecido)."""
    return months // 12 if months else 0


def _experience(item: dict[str, Any]) -> dict[str, Any]:
    start = _pick(item, "jobStartDate", "startDate", "start")
    end = _pick(item, "jobEndDate", "endDate", "end")
    current = bool(item.get("isActualJob") or item.get("current")) or (not end and bool(start))
    return {
        # O form não tem campo de cargo: `jobArea` é o que mais se aproxima dele.
        "role": _pick(item, "jobArea", "position", "role", "title"),
        "company": _pick(item, "companyName", "company"),
        "jobType": _pick(item, "jobType"),
        "startDate": start,
        "endDate": "" if current else end,
        "current": current,
        "durationMonths": _duration_months(start, end, current),
        "description": _pick(item, "description", "summary"),
        "certifications": [
            c for c in _dicts(item.get("certifications")) if _pick(c, "titulo", "title")
        ],
    }


def _education(item: dict[str, Any]) -> dict[str, Any]:
    return {
        "course": _pick(item, "nameOfGraduation", "degree", "course"),
        "institution": _pick(item, "nameOfInstitution", "institution", "school"),
        "startDate": _pick(item, "StartDateOfGraduation", "startDate", "start"),
        "endDate": _pick(item, "EndDateOfGraduation", "endDate", "end"),
    }


def normalize(payload: Any) -> dict[str, Any]:
    """Currículo cru do banco -> forma canônica. Nunca levanta: entrada torta vira vazio."""
    payload = payload if isinstance(payload, dict) else {}
    personal = payload.get("personalInfo") or payload.get("personal_info") or {}
    personal = personal if isinstance(personal, dict) else {}

    experience = [_experience(i) for i in _dicts(payload.get("experience"))]
    total_months = sum(e["durationMonths"] or 0 for e in experience)

    return {
        "title": _pick(payload, "title"),
        "personalInfo": {
            "name": _pick(personal, "name", "fullName"),
            "jobTitle": _pick(personal, "jobTitle", "headline", "title"),
            "seniority": _pick(personal, "seniority"),
            "email": _pick(personal, "email"),
            "phone": _pick(personal, "contact", "phone"),
            "location": _pick(personal, "location", "address", "city"),
            "linkedin": _pick(personal, "linkedinUrl", "linkedin"),
            "github": _pick(personal, "github"),
            "portfolio": _pick(personal, "portfolio"),
            "desiredSalary": _pick(personal, "desiredSalary"),
            "summary": _pick(personal, "professionalSummary", "summary"),
        },
        "experience": experience,
        "education": [_education(i) for i in _dicts(payload.get("education"))],
        "skills": [str(s).strip() for s in (payload.get("skills") or []) if s],
        # Currículo salvo antes da coluna `idioms` existir vem sem a chave: [] e o
        # prompt trata como "não informado".
        "idioms": [
            {"language": _pick(i, "language"), "level": _pick(i, "level")}
            for i in _dicts(payload.get("idioms"))
            if _pick(i, "language")
        ],
        "totalExperienceMonths": total_months,
    }


def is_empty(resume: dict[str, Any]) -> bool:
    """Currículo sem nada que dê para preencher uma candidatura."""
    return not (resume["experience"] or resume["skills"] or resume["education"])
