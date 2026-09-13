from types import SimpleNamespace

import pytest
from playwright.async_api import async_playwright

from rpa_engine.runtime.apply_agent import _attach_resume, _build_task, record_skip

PDF = "/home/user/.config/Electron/resume-pdfs/abc-123.pdf"

# Caso 1: o input já está no DOM, visually-hidden atrás do botão. É o que o
# set_input_files resolve — e o único caso que o código antigo cobria.
HIDDEN_INPUT_HTML = """
<div>
  <button type="button">Carregar currículo</button>
  <input type="file" id="jobs-document-upload-file-input"
         style="position:absolute;left:-9999px;opacity:0;width:1px;height:1px">
</div>
"""

# Caso 2: não existe input nenhum até o clique — o SPA cria na hora. Aqui o
# set_input_files não tem o que preencher e só o file chooser salva.
LAZY_INPUT_HTML = """
<div style="height:2000px"></div>
<button type="button" id="up">Upload resume</button>
<script>
  document.getElementById('up').addEventListener('click', () => {
    const el = document.createElement('input');
    el.type = 'file';
    document.body.appendChild(el);
    el.click();
  });
</script>
"""


@pytest.fixture
async def page():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(channel="chrome")
        pg = await browser.new_page()
        yield pg
        await browser.close()


def test_task_splits_degree_from_eligibility_questions() -> None:
    ctx = SimpleNamespace(
        resume={
            "personalInfo": {"name": "Ana", "contact": "81 9", "desiredSalary": "7000"},
            "skills": ["Python"],
            "experience": [
                {
                    "companyName": "Acme",
                    "jobArea": "Dados",
                    "jobStartDate": "2024-06",
                    "isActualJob": True,
                    "description": "Pipelines em Python",
                }
            ],
        },
        resume_pdf_path=PDF,
    )

    task = _build_task(ctx, "linkedin", "Full Stack Engineer")

    # Pergunta de grau: o número sai do tempo de experiência. Defaultar para 0 (o que a
    # regra antiga mandava) zerava anos de experiência em tecnologia que está no currículo.
    assert "DERIVE" in task
    assert "MENOR valor possível" not in task
    # O currículo chega normalizado: campo citado na regra tem que existir no JSON.
    assert '"durationMonths"' in task and '"totalExperienceMonths"' in task
    assert '"phone": "81 9"' in task  # o form grava `contact`; o prompt fala `phone`
    assert "Python" in task and "Acme" in task
    # Salário e formação estão no currículo: citar o campo evita abortar por pergunta
    # que tem resposta.
    assert "desiredSalary" in task

    # Elegibilidade continua abortando — chutar aqui vira informação falsa pro empregador.
    assert "ELEGIBILIDADE" in task
    assert "success=false" in task
    # O upload é determinístico; se o prompt voltar a mandar o agente fazê-lo, ele queima
    # passos num índice que não existe no snapshot.
    assert "NÃO chame `upload_file`" in task
    assert "Full Stack Engineer" in task
    assert "Ana" in task


def test_task_answers_open_ended_questions_instead_of_skipping() -> None:
    """Campo aberto ('fale sobre você') não é elegibilidade: tem que ser respondido a
    partir do currículo, não abortado nem preenchido com adjetivo genérico."""
    ctx = SimpleNamespace(
        resume={
            "personalInfo": {"name": "Ana", "jobTitle": "Engenheira de Dados"},
            "skills": ["Python"],
            "experience": [
                {
                    "companyName": "Acme",
                    "jobArea": "Dados",
                    "jobStartDate": "2022-01",
                    "isActualJob": True,
                    "description": "Pipelines em Python",
                }
            ],
        },
        resume_pdf_path=PDF,
    )

    task = _build_task(ctx, "linkedin", "Full Stack Engineer")

    assert "ABERTA" in task
    assert "RESPONDA, nunca pule" in task
    # A regra só funciona se citar campo que existe no JSON normalizado.
    assert '"jobTitle"' in task and '"current": true' in task
    # Aterramento: o campo seleciona do currículo, não inventa.
    assert "nunca acrescenta" in task
    # Limite de caracteres: portal trunca em silêncio.
    assert "ABAIXO dele" in task
    # Os adjetivos que todo candidato escreve são exatamente o que não pode sair.
    assert "proativo" in task and "aprendo rápido" in task
    # Não pode se confundir com a regra de elegibilidade: campo aberto nunca aborta.
    assert task.index("ABERTA") > task.index("ELEGIBILIDADE")


@pytest.mark.asyncio
async def test_attaches_to_input_already_in_the_dom(page, tmp_path) -> None:
    pdf = tmp_path / "curriculo.pdf"
    pdf.write_bytes(b"%PDF-1.4 fake")
    await page.set_content(HIDDEN_INPUT_HTML)

    assert await _attach_resume(page, str(pdf)) is True
    assert await page.locator("input[type=file]").evaluate("el => el.files[0].name") == "curriculo.pdf"


@pytest.mark.asyncio
async def test_attaches_via_file_chooser_when_input_appears_on_click(page, tmp_path) -> None:
    """O caso que o código antigo perdia calado: sem input no DOM, ele desistia."""
    pdf = tmp_path / "curriculo.pdf"
    pdf.write_bytes(b"%PDF-1.4 fake")
    await page.set_content(LAZY_INPUT_HTML)

    assert await _attach_resume(page, str(pdf)) is True
    assert await page.locator("input[type=file]").evaluate("el => el.files[0].name") == "curriculo.pdf"


@pytest.mark.asyncio
async def test_does_not_reattach_when_already_filled(page, tmp_path) -> None:
    """_attach_resume roda a cada passo do agente; anexar de novo trocaria o arquivo."""
    pdf = tmp_path / "curriculo.pdf"
    pdf.write_bytes(b"%PDF-1.4 fake")
    await page.set_content(HIDDEN_INPUT_HTML)

    assert await _attach_resume(page, str(pdf)) is True
    assert await _attach_resume(page, str(pdf)) is False


@pytest.mark.asyncio
async def test_is_a_noop_without_upload_field(page, tmp_path) -> None:
    pdf = tmp_path / "curriculo.pdf"
    pdf.write_bytes(b"%PDF-1.4 fake")
    await page.set_content("<div>Passo de perguntas, sem upload</div>")

    assert await _attach_resume(page, str(pdf)) is False


class _FakeClient:
    """Client do web com só o que o record_skip usa. `created` None simula o 409."""

    def __init__(self, created: dict | None = {"id": "app-1"}) -> None:
        self.created = created
        self.updates: list[dict] = []
        self.debits: list[dict] = []

    async def create_application(self, **kwargs):
        self.calls = kwargs
        return self.created

    async def update_application(self, **kwargs):
        self.updates.append(kwargs)
        return {}

    async def debit_flat(self, **kwargs):
        self.debits.append(kwargs)


def _skip_ctx(client: _FakeClient):
    events: list[dict] = []

    async def emit(event):
        events.append(event)

    return SimpleNamespace(client=client, campaign={"id": "c-1"}, emit=emit, run_id="r-1"), events


@pytest.mark.asyncio
async def test_record_skip_writes_history_without_charging() -> None:
    client = _FakeClient()
    ctx, events = _skip_ctx(client)

    await record_skip(
        ctx,
        platform="linkedin",
        job_url="https://linkedin.com/jobs/view/1",
        job_title="Dev Java",
        company_name=None,
        reason="FIT: aderência 30/100 — sem Java",
    )

    # Vira linha no histórico com o motivo — é a informação que justifica o gate existir.
    assert client.updates == [
        {"application_id": "app-1", "status": "skipped", "error_log": "FIT: aderência 30/100 — sem Java"}
    ]
    # `skipped`, não `failed`: `failed` dispararia o caminho de reembolso no PATCH.
    assert client.updates[0]["status"] != "failed"
    # Não houve candidatura, então não há o que cobrar.
    assert client.debits == []
    assert events[0]["reason"] == "low_fit"
    assert events[0]["jobApplicationId"] == "app-1"


@pytest.mark.asyncio
async def test_record_skip_does_not_overwrite_a_job_already_registered() -> None:
    """409 = já existe registro desta vaga. Marcar como descartada apagaria um desfecho
    anterior — uma candidatura enviada semana passada viraria 'ignorada'."""
    client = _FakeClient(created=None)
    ctx, events = _skip_ctx(client)

    await record_skip(
        ctx,
        platform="linkedin",
        job_url="https://linkedin.com/jobs/view/1",
        job_title="Dev",
        company_name=None,
        reason="FIT: aderência 10/100",
    )

    assert client.updates == []
    assert events == []
