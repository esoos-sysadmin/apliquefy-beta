"""Apply cognitivo via browser-use.

Substitui o loop caseiro (screenshot → LLM JSON → dispatch Playwright). O engine
mecânico deixa a página da vaga aberta com o formulário de candidatura iniciado;
aqui o Agent do browser-use assume: preenche com os dados do currículo e envia. O
upload do PDF NÃO é dele — sai determinístico no `_attach_resume` (Playwright).

Mantém intacta a regra de negócio ao redor: cria a JobApplication, atualiza
status e debita crédito só em sucesso (idempotente por candidatura).
"""
from __future__ import annotations

import json
import logging

from browser_use import Agent, ChatOpenAI

from ..engines.base import EngineContext
# Só o LinkedIn tem passo de upload hoje. Quando o InfoJobs tiver, o seletor vira
# parâmetro do EngineContext em vez de import direto.
from ..engines.linkedin import selectors as S
from ..observability import breadcrumb, capture_agent_crash, job_ref
from ..util.resume import normalize
from .state_machine import Outcome

logger = logging.getLogger(__name__)

# Com max_actions_per_step=1 cada passo vale 1 ação, então o teto tem que subir junto:
# um Easy Apply de 4-5 telas gasta ~30 ações. 25 viraria "não concluiu" no meio.
APPLY_MAX_STEPS = 45

# Ações do browser-use que representam responder uma pergunta do formulário
# dinâmico: texto (`input`) e dropdown (`select_dropdown`). `click` também cobre
# botões de navegação (Avançar/Enviar), então NÃO conta como pergunta. Proxy de
# esforço p/ o custo variável por candidatura (calculado no web).
_QUESTION_ACTIONS = {"input", "select_dropdown"}


def _effort(history) -> tuple[int, int]:
    """(perguntas dinâmicas respondidas, passos totais) extraídos do history."""
    try:
        names = list(history.action_names())
    except Exception:  # noqa: BLE001
        return 0, 0
    questions = sum(1 for n in names if n in _QUESTION_ACTIONS)
    try:
        steps = int(history.number_of_steps())
    except Exception:  # noqa: BLE001
        steps = 0
    return questions, steps


# Marcador que o agente põe no `done` quando desiste por pergunta de elegibilidade sem
# resposta no currículo — o único motivo que é "ignorada" de verdade. Sem ele, qualquer
# `done(success=false)` virava "skipped" e as falhas mecânicas (botão que não avança,
# campo travado) sumiam do relatório com Falhas=0.
SKIP_MARKER = "ELEGIBILIDADE:"


def _outcome_from_result(ok: bool | None, final_result: str | None) -> Outcome:
    if ok is True:
        return Outcome.SUCCESS
    if ok is None:  # não concluiu dentro de max_steps
        return Outcome.PAUSE_RETRY
    if (final_result or "").lstrip().upper().startswith(SKIP_MARKER):
        return Outcome.SKIP_UNANSWERABLE
    return Outcome.PAUSE_RETRY


_STATUS_BY_OUTCOME = {
    Outcome.SUCCESS: "applied",
    Outcome.SKIP_UNANSWERABLE: "skipped",
    Outcome.SKIP_DEAD_SCREEN: "skipped",
    Outcome.PAUSE_RETRY: "failed",
    Outcome.PAUSE_MISSING_DATA: "failed",
    Outcome.PAUSE_SESSION_INVALID: "failed",
    Outcome.CONTINUE: "failed",
}


async def _attach_resume(page, pdf_path: str) -> bool:
    """Anexa o PDF do currículo no passo de upload, sem gastar passo do agente.

    O input do Easy Apply é visually-hidden atrás do botão "Carregar currículo": ele não
    entra no snapshot do browser-use, então o agente não tem índice para `upload_file` e
    queima passos até desistir ("upload element not available"). Aqui resolve sem LLM.

    Dois caminhos, porque o LinkedIn nem sempre deixa o input no DOM antes do clique:
      1. `set_input_files` no input escondido — só exige que ele exista, não que esteja
         visível. É o caminho barato e o que funciona quando o input já está montado.
      2. clicar no botão e interceptar o file chooser nativo — cobre o caso em que o
         input só nasce no clique. `page.click` já rola o botão até a viewport sozinho.

    ponytail: pega o primeiro input vazio, seja ele qual for. Se algum dia aparecer um
    segundo upload no mesmo passo (carta de apresentação), filtrar por id/accept.
    """
    try:
        inputs = page.locator('input[type="file"]')
        empty = None
        for i in range(await inputs.count()):
            field = inputs.nth(i)
            if await field.evaluate("el => el.files.length") > 0:
                return False  # já anexado num passo anterior; não reenvia
            empty = empty or field

        if empty is not None:
            await empty.set_input_files(pdf_path)
            logger.info("currículo anexado (input direto): %s", pdf_path)
            return True

        # Sem input no DOM: só faz sentido insistir se o passo do currículo está na tela.
        button = page.locator(S.RESUME_UPLOAD_BTN).first
        if await button.count() == 0:
            return False

        async with page.expect_file_chooser(timeout=3_000) as chooser_info:
            await button.click()
        await (await chooser_info.value).set_files(pdf_path)
        logger.info("currículo anexado (file chooser): %s", pdf_path)
        return True
    except Exception as exc:  # noqa: BLE001 — página re-renderizando entre passos
        # Warning e não debug: se o passo do currículo está na tela e nada anexou, essa
        # é a linha que explica a candidatura falhando lá na frente.
        logger.warning("não consegui anexar o currículo neste passo: %s", exc)
        # Breadcrumb, não evento: roda a cada passo do agente e falhar aqui é
        # rotina enquanto o modal não mostra o campo de upload (SDD §6.3, item 7).
        breadcrumb("resume_attach", "falha ao anexar currículo", error=type(exc).__name__)
    return False


def _build_task(ctx: EngineContext, platform: str, job_title: str | None) -> str:
    # normalize() antes de serializar: o JSONB do banco usa os nomes do form web
    # (`companyName`, `jobStartDate`, `nameOfGraduation`…). Regra de prompt que cita
    # campo com outro nome é regra que nunca dispara — e o modelo cai no default.
    resume_json = json.dumps(normalize(ctx.resume), ensure_ascii=False)
    vaga = f" para a vaga '{job_title}'" if job_title else ""
    return (
        f"Você está numa página do {platform} com o formulário de candidatura{vaga} "
        "já iniciado. Sua tarefa é COMPLETAR e ENVIAR a candidatura.\n\n"
        "Regras:\n"
        "- Preencha os campos usando SOMENTE os dados do currículo abaixo.\n"
        # O upload agora é feito pelo _attach_resume (Playwright, determinístico) a cada
        # passo. Deixar o agente tentar era a maior fonte de falha e de passos queimados:
        # o input do LinkedIn é visually-hidden e não aparece no snapshot, então ele
        # chamava `upload_file` num índice que não existe até estourar o limite.
        "- O currículo é anexado AUTOMATICAMENTE pelo sistema assim que o campo de "
        "upload aparece na página. NÃO chame `upload_file` e NÃO clique em 'Carregar "
        "currículo'. Se já houver um currículo anexado, aceite-o e siga em frente.\n"
        "- NUNCA clique em ícones de download nem abra currículos salvos na plataforma.\n"
        # Os "index" do browser-use são backendNodeId do CDP, não 0,1,2... O SDUI do
        # LinkedIn recria nós a cada render, então índice chutado (ou lido um passo
        # atrás) sempre falha — e cada falha queima um passo e uma chamada de LLM.
        "- Use SOMENTE índices de elemento presentes no estado ATUAL da página. Nunca "
        "chute índices baixos (0, 1, 2...) nem reaproveite índices de passos anteriores.\n"
        # Antes isto era uma regra só ("não sabe → aborta"), e ela sozinha respondia pela
        # maioria das candidaturas ignoradas: qualquer campo fora do currículo matava o
        # envio. A divisão abaixo é pela consequência de errar, não pela dificuldade:
        # subestimar a si mesmo só prejudica quem se candidata; afirmar elegibilidade que
        # não se tem é informação falsa para o empregador.
        # Antes esta regra era "se o currículo não disser, responda o MENOR valor (0)". Só
        # que o currículo NUNCA diz: `skills` é uma lista de nomes e nenhum campo guarda
        # anos por tecnologia. Lido ao pé da letra, o modelo respondia 0 em quase toda
        # pergunta de grau — inclusive para as tecnologias que dominam o currículo. O
        # número tem que ser DERIVADO das datas das experiências, não defaultado.
        "- Pergunta de GRAU (anos de experiência com X, escala 1-5, nível de uma "
        "ferramenta): o currículo NÃO traz esse número pronto — DERIVE. Procure X em "
        "`skills` e no `role`/`description` de CADA experiência e some o `durationMonths` "
        "(meses, já calculado) das que citam X; divida por 12 e arredonde para baixo. "
        "Anos totais de carreira = `totalExperienceMonths` / 12. Se X aparece só em "
        "`skills`, sem experiência datada, responda o menor valor NÃO-nulo ('1', "
        "'básico', 'Sim'). Responda 0/'nenhum'/'Não' apenas quando X não aparecer em "
        "lugar NENHUM do currículo. Nunca chute para cima, nunca aborte por causa dela.\n"
        # Currículo antigo (anterior à coluna `idioms`) chega sem idioma nenhum: sem esta
        # regra o modelo respondia o piso até para o português.
        "- Nível de IDIOMA: use `idioms` (língua + nível). Com `idioms` vazio, assuma "
        "português nativo se o currículo está em português; para os outros idiomas "
        "responda o menor nível e siga em frente.\n"
        # A lista existia sem dizer ONDE procurar, e metade dela já está no currículo:
        # o agente desistia de candidatura por pergunta que tinha resposta a um campo
        # de distância. Só sobrou como "sem resposta" o que o schema realmente não guarda.
        "- Pergunta de ELEGIBILIDADE (autorização de trabalho ou visto, formação exigida, "
        "certificação, CNH, pretensão salarial, disponibilidade de mudança): não chute — "
        "mas PROCURE antes, porque a maioria está no currículo: pretensão salarial em "
        "`personalInfo.desiredSalary`; formação/escolaridade em `education` (`endDate` no "
        "futuro = em curso); certificações em `experience[].certifications`; autorização "
        "de trabalho no país onde o candidato mora (`personalInfo.location`) e já teve "
        "emprego formal (`experience[].jobType`) = SIM — visto ou patrocínio para OUTRO "
        "país continua sem resposta. Só se realmente não estiver lá, chame `done` com "
        f"success=false e a mensagem COMEÇANDO com '{SKIP_MARKER}' seguido da pergunta, "
        "SEM enviar a candidatura.\n"
        "- Fora esses dois casos, não invente dados que não estejam no currículo.\n"
        "- Avance pelas etapas (Avançar/Revisar) até enviar. Ao enviar com sucesso, "
        "chame `done` com success=true.\n"
        # Cada clique no LinkedIn re-renderiza o modal inteiro. O modelo lia "nada mudou"
        # e concluía "o botão não funciona" — foi o motivo campeão de candidatura perdida.
        "- Um clique em Avançar/Revisar/Enviar que aparentemente não mudou nada quase "
        "sempre mudou: o modal foi re-renderizado. NÃO conclua que o botão está quebrado. "
        "Releia o estado ATUAL da página e continue a partir dele.\n"
        f"- NUNCA use '{SKIP_MARKER}' para desistir por problema técnico (botão que não "
        "avança, campo travado, página que recarregou). Nesse caso chame `done` com "
        "success=false descrevendo o que travou, sem esse prefixo.\n\n"
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
    if application is None:
        logger.info("já candidatado nesta vaga, pulando: %s", job_url)
        await ctx.emit({"runId": ctx.run_id, "type": "skipped", "reason": "already_applied"})
        return Outcome.SKIP_DEAD_SCREEN

    application_id = application["id"]
    await ctx.emit({"runId": ctx.run_id, "type": "applying", "jobApplicationId": application_id})

    llm = ChatOpenAI(model=ctx.settings.openai_model, api_key=ctx.settings.openai_api_key)
    agent = Agent(
        task=_build_task(ctx, platform, job_title),
        llm=llm,
        browser_session=ctx.browser_session,
        # Sem available_file_paths de propósito: o upload é do _attach_resume. Passar o
        # PDF aqui só reabilitaria o `upload_file` que o prompt proíbe — e foi o que fez
        # o CV baixado do próprio LinkedIn virar candidato a anexo.
        # O DOM do LinkedIn não rotula os campos (classes ofuscadas, radio sem
        # aria-label): sem visão o modelo não sabe qual campo é qual. Mas detalhe
        # "auto" manda a screenshot em alta resolução — 'low' corta a maior parte dos
        # tokens de imagem e um formulário não precisa dessa resolução toda.
        use_vision=True,
        vision_detail_level="low",
        # Sem limite, cada passo reenvia TODO o histórico: o passo 13 custa muito mais
        # que o passo 1 e o TPM estoura no meio do run. 10 cobre o contexto que importa
        # (browser-use exige > 5 e sempre mantém o primeiro item).
        max_history_items=10,
        directly_open_url=False,  # já estamos na página certa; não navegar por conta
        use_judge=False,  # economia de LLM
        # 1, não 4: os índices são backendNodeId do CDP e o modal do LinkedIn recria os
        # nós a cada render. Num lote de 4, a 1ª ação (clicar Avançar) invalida as outras
        # 3, que batem em nós mortos — e o modelo lê isso como "botão não funcional".
        max_actions_per_step=1,
        # roda dentro de uma task asyncio do uvicorn; não instalar handler de SIGINT.
        enable_signal_handler=False,
    )

    # O campo de upload só existe a partir de um dos passos do modal, então checa a cada
    # passo em vez de uma vez antes de começar.
    async def _before_step(_agent) -> None:
        await _attach_resume(ctx.page, ctx.resume_pdf_path)

    error_log: str | None = None
    questions = steps = 0
    try:
        await _attach_resume(ctx.page, ctx.resume_pdf_path)
        history = await agent.run(max_steps=APPLY_MAX_STEPS, on_step_start=_before_step)
    except Exception as exc:  # noqa: BLE001
        logger.exception("apply agent crashed for %s", job_url)
        # Inesperado: o agente estourou em vez de concluir com sucesso/insucesso.
        # Não confundir com PAUSE_RETRY por max_steps, que é desfecho normal e
        # fica só no job_applications.error_log (ADR-04).
        capture_agent_crash(exc, platform, job_ref=job_ref(job_url))
        outcome = Outcome.PAUSE_RETRY
        error_log = f"agent crashed: {exc}"
    else:
        questions, steps = _effort(history)
        ok = history.is_successful()
        outcome = _outcome_from_result(ok, history.final_result())
        error_log = None if outcome is Outcome.SUCCESS else (
            history.final_result() or "agente não concluiu dentro do limite de passos"
        )

    await ctx.client.update_application(
        application_id=application_id, status=_STATUS_BY_OUTCOME[outcome], error_log=error_log
    )

    if outcome is Outcome.SUCCESS:
        await ctx.client.debit_flat(
            campaign_id=ctx.campaign["id"],
            job_application_id=application_id,
            idempotency_key=f"application:{application_id}",
            questions=questions,
            steps=steps,
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
