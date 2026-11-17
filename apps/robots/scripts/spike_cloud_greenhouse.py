"""Fase 0 do SDD-candidatura-nuvem: uma candidatura Greenhouse por um navegador na nuvem.

Sem schema e sem rotas. Envia DE VERDADE (sem --dry-run): use só em vagas escolhidas
pelo dono do currículo, com o consentimento dele. Cada execução acrescenta uma linha em
--out; o critério do portão (≥ 80% submitted) sai dessas linhas.

    cd apps/robots
    export BROWSER_PROVIDER_API_KEY=… BROWSER_PROVIDER_PROJECT_ID=… OPENAI_API_KEY=…
    uv run python scripts/spike_cloud_greenhouse.py \
        --url "https://job-boards.greenhouse.io/acme/jobs/123" \
        --resume curriculo.json --pdf curriculo.pdf [--proxy] [--dry-run]

`curriculo.json` é o JSON do currículo como está no banco (ou já normalizado);
`curriculo.pdf` é o baixado do painel (GET /api/resumes/{id}/pdf).
"""
from __future__ import annotations

import argparse
import asyncio
import json
import os
import sys
import time
from datetime import datetime, timezone

import httpx

from rpa_engine.cloud.adapters.greenhouse import GREENHOUSE, apply_url, fetch_questions, greenhouse_ids, precheck
from rpa_engine.cloud.answers import Answerer, default_ask
from rpa_engine.cloud.browser import Browserbase
from rpa_engine.cloud.form_run import FormResult, run_form
from rpa_engine.util.resume import normalize


async def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--url", required=True, help="qualquer URL da vaga no Greenhouse")
    ap.add_argument("--resume", required=True)
    ap.add_argument("--pdf", required=True)
    ap.add_argument("--proxy", action="store_true", help="proxy residencial BR (metade das 10 execuções)")
    ap.add_argument("--dry-run", action="store_true", help="preenche e NÃO envia")
    ap.add_argument("--out", default="spike_cloud_greenhouse.jsonl")
    args = ap.parse_args()

    ids = greenhouse_ids(args.url)
    if not ids:
        print("URL não é de vaga Greenhouse", file=sys.stderr)
        return 2
    with open(args.resume, encoding="utf-8") as fh:
        resume = normalize(json.load(fh))
    answerer = Answerer(resume, ask=default_ask())

    started = time.monotonic()
    async with httpx.AsyncClient(timeout=30) as http:
        missing = await precheck(await fetch_questions(http, *ids), answerer, resume)
    if missing:
        result = FormResult("missing", missing[0])
    else:
        bb = Browserbase(
            os.environ["BROWSER_PROVIDER_API_KEY"],
            os.environ["BROWSER_PROVIDER_PROJECT_ID"],
            proxy_ats={"greenhouse"} if args.proxy else set(),
        )
        try:
            result = await run_form(bb, GREENHOUSE, apply_url(*ids), resume, args.pdf, answerer, submit=not args.dry_run)
        finally:
            await bb.aclose()

    line = {
        "at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "url": args.url,
        "proxy": args.proxy,
        "dry_run": args.dry_run,
        "outcome": result.outcome,
        "detail": result.detail,
        "questions": result.questions,
        "seconds": round(time.monotonic() - started, 1),
    }
    with open(args.out, "a", encoding="utf-8") as fh:
        fh.write(json.dumps(line, ensure_ascii=False) + "\n")
    print(json.dumps(line, ensure_ascii=False, indent=2))
    return 0 if result.outcome in ("submitted", "filled") else 1


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
