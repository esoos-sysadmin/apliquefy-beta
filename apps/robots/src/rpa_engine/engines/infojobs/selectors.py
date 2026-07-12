"""Infojobs selectors centralized for maintenance."""
from __future__ import annotations

SEARCH_KEYWORD_INPUT = "input[name='palabra'], input[id*='keyword' i], input[placeholder*='Cargo' i]"
WHERE_INPUT = "input[name='poblacion'], input[id*='localizacion' i], input[placeholder*='onde' i]"
WHERE_DROPDOWN_OPTION = "ul[role='listbox'] li, ul.suggestions li"
SEARCH_SUBMIT_BTN = "button[type='submit']:has-text('Buscar'), button:has-text('Pesquisar')"
JOB_CARD = "div.list-item, article.element"
JOB_CARD_LINK = "a.js-o-link, a[href*='/vagas-de-emprego/']"
APPLY_BUTTON = "button:has-text('Candidatar-me'), button:has-text('Inscrever-me')"
RETENTION_POPUP_DISMISS = "button:has-text('Não, obrigado'), button:has-text('Talvez depois')"
PROFILE_REDIRECT_INDICATOR = "form[action*='perfil'], h1:has-text('Complete seu perfil')"

# Brazil state enum → Infojobs UI label
BRAZIL_STATE_LABEL = {
    "acre": "Acre",
    "alagoas": "Alagoas",
    "amapa": "Amapá",
    "amazonas": "Amazonas",
    "bahia": "Bahia",
    "ceara": "Ceará",
    "distrito_federal": "Distrito Federal",
    "espirito_santo": "Espírito Santo",
    "goias": "Goiás",
    "maranhao": "Maranhão",
    "mato_grosso": "Mato Grosso",
    "mato_grosso_do_sul": "Mato Grosso do Sul",
    "minas_gerais": "Minas Gerais",
    "para": "Pará",
    "paraiba": "Paraíba",
    "parana": "Paraná",
    "pernambuco": "Pernambuco",
    "piaui": "Piauí",
    "rio_de_janeiro": "Rio de Janeiro",
    "rio_grande_do_norte": "Rio Grande do Norte",
    "rio_grande_do_sul": "Rio Grande do Sul",
    "rondonia": "Rondônia",
    "roraima": "Roraima",
    "santa_catarina": "Santa Catarina",
    "sao_paulo": "São Paulo",
    "sergipe": "Sergipe",
    "tocantins": "Tocantins",
}
