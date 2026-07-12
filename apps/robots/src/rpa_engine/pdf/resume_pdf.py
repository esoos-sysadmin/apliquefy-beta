"""ReportLab-based Resume PDF renderer.

Single layout for now (`default`). Extra style ids fall back to the same layout.
The Resume payload is the JSON shape stored in `resumes.personal_info / education / experience / skills`.
"""
from __future__ import annotations

import io
from typing import Any

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer


def _coerce_list(value: Any) -> list[dict[str, Any]]:
    if isinstance(value, list):
        return [v for v in value if isinstance(v, dict)]
    return []


def _personal_block(personal: dict[str, Any], styles) -> list:
    name = personal.get("name") or personal.get("fullName") or "Currículo"
    headline = personal.get("headline") or personal.get("title") or ""
    contact_parts = [
        personal.get("email"),
        personal.get("phone"),
        personal.get("city"),
        personal.get("country"),
        personal.get("linkedin"),
    ]
    contact_line = " · ".join(p for p in contact_parts if p)

    flow = [Paragraph(name, styles["Title"])]
    if headline:
        flow.append(Paragraph(headline, styles["Headline"]))
    if contact_line:
        flow.append(Paragraph(contact_line, styles["Contact"]))
    flow.append(Spacer(1, 0.4 * cm))
    return flow


def _list_section(title: str, items: list[dict[str, Any]], styles, item_renderer) -> list:
    if not items:
        return []
    flow = [Paragraph(title, styles["SectionTitle"]), Spacer(1, 0.15 * cm)]
    for item in items:
        flow.extend(item_renderer(item, styles))
        flow.append(Spacer(1, 0.2 * cm))
    return flow


def _experience_renderer(item: dict[str, Any], styles) -> list:
    role = item.get("role") or item.get("title") or ""
    company = item.get("company") or ""
    period = " — ".join(p for p in [item.get("start"), item.get("end") or "Atual"] if p)
    description = item.get("description") or item.get("summary") or ""
    head = " | ".join(p for p in [role, company, period] if p)

    parts = []
    if head:
        parts.append(Paragraph(head, styles["ItemHeader"]))
    if description:
        parts.append(Paragraph(description.replace("\n", "<br/>"), styles["BodyText"]))
    return parts


def _education_renderer(item: dict[str, Any], styles) -> list:
    course = item.get("course") or item.get("degree") or ""
    school = item.get("school") or item.get("institution") or ""
    period = " — ".join(p for p in [item.get("start"), item.get("end") or "Atual"] if p)
    head = " | ".join(p for p in [course, school, period] if p)
    if not head:
        return []
    return [Paragraph(head, styles["ItemHeader"])]


def _skills_renderer(skills: dict[str, Any] | list[Any], styles) -> list:
    if isinstance(skills, list):
        text = ", ".join(str(s) for s in skills if s)
    elif isinstance(skills, dict):
        groups = []
        for key, value in skills.items():
            if isinstance(value, list):
                groups.append(f"<b>{key}:</b> " + ", ".join(str(v) for v in value if v))
            else:
                groups.append(f"<b>{key}:</b> {value}")
        text = "<br/>".join(groups)
    else:
        text = str(skills or "")
    return [Paragraph(text, styles["BodyText"])] if text else []


def _build_styles():
    base = getSampleStyleSheet()
    styles = {
        "Title": ParagraphStyle("Title", parent=base["Title"], fontSize=22, leading=26),
        "Headline": ParagraphStyle("Headline", parent=base["Normal"], fontSize=12, leading=16, textColor="#444"),
        "Contact": ParagraphStyle("Contact", parent=base["Normal"], fontSize=10, leading=13, textColor="#666"),
        "SectionTitle": ParagraphStyle("SectionTitle", parent=base["Heading2"], fontSize=13, spaceAfter=4, textColor="#1F4E79"),
        "ItemHeader": ParagraphStyle("ItemHeader", parent=base["Normal"], fontSize=11, leading=14, spaceAfter=2),
        "BodyText": ParagraphStyle("BodyText", parent=base["Normal"], fontSize=10, leading=13),
    }
    return styles


def render_resume(payload: dict[str, Any], style_id: str = "default") -> bytes:
    """Render a Resume JSON dict to PDF bytes."""
    _ = style_id  # reserved for future templates
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=2 * cm,
        rightMargin=2 * cm,
        topMargin=1.8 * cm,
        bottomMargin=1.8 * cm,
        title=payload.get("title") or "Currículo",
    )
    styles = _build_styles()

    personal = payload.get("personalInfo") or payload.get("personal_info") or {}
    flow = _personal_block(personal if isinstance(personal, dict) else {}, styles)

    flow.extend(_list_section("Experiência", _coerce_list(payload.get("experience")), styles, _experience_renderer))
    flow.extend(_list_section("Formação", _coerce_list(payload.get("education")), styles, _education_renderer))

    skills = payload.get("skills")
    if skills:
        flow.append(Paragraph("Skills", styles["SectionTitle"]))
        flow.append(Spacer(1, 0.15 * cm))
        flow.extend(_skills_renderer(skills, styles))

    doc.build(flow)
    return buffer.getvalue()
