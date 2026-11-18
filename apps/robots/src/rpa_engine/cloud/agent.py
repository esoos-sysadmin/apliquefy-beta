"""Agente genérico (browser-use) para os ATS sem adapter (ADR-05, §7.5): Workable,
Recruitee, Breezy, Teamtailor e Quickin. É o mesmo `run_apply_agent` do desktop, com
prompt próprio e o LLM direto na OpenAI, porque o proxy /api/ai exige sessão Clerk.

Diferenças do desktop: o PDF é anexado pelo próprio agente (`available_file_paths`), já
que no formulário de ATS não existe outro currículo para ele confundir. A navegação fica
presa ao domínio do ATS (`allowed_domains`): o currículo só pode ser digitado ali."""
from __future__ import annotations

import json
import os

from browser_use import BrowserSession, ChatOpenAI

from ..runtime.apply_agent import ANSWER_RULES, SKIP_MARKER, AgentRun, run_apply_agent
from ..runtime.state_machine import Outcome
from .browser import Browserbase
from .discovery.canonical import ATS_HOSTS
from .form_run import FormResult

AGENT_ATS = {"workable", "recruitee", "breezy", "teamtailor", "quickin"}


def build_task(ats: str, resume: dict, job_title: str | None) -> str:
    # Sem a URL no texto: o currículo tem outras URLs (LinkedIn, GitHub) e o browser-use
    # não abre nenhuma quando acha mais de uma. A vaga entra como ação inicial.
    vaga = f" para a vaga '{job_title}'" if job_title else ""
    return (
        f"Você está no formulário de candidatura do {ats}{vaga}. Sua tarefa é PREENCHER e "
        "ENVIAR a candidatura.\n\n"
        "Regras:\n"
        "- Preencha os campos usando SOMENTE os dados do currículo abaixo.\n"
        "- Anexe o currículo com `upload_file` no campo de currículo/CV, usando o único "
        "arquivo disponível. Nunca anexe esse arquivo em campo de carta de apresentação ou "
        "de outro documento.\n"
        "- NUNCA crie conta nem faça login. Se o site exigir, chame `done` com "
        "success=false e a mensagem 'CONTA: exige login'.\n"
        "- Captcha ou código de verificação: não tente resolver. Chame `done` com "
        "success=false e a mensagem 'DESAFIO: <o que apareceu>'.\n"
        + ANSWER_RULES +
        "- Só chame `done` com success=true depois de enviar e ver a confirmação do site.\n"
        f"- NUNCA use '{SKIP_MARKER}' para desistir por problema técnico (botão que não "
        "avança, campo travado). Nesse caso chame `done` com success=false descrevendo o "
        "que travou.\n\n"
        f"Currículo (JSON): {json.dumps(resume, ensure_ascii=False)}"
    )


def agent_result(run: AgentRun) -> FormResult:
    if run.outcome is Outcome.SUCCESS:
        return FormResult("submitted", "", run.questions)
    log = (run.error_log or "").strip()
    if run.outcome is Outcome.SKIP_UNANSWERABLE:
        return FormResult("missing", log[len(SKIP_MARKER):].strip(), run.questions)
    if log.startswith("agent crashed"):
        log = "crash"  # a mensagem da exceção pode ter dado do formulário: não vai para a web
    if log.upper().startswith("DESAFIO:"):
        return FormResult("challenge", log[len("DESAFIO:"):].strip()[:500], run.questions)
    return FormResult("agent", log[:500] or "não concluiu", run.questions)


def _domains(ats: str) -> list[str]:
    return [p for d, a in ATS_HOSTS.items() if a == ats for p in (d, f"*.{d}")]


async def run_agent(bb: Browserbase, ats: str, url: str, resume: dict, pdf: str,
                    job_title: str | None = None) -> FormResult:
    session = await bb.open(ats)
    browser = BrowserSession(cdp_url=session.connect_url, allowed_domains=_domains(ats))
    try:
        llm = ChatOpenAI(model=os.environ.get("OPENAI_MODEL", "gpt-4.1-mini"),
                         api_key=os.environ.get("OPENAI_API_KEY"))
        run = await run_apply_agent(
            task=build_task(ats, resume, job_title), llm=llm, browser_session=browser,
            platform=ats, job_url=url, available_file_paths=[pdf], directly_open_url=False,
            initial_actions=[{"navigate": {"url": url, "new_tab": False}}],
        )
        return agent_result(run)
    finally:
        try:
            await browser.kill()
        except Exception:  # noqa: BLE001 — a sessão no provedor é encerrada logo abaixo
            pass
        await bb.close(session.id)
