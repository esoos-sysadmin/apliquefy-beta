"""URL canônica, detecção de ATS e texto puro. Portado de candidata/jobs.py e sources.py.

Nada aqui toca rede: a mesma vaga, venha do Apify ou da API do ATS, vira a mesma string,
e é essa string que o `@@unique([userId, jobUrl])` deduplica.
"""
from __future__ import annotations

import html
import re
import unicodedata
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit


def norm(text: str) -> str:
    """minúsculas, sem acento, só [a-z0-9] separados por um espaço."""
    text = unicodedata.normalize("NFKD", text or "").encode("ascii", "ignore").decode()
    return " ".join(re.sub(r"[^a-z0-9]+", " ", text.lower()).split())


_TRACKING_KEYS = {
    "ref", "refid", "trk", "trackingid", "source", "src", "gh_src", "lever-source",
    "lever-origin", "origin", "eboid", "currentjobid", "utm",
}
_GH_PATH = re.compile(r"^/([^/]+)/jobs/(\d+)")


def canonical_url(url: str) -> str:
    """Mesma vaga → mesma string, venha ela do LinkedIn, da API ou de um link com UTM."""
    parts = urlsplit(url.strip())
    host = parts.netloc.lower().removeprefix("www.")
    path = parts.path.rstrip("/")
    query = dict(parse_qsl(parts.query))

    # Greenhouse tem 3 URLs para o mesmo formulário: boards./job-boards. e o embed.
    if host.endswith("greenhouse.io"):
        if path.endswith("/embed/job_app") and "for" in query and "token" in query:
            return f"https://greenhouse.io/{query['for']}/jobs/{query['token']}"
        if m := _GH_PATH.match(path):
            return f"https://greenhouse.io/{m[1]}/jobs/{m[2]}"
    if host.endswith("linkedin.com") and (m := re.search(r"/jobs/view/(\d+)", path)):
        return f"https://linkedin.com/jobs/view/{m[1]}"

    for suffix in ("/apply", "/application"):  # Lever / Ashby
        path = path.removesuffix(suffix)
    kept = sorted(
        (k, v) for k, v in query.items()
        if not (k.lower() in _TRACKING_KEYS or k.lower().startswith("utm_"))
    )
    return urlunsplit(("https", host, path, urlencode(kept), ""))


# host contém → nome do ATS. Os domínios não se sobrepõem, então a ordem não importa.
ATS_HOSTS = {
    "greenhouse.io": "greenhouse",
    "lever.co": "lever",
    "ashbyhq.com": "ashby",
    "gupy.io": "gupy",
    "myworkdayjobs.com": "workday",
    "workday.com": "workday",
    "icims.com": "icims",
    "taleo.net": "taleo",
    "successfactors": "successfactors",
    "oraclecloud.com": "oracle",
    "smartrecruiters.com": "smartrecruiters",
    "workable.com": "workable",
    "recruitee.com": "recruitee",
    "bamboohr.com": "bamboohr",
    "jobvite.com": "jobvite",
    "teamtailor.com": "teamtailor",
    "breezy.hr": "breezy",
    "solides.com.br": "solides",
    "solides.jobs": "solides",
    "kenoby.com": "kenoby",
    "inhire.app": "inhire",
    "quickin.io": "quickin",
}


def detect_ats(url: str | None) -> str | None:
    if not url:
        return None
    host = urlsplit(url).netloc.lower()
    return next((name for key, name in ATS_HOSTS.items() if key in host), None)


def html_to_text(raw: str) -> str:
    text = re.sub(r"<(br|/p|/li|/div|/h\d)[^>]*>", "\n", html.unescape(raw or ""), flags=re.I)
    return re.sub(r"[ \t]+", " ", html.unescape(re.sub(r"<[^>]+>", "", text))).strip()
