"""Partes puras do envio pela nuvem: URL canônica, ATS, respostas, pré-checagem do
Greenhouse e o corpo da sessão no Browserbase. O que precisa de navegador fica no spike."""
from __future__ import annotations

import pytest

from rpa_engine.cloud.adapters.base import Field, classify_page_text, standard_value
from rpa_engine.cloud.adapters.greenhouse import greenhouse_ids, precheck
from rpa_engine.cloud.answers import Answerer, fit, match_option
from rpa_engine.cloud.browser import session_payload
from rpa_engine.cloud.discovery.canonical import canonical_url, detect_ats, html_to_text

RESUME = {
    "personalInfo": {
        "name": "Ana Maria Souza", "email": "ana@ex.com", "phone": "+55 81 99999-0000",
        "linkedin": "https://linkedin.com/in/ana", "github": "", "portfolio": "",
        "jobTitle": "Engenheira de Dados", "location": "Recife, PE",
    },
    "experience": [{"current": True, "company": "Acme", "role": "Dados"}],
}


# ── canônica / ATS ──────────────────────────────────────────────────────────

def test_greenhouse_three_urls_same_canonical() -> None:
    want = "https://greenhouse.io/acme/jobs/123"
    assert canonical_url("https://boards.greenhouse.io/acme/jobs/123?gh_src=x") == want
    assert canonical_url("https://job-boards.greenhouse.io/acme/jobs/123/") == want
    assert canonical_url("https://job-boards.greenhouse.io/embed/job_app?for=acme&token=123") == want


def test_canonical_drops_tracking_and_apply_suffix() -> None:
    assert canonical_url("https://jobs.lever.co/acme/abc/apply?lever-source=li&utm_x=1") == \
        "https://jobs.lever.co/acme/abc"
    assert canonical_url("https://www.linkedin.com/jobs/view/42/?trk=x") == "https://linkedin.com/jobs/view/42"


def test_detect_ats() -> None:
    assert detect_ats("https://job-boards.greenhouse.io/acme/jobs/1") == "greenhouse"
    assert detect_ats("https://portal.gupy.io/x") == "gupy"
    assert detect_ats("https://exemplo.com/vaga") is None
    assert detect_ats(None) is None


def test_html_to_text() -> None:
    assert html_to_text("<p>Olá &amp; bem</p><li>um</li>") == "Olá & bem\num"


def test_greenhouse_ids() -> None:
    assert greenhouse_ids("https://job-boards.greenhouse.io/embed/job_app?for=acme&token=9") == ("acme", "9")
    assert greenhouse_ids("https://jobs.lever.co/acme/1") is None


# ── respostas ───────────────────────────────────────────────────────────────

def test_match_option_and_fit() -> None:
    assert match_option("sim", ["Yes", "No"]) == "Yes"
    assert match_option("Yes", ["Yes, I am authorized", "No"]) == "Yes, I am authorized"
    assert match_option("talvez", ["Yes", "No"]) is None
    assert fit("A; B", ["A", "B", "C"], multi=True) == "A; B"
    assert fit("A; Z", ["A", "B"], multi=True) is None


async def test_answerer_never_guesses_without_confidence() -> None:
    calls = []

    async def ask(question, options, resume):
        calls.append(question)
        return ("Yes", question.startswith("Autorizado"))

    a = Answerer(RESUME, ask=ask)
    assert await a.answer("Autorizado a trabalhar?", ["Yes", "No"]) == "Yes"
    assert await a.answer("Precisa de visto?", ["Yes", "No"]) is None  # confident=False → em branco
    assert await a.answer("Autorizado a trabalhar?", ["Yes", "No"]) == "Yes"
    assert calls.count("Autorizado a trabalhar?") == 1  # memo: a pré-checagem e o form perguntam uma vez só


async def test_answerer_without_llm_returns_none() -> None:
    assert await Answerer(RESUME, ask=None).answer("Qualquer coisa?") is None


# ── campos padrão ───────────────────────────────────────────────────────────

def _field(label: str, key: str = "", kind: str = "text") -> Field:
    return Field(i=0, kind=kind, label=label, required=True, options=None, filled=False, key=key)


def test_standard_value() -> None:
    assert standard_value(_field("First Name"), RESUME) == "Ana"
    assert standard_value(_field("Last Name"), RESUME) == "Maria Souza"
    assert standard_value(_field("Email"), RESUME) == "ana@ex.com"
    assert standard_value(_field("Current Company"), RESUME) == "Acme"
    # Label longo com "name" não é o nome do candidato.
    assert standard_value(_field("What is the name of your current manager at work?"), RESUME) is None
    # Padrão, mas vazio no currículo → None (cai no Answerer).
    assert standard_value(_field("GitHub"), RESUME) is None


# ── classificação da página depois do envio ─────────────────────────────────

def test_classify_page_text() -> None:
    assert classify_page_text("https://x/confirmation", "") == "submitted"
    assert classify_page_text("https://x", "Thank you for applying to Acme!") == "submitted"
    assert classify_page_text("https://x", "Please enter the verification code we sent") == "challenge:verificação"
    assert classify_page_text("https://x", "Access denied. You have been blocked.") == "blocked"
    assert classify_page_text("https://x", "Apply for this job") is None


# ── pré-checagem do Greenhouse (antes de abrir o navegador) ─────────────────

QUESTIONS = [
    {"required": True, "label": "First Name", "fields": [{"name": "first_name", "type": "input_text", "values": []}]},
    # Formato real: arquivo OU texto colado. O PDF cobre; o textarea não vai ao LLM.
    {"required": True, "label": "Resume/CV", "fields": [
        {"name": "resume", "type": "input_file", "values": []},
        {"name": "resume_text", "type": "textarea", "values": []}]},
    {"required": True, "label": "Are you authorized to work in Brazil?", "fields": [
        {"name": "question_1", "type": "multi_value_single_select",
         "values": [{"label": "Yes", "value": 1}, {"label": "No", "value": 0}]}]},
    {"required": True, "label": "Desired salary?", "fields": [{"name": "question_2", "type": "input_text", "values": []}]},
    {"required": False, "label": "How did you hear about us?", "fields": [{"name": "question_3", "type": "input_text", "values": []}]},
]


async def test_precheck_lists_only_required_unanswerable() -> None:
    seen = []

    async def ask(question, options, resume):
        seen.append((question, options))
        return ("Yes", True) if "authorized" in question else ("R$ 10 mil", False)

    missing = await precheck(QUESTIONS, Answerer(RESUME, ask=ask), RESUME)
    assert missing == ["Desired salary?"]
    # Padrão e arquivo não vão ao LLM; opcional também não.
    assert [q for q, _ in seen] == ["Are you authorized to work in Brazil?", "Desired salary?"]
    assert seen[0][1] == ["Yes", "No"]


async def test_precheck_required_cover_letter_is_missing() -> None:
    # Não geramos carta (§14): carta obrigatória falha antes de abrir o navegador.
    cover = [{"required": True, "label": "Cover Letter", "fields": [
        {"name": "cover_letter", "type": "input_file", "values": []},
        {"name": "cover_letter_text", "type": "textarea", "values": []}]}]
    assert await precheck(cover, Answerer(RESUME, ask=None), RESUME) == ["Cover Letter"]


# ── sessão no Browserbase (§9.3) ────────────────────────────────────────────

def test_session_payload_proxy_only_for_listed_ats() -> None:
    p = session_payload("proj", "greenhouse", proxy_ats={"greenhouse"})
    assert p["projectId"] == "proj"
    assert p["browserSettings"] == {"solveCaptchas": True, "recordSession": True, "logSession": True}
    assert p["proxies"] == [{"type": "browserbase", "geolocation": {"country": "BR"}}]
    assert "context" not in p["browserSettings"]  # nada de cookie entre candidaturas
    assert "proxies" not in session_payload("proj", "lever", proxy_ats={"greenhouse"})


if __name__ == "__main__":
    raise SystemExit(pytest.main([__file__, "-q"]))


def test_free_text_answer_is_capped() -> None:
    # A pergunta vem do formulário (terceiro): uma resposta que despeja o currículo inteiro
    # não passa. 600 caracteres cobrem "até 3 frases".
    assert fit("x" * 601, None) is None
    assert fit("ok", None) == "ok"
