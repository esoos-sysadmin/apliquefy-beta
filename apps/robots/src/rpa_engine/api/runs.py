"""Run lifecycle endpoints (start/stop/status)."""
from __future__ import annotations

import asyncio
from uuid import uuid4

from fastapi import APIRouter, HTTPException, Request, WebSocket, WebSocketDisconnect, status
from pydantic import BaseModel

from ..runtime.orchestrator import Orchestrator, RunHandle

router = APIRouter()
# Router separado para o WebSocket: ele autentica via header/query manualmente,
# e a dependency HTTP (HTTPBearer) quebra em rotas WebSocket.
events_router = APIRouter()

_runs: dict[str, RunHandle] = {}


class RunRequest(BaseModel):
    campaignId: str
    storageStatePath: str
    resumePdfPath: str
    # Token fresco do usuário (Clerk) para os callbacks à API web deste run.
    webToken: str | None = None


class RunResponse(BaseModel):
    runId: str
    status: str = "started"


@router.post("/runs", response_model=RunResponse, status_code=status.HTTP_202_ACCEPTED)
async def start_run(payload: RunRequest, request: Request) -> RunResponse:
    settings = request.state.settings
    run_id = str(uuid4())
    handle = await Orchestrator(settings).start(
        run_id=run_id,
        campaign_id=payload.campaignId,
        storage_state_path=payload.storageStatePath,
        resume_pdf_path=payload.resumePdfPath,
        web_token=payload.webToken,
    )
    _runs[run_id] = handle
    return RunResponse(runId=run_id)


@router.delete("/runs/{run_id}")
async def stop_run(run_id: str) -> dict[str, bool]:
    handle = _runs.pop(run_id, None)
    if not handle:
        raise HTTPException(status_code=404, detail="run not found")
    await handle.stop()
    return {"success": True}


@router.get("/runs/{run_id}/status")
async def run_status(run_id: str) -> dict[str, str]:
    handle = _runs.get(run_id)
    if not handle:
        raise HTTPException(status_code=404, detail="run not found")
    return {"runId": run_id, "state": handle.state}


@events_router.websocket("/runs/{run_id}/events")
async def run_events(websocket: WebSocket, run_id: str) -> None:
    settings = websocket.app.state.settings
    auth_header = websocket.headers.get("authorization", "")
    token_qs = websocket.query_params.get("token", "")
    candidate = auth_header.removeprefix("Bearer ").strip() or token_qs
    if candidate != settings.auth_token:
        await websocket.close(code=4401)
        return

    handle = _runs.get(run_id)
    if not handle:
        await websocket.close(code=4404)
        return

    await websocket.accept()
    queue: asyncio.Queue = handle.subscribe()
    try:
        while True:
            event = await queue.get()
            await websocket.send_json(event)
            if event.get("type") == "finished":
                break
    except WebSocketDisconnect:
        pass
    finally:
        handle.unsubscribe(queue)
