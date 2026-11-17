"""Semeia `ats_boards` com os ~4.400 boards Greenhouse do johnvc/greenhouse-job-board-api
(execução única, ADR-09). Depois disso a descoberta diária varre esses boards.

    cd apps/robots
    APLIQUEFY_WEB_URL=… WORKER_API_TOKEN=… APIFY_TOKEN=… uv run python scripts/seed_ats_boards.py [--max 5000]
"""
from __future__ import annotations

import argparse
import asyncio
import os

import httpx

from rpa_engine.cloud.config import load_cloud_settings
from rpa_engine.cloud.discovery.apify import seed_greenhouse_boards
from rpa_engine.cloud.internal_client import InternalClient


async def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--max", type=int, default=5000)
    args = ap.parse_args()
    settings = load_cloud_settings()
    client = InternalClient(settings.web_url, settings.worker_token)
    try:
        async with httpx.AsyncClient() as http:
            boards = await seed_greenhouse_boards(http, os.environ["APIFY_TOKEN"], args.max)
        created = await client.upsert_boards(boards)
    finally:
        await client.aclose()
    print(f"{len(boards)} boards lidos, {created} novos")
    return 0 if boards else 1


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
