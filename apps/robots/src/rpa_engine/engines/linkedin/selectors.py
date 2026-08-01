"""LinkedIn selectors centralized for maintenance."""
from __future__ import annotations

JOBS_TAB_LINK = "a[href*='/jobs']"
SEARCH_KEYWORDS_INPUT = "input[aria-label*='Pesquisar por cargo' i], input[aria-label*='Search by title' i]"
SEARCH_LOCATION_INPUT = "input[aria-label*='Cidade' i], input[aria-label*='City, state' i]"
EASY_APPLY_TOGGLE_BTN = "button[aria-label*='Easy Apply' i], button[aria-label*='Candidatura simplificada' i]"
ALL_FILTERS_BTN = "button[aria-label*='Todos os filtros' i], button[aria-label*='All filters' i]"
# No DOM autenticado, o sinal estável de uma vaga é o link /jobs/view/{id}
# (confirmado: 61 matches, enquanto as classes CSS antigas dão 0).
JOB_CARD = "a[href*='/jobs/view/']"
JOB_CARD_LINK = "a[href*='/jobs/view/']"
# O botão de candidatura aparece como link/botão com aria-label "Easy Apply...".
APPLY_BUTTON = "[aria-label*='Easy Apply' i], [aria-label*='Candidatura simplificada' i], button.jobs-apply-button"
LOGIN_FALLBACK_INDICATOR = "input[name='session_key']"
# Modal do Easy Apply. Depois do clique em APPLY_BUTTON o único dialog aberto é ele,
# então role=dialog basta e não depende das classes ofuscadas do SDUI.
APPLY_MODAL = "div[role='dialog']"

# Botão do passo "Currículo" do Easy Apply. O modal sai com locale misto (rótulo
# "Currículo*" e botões "Upload resume"/"Next"), então cobre PT e EN. Pode ser <label>
# embrulhando o input escondido em vez de <button>.
RESUME_UPLOAD_BTN = (
    "button:has-text('Carregar currículo'), button:has-text('Upload resume'), "
    "label:has-text('Carregar currículo'), label:has-text('Upload resume')"
)

# Filter chips inside the search bar
FILTER_DATE_POSTED = "button[aria-label*='Data' i], button[aria-label*='Date posted' i]"
FILTER_EXPERIENCE = "button[aria-label*='Nível de experiência' i], button[aria-label*='Experience level' i]"
FILTER_JOB_TYPE = "button[aria-label*='Tipo de vaga' i], button[aria-label*='Job type' i]"
FILTER_REMOTE = "button[aria-label*='Remoto' i], button[aria-label*='Remote' i]"
FILTER_SORT = "button[aria-label*='Classificar' i], button[aria-label*='Sort by' i]"
APPLY_FILTERS_BTN = "button:has-text('Mostrar resultados'), button:has-text('Show results')"
