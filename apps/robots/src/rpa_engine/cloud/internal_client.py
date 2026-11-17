"""Cliente das rotas /api/internal/* da web (token de serviço + userId no corpo).

Nada de corpo de requisição em log: ele carrega currículo. Erro HTTP sobe como
`httpx.HTTPStatusError`, cuja mensagem tem só método, URL e status.
"""
from __future__ import annotations

from typing import Any

import httpx

BATCH = 500  # teto do upsert de vagas na web


class InternalClient:
    def __init__(self, web_url: str, token: str, transport: httpx.AsyncBaseTransport | None = None) -> None:
        self._http = httpx.AsyncClient(
            base_url=f"{web_url}/api/internal", headers={"x-worker-token": token}, timeout=60, transport=transport
        )

    async def aclose(self) -> None:
        await self._http.aclose()

    async def _call(self, method: str, path: str, **kw: Any) -> Any:
        res = await self._http.request(method, path, **kw)
        res.raise_for_status()
        return res.json()["data"]

    # ── descoberta ──────────────────────────────────────────────────────────
    async def upsert_postings(self, postings: list[dict]) -> dict[str, int]:
        total = {"upserted": 0, "created": 0}
        for i in range(0, len(postings), BATCH):
            got = await self._call("POST", "/postings/upsert", json={"postings": postings[i : i + BATCH]})
            total = {k: total[k] + got[k] for k in total}
        return total

    async def list_boards(self, ats: str | None = None) -> list[dict]:
        return await self._call("GET", "/boards", params={"ats": ats} if ats else None)

    async def upsert_boards(self, boards: list[dict]) -> int:
        created = 0
        for i in range(0, len(boards), BATCH):
            created += (await self._call("POST", "/boards", json={"boards": boards[i : i + BATCH]}))["created"]
        return created

    # ── matching ────────────────────────────────────────────────────────────
    async def active_campaigns(self) -> list[dict]:
        return await self._call("GET", "/campaigns/active")

    async def candidates(self, user_id: str, ats: list[str], limit: int = 1000) -> list[dict]:
        params = {"userId": user_id, "ats": ",".join(ats), "limit": limit}
        return await self._call("GET", "/postings/candidates", params=params)

    async def enqueue(
        self, *, user_id: str, campaign_id: str, job_posting_id: str, run_after: str | None = None
    ) -> dict | None:
        """None = 409, a vaga já está registrada para o usuário."""
        body = {"userId": user_id, "campaignId": campaign_id, "jobPostingId": job_posting_id, "runAfter": run_after}
        res = await self._http.post("/applications/enqueue", json=body)
        if res.status_code == 409:
            return None
        res.raise_for_status()
        return res.json()["data"]

    # ── envio ───────────────────────────────────────────────────────────────
    async def claim(self, worker_id: str, limit: int) -> list[dict]:
        return await self._call("POST", "/applications/claim", json={"workerId": worker_id, "limit": limit})

    async def patch_application(self, user_id: str, application_id: str, **fields: Any) -> dict:
        return await self._call("PATCH", f"/applications/{application_id}", json={"userId": user_id, **fields})

    async def resume(self, user_id: str, resume_id: str) -> dict:
        return await self._call("GET", f"/resumes/{resume_id}", params={"userId": user_id})

    async def resume_pdf(self, user_id: str, resume_id: str) -> bytes:
        res = await self._http.get(f"/resumes/{resume_id}/pdf", params={"userId": user_id})
        res.raise_for_status()
        return res.content

    async def debit_flat(self, *, user_id: str, campaign_id: str, application_id: str, questions: int = 0) -> dict:
        # Mesma chave do desktop (apply_agent): matar o worker e reprocessar não cobra 2x.
        return await self._call("POST", "/credits/debit-flat", json={
            "userId": user_id,
            "campaignId": campaign_id,
            "jobApplicationId": application_id,
            "idempotencyKey": f"application:{application_id}",
            "questions": questions,
        })
