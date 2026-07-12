"""Resume PDF rendering endpoint (M3)."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from ..pdf.resume_pdf import render_resume

router = APIRouter()


class RenderResumeRequest(BaseModel):
    resumeId: str
    payload: dict
    styleId: str = "default"


class RenderResumeResponse(BaseModel):
    path: str
    hash: str
    cached: bool


@router.post("/resumes/render", response_model=RenderResumeResponse)
def render_resume_endpoint(body: RenderResumeRequest, request: Request) -> RenderResumeResponse:
    settings = request.state.settings
    if not body.resumeId:
        raise HTTPException(status_code=400, detail="resumeId is required")

    payload_bytes = json.dumps({"p": body.payload, "s": body.styleId}, sort_keys=True).encode("utf-8")
    digest = hashlib.sha256(payload_bytes).hexdigest()[:16]

    out_dir: Path = settings.resume_pdf_dir
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"{body.resumeId}-{digest}.pdf"

    if out_path.exists():
        return RenderResumeResponse(path=str(out_path), hash=digest, cached=True)

    pdf_bytes = render_resume(body.payload, body.styleId)
    out_path.write_bytes(pdf_bytes)
    return RenderResumeResponse(path=str(out_path), hash=digest, cached=False)
