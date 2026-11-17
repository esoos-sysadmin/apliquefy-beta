"""Preenchimento determinístico de formulário de ATS conhecido. Portado de candidata/forms.py.

Um extrator só, pelo DOM: cada pergunta vira um grupo {label, tipo, opções, obrigatório}
anotado com `data-cand` para o Playwright achar de volta. O que muda por ATS é pouco
(botão de enviar e como ele confirma), então o adapter é configuração, não subclasse.

Campos padrão saem do currículo normalizado; o resto obrigatório passa pelo Answerer.
Opcional fora do padrão (EEO, "como soube da vaga") fica em branco de propósito.

Diferença do candidata: o resultado do envio é classificado para o ciclo da §7.4
(submitted / challenge / validation / blocked) e o desafio nunca é contornado aqui —
o Browserbase resolve o que conseguir (`solveCaptchas`), o resto é do usuário.
"""
from __future__ import annotations

import logging
import re
from dataclasses import dataclass

from playwright.async_api import Page

from ..answers import Answerer, match_option
from ..discovery.canonical import norm

logger = logging.getLogger(__name__)

_EXTRACT_JS = r"""() => {
  const vis = e => !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
  const txt = e => (e ? (e.innerText || e.textContent || '') : '').replace(/\s+/g, ' ').trim();
  const SKIP = ['hidden', 'submit', 'button', 'image', 'reset', 'search'];
  const els = [...document.querySelectorAll('input, textarea, select')].filter(e =>
    !SKIP.includes(e.type) && e.getAttribute('aria-hidden') !== 'true' && !/captcha/i.test(e.name + e.id));
  document.querySelectorAll('[data-cand]').forEach(e => { e.removeAttribute('data-cand'); e.removeAttribute('data-cand-opt'); });

  const optionLabel = e => txt(e.labels && e.labels[0]) || txt(e.closest('label')) || txt(e.nextElementSibling);
  const labelFor = (el, members) => {
    if (!['radio', 'checkbox'].includes(el.type) || members.length === 1) {
      if (el.labels && el.labels.length && txt(el.labels[0])) return el.labels[0];
      const by = el.getAttribute('aria-labelledby');
      if (by && document.getElementById(by.split(' ')[0])) return document.getElementById(by.split(' ')[0]);
    }
    let a = el.parentElement;
    for (let d = 0; a && d < 6; d++, a = a.parentElement) {
      const cand = [...a.querySelectorAll('legend, label, [class*="label" i], [class*="question-title" i]')]
        .find(l => txt(l) && !members.some(m => l.contains(m) || (m.id && l.htmlFor === m.id)));
      if (cand) return cand;
    }
    return null;
  };

  const groups = [], seen = new Set();
  for (const el of els) {
    if (seen.has(el)) continue;
    let members = [el], kind;
    if (el.type === 'radio' || el.type === 'checkbox') {
      members = el.name ? els.filter(e => e.name === el.name && e.type === el.type) : [el];
      kind = el.type === 'radio' ? 'radio' : (members.length > 1 ? 'checkbox' : 'checkbox1');
    } else {
      kind = el.tagName === 'SELECT' ? 'select' : el.tagName === 'TEXTAREA' ? 'textarea'
           : el.getAttribute('role') === 'combobox' ? 'combobox' : el.type;
    }
    members.forEach(m => seen.add(m));
    if (kind !== 'file' && !members.some(vis)) {
      // Ashby: Sim/Não são <button>s e o checkbox de verdade fica escondido.
      let a = el.parentElement, btns = [];
      for (let d = 0; a && d < 3 && !btns.length; d++, a = a.parentElement)
        btns = [...a.querySelectorAll('button')].filter(b => vis(b) && txt(b) && txt(b).length < 40);
      if (!btns.length || btns.length > 4) continue;
      kind = 'buttons'; members = btns;
    }
    const labelEl = labelFor(el, members);
    const label = txt(labelEl).replace(/[*✱]/g, '').trim();
    const i = groups.length;
    members.forEach((m, k) => { m.setAttribute('data-cand', i); m.setAttribute('data-cand-opt', k); });
    let options = null;
    if (kind === 'select') options = [...el.options].filter(o => o.value && !/^(select|selecione|choose|--)/i.test(o.text.trim())).map(o => o.text.trim());
    if (kind === 'radio' || kind === 'checkbox') options = members.map(optionLabel);
    if (kind === 'buttons') options = members.map(txt);
    const required = members.some(m => m.required || m.getAttribute('aria-required') === 'true')
      || /[*✱]/.test(txt(labelEl)) || /required/i.test((labelEl && labelEl.className) || '');
    const filled = kind === 'file' ? el.files.length > 0
      : kind === 'select' ? el.selectedIndex > 0
      : ['radio', 'checkbox', 'checkbox1'].includes(kind) ? members.some(m => m.checked)
      : kind === 'buttons' ? false
      : kind === 'combobox' ? !!(el.closest('[class*="control"]') || el.parentElement).querySelector('[class*="single-value" i], [class*="singleValue"]')
      : !!el.value.trim();
    groups.push({ i, kind, label, required, options, filled, key: (el.name || '') + ' ' + (el.id || '') });
  }
  return groups;
}"""


@dataclass
class Field:
    i: int
    kind: str
    label: str
    required: bool
    options: list[str] | None
    filled: bool
    key: str


# (regex, chave) — ordem importa: "first name" antes de "name". Casa com o name/id do
# campo, ou com o label SÓ quando ele é curto: "What is the name of your current
# manager?" contém "name" e não é o nome do candidato.
_SHORT_LABEL_WORDS = 5
_STANDARD = [
    (r"\bfirst name\b|primeiro nome|\bpreferred name\b|\bnome social\b", "first"),
    (r"\blast name\b|sobrenome|\bsurname\b", "last"),
    (r"\be ?mail\b", "email"),
    (r"\bphone\b|telefone|celular|whatsapp|\bmobile\b", "phone"),
    (r"linkedin", "linkedin"),
    (r"github", "github"),
    (r"portfolio|website|personal site|\bsite\b", "portfolio"),
    (r"current (company|employer)|empresa atual|\borg\b", "company"),
    (r"current (title|role|position)|cargo atual", "title"),
    (r"\blocation\b|\bcity\b|cidade|localizacao|onde voce mora", "location"),
    (r"\bname\b|\bnome\b", "name"),
]


def standard_value(field: Field, resume: dict) -> str | None:
    """Valor de campo padrão direto do currículo normalizado, ou None se não é padrão
    (ou se é padrão mas está vazio no currículo — aí cai no Answerer)."""
    if field.kind in ("file", "radio", "checkbox", "checkbox1", "buttons"):
        return None
    label = norm(field.label)
    haystack = field.key.lower().replace("_", " ") + (f" {label}" if len(label.split()) <= _SHORT_LABEL_WORDS else "")
    p = resume["personalInfo"]
    current = next((e for e in resume["experience"] if e.get("current")), {})
    names = p["name"].split()
    values = {
        "first": names[0] if names else "",
        "last": " ".join(names[1:]),
        "name": p["name"],
        "email": p["email"],
        "phone": p["phone"],
        "linkedin": p["linkedin"],
        "github": p["github"],
        "portfolio": p["portfolio"] or p["github"],
        "company": current.get("company", ""),
        "title": p["jobTitle"] or current.get("role", ""),
        "location": p["location"],
    }
    for pattern, key in _STANDARD:
        if re.search(pattern, haystack):
            return values[key] or None
    return None


def _unique_match(value: str, options: list[str]) -> str | None:
    """A única opção que contém todas as palavras do valor ("Recife Brazil" ⊂ "Recife, PE, Brazil")."""
    words = set(norm(value).split())
    hits = [o for o in options if words <= set(norm(o).split())]
    return hits[0] if len(hits) == 1 else None


def _is_resume_input(field: Field) -> bool:
    text = f"{norm(field.label)} {field.key.lower()}"
    return "autofill" not in text and bool(re.search(r"resume|\bcv\b|curriculo|attach|anexar", text)) \
        and not re.search(r"cover|carta", text)


class FormFiller:
    def __init__(self, page: Page, answerer: Answerer, resume: dict, pdf: str) -> None:
        self.page, self.answerer, self.resume, self.pdf = page, answerer, resume, pdf
        self.missing: list[str] = []
        self.questions = 0  # perguntas fora do padrão respondidas: vira `questions` no débito

    async def fields(self) -> list[Field]:
        return [Field(**g) for g in await self.page.evaluate(_EXTRACT_JS)]

    def _loc(self, f: Field, opt: int | None = None):
        sel = f'[data-cand="{f.i}"]' + (f'[data-cand-opt="{opt}"]' if opt is not None else "")
        return self.page.locator(sel).first

    async def run(self) -> None:
        # Currículo primeiro: Lever/Ashby leem o PDF e autopreenchem; o resto vem depois.
        for f in await self.fields():
            if f.kind == "file" and not f.filled and _is_resume_input(f):
                await self._loc(f).set_input_files(self.pdf)
                await self.page.wait_for_timeout(2_500)
                break
        for f in await self.fields():  # re-extrai: o upload re-renderiza o form
            if f.filled or f.kind == "file":
                continue
            await self._fill(f)

    async def _fill(self, f: Field) -> None:
        value = standard_value(f, self.resume)
        if value is None and not f.required:
            return
        options = f.options
        if f.kind == "combobox" and value is None:
            options = await self._combobox_options(f)
        if value is None:
            value = await self.answerer.answer(f.label or f.key, options or None, multi=f.kind == "checkbox")
            self.questions += value is not None
        if value is None:
            if f.required:
                self.missing.append(f.label or f.key)
            return
        try:
            await self._set(f, value, options)
        except Exception as exc:  # noqa: BLE001 — campo que re-renderizou/sumiu
            logger.warning("não consegui preencher %r: %s", f.label, type(exc).__name__)
            if f.required:
                self.missing.append(f.label or f.key)

    async def _combobox_options(self, f: Field) -> list[str]:
        loc = self._loc(f)
        await loc.click()
        await self.page.wait_for_timeout(600)
        opts = await self._options().all_inner_texts()
        await self.page.keyboard.press("Escape")
        return [o.strip() for o in opts if o.strip()]

    def _options(self):
        # Só as visíveis: o seletor de DDI do telefone deixa ~240 [role=option] escondidos no DOM.
        return self.page.locator("[role=option]:visible")

    async def _set(self, f: Field, value: str, options: list[str] | None) -> None:
        loc = self._loc(f)
        if f.kind == "select":
            await loc.select_option(label=value)
        elif f.kind in ("radio", "buttons", "checkbox"):
            wanted = [v.strip() for v in value.split(";")] if f.kind == "checkbox" else [value]
            for w in wanted:
                k = (f.options or []).index(w)
                # el.click() nativo: o input real costuma estar escondido atrás de um label estilizado.
                target = self._loc(f, k)
                await (target.click() if f.kind == "buttons" else target.evaluate("el => el.click()"))
        elif f.kind == "checkbox1":
            if match_option(value, ["Yes", "No"]) == "Yes":
                await loc.evaluate("el => el.checked || el.click()")
        elif f.kind == "combobox":
            await loc.click()
            # Sem opções prévias = typeahead que busca no servidor (cidade): digita só
            # "Recife", não "Recife, Brasil", e espera a resposta chegar.
            await loc.press_sequentially((value if options else value.split(",")[0])[:40], delay=30)
            opts: list[str] = []
            for _ in range(8):
                await self.page.wait_for_timeout(500)
                if opts := [o.strip() for o in await self._options().all_inner_texts() if o.strip()]:
                    break
            pick = match_option(value, opts) if options else _unique_match(value, opts)
            if pick is None and opts and not options:
                # Ambíguo (Recife/BA × Recife/PE): R10 não deixa chutar → LLM preso ao currículo.
                pick = await self.answerer.answer(f.label, opts)
                if pick and not await self._options().count():
                    await loc.click()
            if pick is None:
                await self.page.keyboard.press("Escape")
                raise ValueError("opção não apareceu")
            await self._options().filter(has_text=pick).first.click()
        else:
            await loc.fill(value)
            if re.search(r"location|localiza", f.key.lower() + norm(f.label)):
                await self._pick_suggestion()

    async def _pick_suggestion(self) -> None:
        """Lever: o campo de localização só vale com uma sugestão escolhida."""
        await self.page.wait_for_timeout(1_200)
        sug = self.page.locator(".dropdown-location:visible, [role=option]:visible").first
        if await sug.count():
            await sug.click()


# ── classificação da página ─────────────────────────────────────────────────

_THANKS = (
    r"thank(s| you) for (applying|your (application|interest))|application (has been |was )?"
    r"(submitted|received)|candidatura (enviada|recebida)"
)
_VERIFY_TEXT = re.compile(
    r"verification code|código de verificação|verify your email|verifique seu e-?mail|"
    r"confirme seu e-?mail|i'?m not a robot|não sou um robô|security check|verificação de segurança",
    re.I,
)
# Página como a do SmartRecruiters: o ATS barra o robô antes do formulário (§7.4).
_BLOCK_TEXT = re.compile(
    r"access denied|you have been blocked|request (was )?blocked|unusual traffic|"
    r"acesso negado|sorry, you have been blocked",
    re.I,
)
_CAPTCHA_FRAMES = ("hcaptcha.com", "recaptcha/api2/bframe", "recaptcha/enterprise/bframe", "challenges.cloudflare.com")
_GENERIC_SUCCESS = re.compile(rf"/confirmation|/thanks|{_THANKS}", re.I)


def classify_page_text(url: str, body: str, success: re.Pattern = _GENERIC_SUCCESS, baseline: str = "") -> str | None:
    """'submitted' | 'challenge:verificação' | 'blocked' | None (nada conclusivo ainda).

    `baseline` é o texto da página ANTES do clique: o embed mostra a descrição da vaga
    junto do formulário, e "thank you for your interest" ou "security check" escritos
    nela não são resultado do envio. Só conta marcador que apareceu depois."""
    body = body or ""

    def new(pattern: re.Pattern) -> bool:
        # Conta ocorrências: um marcador novo não pode sumir atrás de um igual da descrição.
        return sum(1 for _ in pattern.finditer(body)) > sum(1 for _ in pattern.finditer(baseline))

    if success.search(url) or new(success):
        return "submitted"
    if new(_BLOCK_TEXT):
        return "blocked"
    if new(_VERIFY_TEXT):
        return "challenge:verificação"
    return None


async def _body(page: Page) -> str:
    try:
        return await page.locator("body").inner_text(timeout=2_000) or ""
    except Exception:  # noqa: BLE001 — navegação em curso
        return ""


async def _visible_captcha(page: Page) -> bool:
    try:
        for frame in page.frames:
            if any(k in frame.url for k in _CAPTCHA_FRAMES) and frame.url != page.url:
                el = await frame.frame_element()
                box = await el.bounding_box() if await el.is_visible() else None
                if box and box["width"] > 100 and box["height"] > 100:  # o anchor invisível tem 0px
                    return True
    except Exception:  # noqa: BLE001
        return False
    return False


async def _validation_error(page: Page) -> str | None:
    """Texto do erro de validação do formulário, se o ATS marcou algum campo."""
    try:
        if not await page.locator("[aria-invalid='true']:visible").count():
            return None
        errors = await page.locator("[class*='error' i]:visible, [role=alert]:visible").all_inner_texts()
    except Exception:  # noqa: BLE001
        return None
    text = "; ".join(t.strip() for t in errors if t.strip())
    return (text or "campo inválido")[:500]


@dataclass
class FormAdapter:
    name: str
    submit_selector: str
    success: re.Pattern

    async def check_access(self, page: Page) -> bool:
        """False = o ATS barrou antes do formulário."""
        return classify_page_text(page.url, await _body(page), self.success) != "blocked"

    async def fill(self, page: Page, filler: FormFiller) -> None:
        await page.wait_for_load_state("networkidle")
        await filler.run()

    async def submit(self, page: Page, wait_s: int = 20) -> str:
        """'submitted' | 'challenge:<tipo>' | 'validation:<texto>' | 'blocked'.

        Sem tela de sucesso em `wait_s` com o formulário ainda na página = desafio (§8.1):
        o reCAPTCHA invisível reprovou ou pediu algo que só o usuário resolve."""
        baseline = await _body(page)
        await page.locator(self.submit_selector).first.click()
        for _ in range(wait_s):
            await page.wait_for_timeout(1_000)
            if result := classify_page_text(page.url, await _body(page), self.success, baseline):
                return result
            if await _visible_captcha(page):
                return "challenge:captcha"
        if error := await _validation_error(page):
            return f"validation:{error}"
        return "challenge:sem confirmação"

    async def confirmed(self, page: Page) -> bool:
        return classify_page_text(page.url, await _body(page), self.success) == "submitted"
