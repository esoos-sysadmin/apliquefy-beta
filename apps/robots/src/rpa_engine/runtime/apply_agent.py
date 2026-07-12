"""Apply cognitivo via browser-use.

Substitui o loop caseiro (screenshot → LLM JSON → dispatch Playwright). O engine
mecânico deixa a página da vaga aberta com o formulário de candidatura iniciado;
aqui o Agent do browser-use assume: preenche com os dados do currículo, faz
upload do PDF (via `available_file_paths`) e envia.

Mantém intacta a regra de negócio ao redor: cria a JobApplication, atualiza
status e debita crédito só em sucesso (idempotente por candidatura).
"""
from __future__ import annotations

import json
import logging

from browser_use import Agent, ChatOpenAI

from ..engines.base import EngineContext
from .state_machine import Outcome

logger = logging.getLogger(__name__)

APPLY_MAX_STEPS = 25

_STATUS_BY_OUTCOME = {
    Outcome.SUCCESS: "applied",
    Outcome.SKIP_UNANSWERABLE: "skipped",
    Outcome.SKIP_DEAD_SCREEN: "skipped",
    Outcome.PAUSE_RETRY: "failed",
    Outcome.PAUSE_MISSING_DATA: "failed",
    Outcome.PAUSE_SESSION_INVALID: "failed",
    Outcome.CONTINUE: "failed",
}


def _build_task(ctx: EngineContext, platform: str, job_title: str | None) -> str:
    resume_json = json.dumps(ctx.resume, ensure_ascii=False)
    vaga = f" para a vaga '{job_title}'" if job_title else ""
    return (
        f"Você está numa página do {platform} com o formulário de candidatura{vaga} "
        "já iniciado. Sua tarefa é COMPLETAR e ENVIAR a candidatura.\n\n"
        "Regras:\n"
        "- Preencha os campos usando SOMENTE os dados do currículo abaixo.\n"
        "- Se pedirem para anexar currículo/CV, faça upload do arquivo PDF disponível.\n"
        "- NÃO invente respostas. Se uma pergunta OBRIGATÓRIA não puder ser respondida "
        "com os dados do currículo, chame `done` com success=false explicando o motivo, "
        "SEM enviar a candidatura.\n"
        "- Avance pelas etapas (Avançar/Revisar) até enviar. Ao enviar com sucesso, "
        "chame `done` com success=true.\n\n"
        f"Currículo (JSON): {resume_json}"
    )


async def execute_apply(
    ctx: EngineContext,
    *,
    platform: str,
    job_url: str,
    job_title: str | None,
    company_name: str | None,
) -> Outcome:
    application = await ctx.client.create_application(
        campaign_id=ctx.campaign["id"],
        platform=platform,
        company_name=company_name,
        job_title=job_title,
        job_url=job_url,
    )
    application_id = application["id"]
    await ctx.emit({"runId": ctx.run_id, "type": "applying", "jobApplicationId": application_id})

    llm = ChatOpenAI(model=ctx.settings.openai_model, api_key=ctx.settings.openai_api_key)
    agent = Agent(
        task=_build_task(ctx, platform, job_title),
        llm=llm,
        browser_session=ctx.browser_session,
        available_file_paths=[ctx.resume_pdf_path],
        use_vision=True,
        directly_open_url=False,  # já estamos na página certa; não navegar por conta
        use_judge=False,  # economia de LLM
        max_actions_per_step=4,
        # roda dentro de uma task asyncio do uvicorn; não instalar handler de SIGINT.
        enable_signal_handler=False,
    )

    error_log: str | None = None
    try:
        history = await agent.run(max_steps=APPLY_MAX_STEPS)
    except Exception as exc:  # noqa: BLE001
        logger.exception("apply agent crashed for %s", job_url)
        outcome = Outcome.PAUSE_RETRY
        error_log = f"agent crashed: {exc}"
    else:
        ok = history.is_successful()
        if ok is True:
            outcome = Outcome.SUCCESS
        elif ok is False:
            # Agent decidiu parar (ex.: pergunta sem resposta no currículo).
            outcome = Outcome.SKIP_UNANSWERABLE
            error_log = history.final_result()
        else:
            # None = não concluiu dentro de max_steps.
            outcome = Outcome.PAUSE_RETRY
            error_log = "agente não concluiu dentro do limite de passos"

    await ctx.client.update_application(
        application_id=application_id, status=_STATUS_BY_OUTCOME[outcome], error_log=error_log
    )

    if outcome is Outcome.SUCCESS:
        await ctx.client.debit_flat(
            campaign_id=ctx.campaign["id"],
            job_application_id=application_id,
            idempotency_key=f"application:{application_id}",
        )
        await ctx.emit({"runId": ctx.run_id, "type": "applied", "jobApplicationId": application_id})
    else:
        await ctx.emit({
            "runId": ctx.run_id,
            "type": "skipped",
            "jobApplicationId": application_id,
            "reason": outcome.value,
        })

    return outcome
