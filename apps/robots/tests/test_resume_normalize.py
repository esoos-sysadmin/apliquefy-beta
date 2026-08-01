"""A forma que o banco realmente grava (resumeSchema do web) tem que sobreviver
até o prompt e até o PDF. Cada assert aqui é um campo que já se perdeu calado."""
from datetime import date

from rpa_engine.util.resume import is_empty, months_to_years, normalize

# Cópia fiel de um registro de `resumes` (nomes do form web, não os inventados).
DB_ROW = {
    "title": "Currículo Engenheiro de IA",
    "personalInfo": {
        "name": "Luiz Gomes",
        "jobTitle": "Engenheiro de Inteligência Artificial",
        "seniority": "Pleno",
        "email": "luiz@example.com",
        "contact": "81 98377-2043",
        "address": "Recife - PE",
        "linkedinUrl": "https://linkedin.com/in/luiz",
        "desiredSalary": "7000",
        "professionalSummary": "Engenheiro de IA",
    },
    "experience": [
        {
            "companyName": "Secretaria Estadual de Saúde",
            "jobArea": "Inteligência Artificial",
            "jobType": "CLT",
            "jobStartDate": "2025-06",
            "jobEndDate": "",
            "isActualJob": True,
            "description": "Modelos de IA e automações com Python e n8n.",
        },
        {
            "companyName": "EOGAN",
            "jobArea": "Desenvolvimento Full Stack",
            "jobType": "CLT",
            "jobStartDate": "2022-01",
            "jobEndDate": "2024-02",
            "isActualJob": False,
            "description": "Liderança técnica.",
        },
    ],
    "education": [
        {
            "nameOfGraduation": "Tecnólogo em Análise e Desenvolvimento de Sistemas",
            "nameOfInstitution": "Faculdade Nova Roma",
            "StartDateOfGraduation": "2022-01",
            "EndDateOfGraduation": "2024-01",
        }
    ],
    "skills": ["Python", "Django"],
}


def test_maps_the_field_names_the_form_actually_saves() -> None:
    r = normalize(DB_ROW)

    assert r["personalInfo"]["phone"] == "81 98377-2043"
    assert r["personalInfo"]["location"] == "Recife - PE"
    assert r["personalInfo"]["linkedin"] == "https://linkedin.com/in/luiz"
    assert r["personalInfo"]["desiredSalary"] == "7000"
    assert r["experience"][0]["company"] == "Secretaria Estadual de Saúde"
    assert r["experience"][0]["role"] == "Inteligência Artificial"
    assert r["experience"][0]["startDate"] == "2025-06"
    assert r["education"][0]["institution"] == "Faculdade Nova Roma"
    assert r["education"][0]["course"].startswith("Tecnólogo")


def test_duration_is_computed_so_the_llm_does_not_do_date_math() -> None:
    """A pergunta 'quantos anos de X' era respondida com 0 por falta desse número."""
    r = normalize(DB_ROW)
    today = date.today()

    atual = r["experience"][0]
    assert atual["current"] is True
    assert atual["durationMonths"] == (today.year - 2025) * 12 + today.month - 6
    # 2022-01 → 2024-02
    assert r["experience"][1]["durationMonths"] == 25
    assert r["totalExperienceMonths"] == atual["durationMonths"] + 25
    assert months_to_years(25) == 2
    assert months_to_years(None) == 0


def test_survives_garbage_without_raising() -> None:
    for junk in (None, [], "x", {"experience": "nope", "personalInfo": None}):
        r = normalize(junk)
        assert r["experience"] == [] and r["skills"] == []
        assert is_empty(r)
    assert not is_empty(normalize(DB_ROW))
