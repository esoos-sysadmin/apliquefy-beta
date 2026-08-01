"""FastAPI app factory."""
from __future__ import annotations

from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from .config import Settings


def build_app(settings: Settings) -> FastAPI:
    bearer = HTTPBearer(auto_error=False)

    def require_auth(creds: HTTPAuthorizationCredentials | None = Depends(bearer)) -> None:
        if not creds or creds.credentials != settings.auth_token:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid token")

    app = FastAPI(title="Apliquefy RPA Engine", version="0.1.0")
    app.state.settings = settings

    @app.get("/health")
    def health(_=Depends(require_auth)) -> dict[str, str]:
        return {"status": "ok"}

    from .api import runs

    app.include_router(runs.router, dependencies=[Depends(require_auth)])
    # WebSocket de eventos: autentica internamente; sem a dependency HTTP.
    app.include_router(runs.events_router)

    @app.middleware("http")
    async def attach_settings(request: Request, call_next):
        request.state.settings = settings
        return await call_next(request)

    return app
