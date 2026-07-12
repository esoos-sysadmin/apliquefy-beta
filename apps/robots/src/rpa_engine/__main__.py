"""Entry point.

Binds an asyncio TCP socket to port 0, prints the chosen port to stdout
(`RPA_ENGINE_PORT=<n>`) so the Electron parent can connect, and launches uvicorn.
"""
from __future__ import annotations

import asyncio
import logging
import os
import socket
import sys

import uvicorn

from .config import load_settings
from .server import build_app


def _pick_port() -> int:
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.bind(("127.0.0.1", 0))
    port = sock.getsockname()[1]
    sock.close()
    return port


def main() -> None:
    # Mostra os logs internos do engine (logger.info dos passos do run). Sem isso,
    # o nível padrão WARNING esconde todo o progresso da automação.
    logging.basicConfig(
        level=os.environ.get("RPA_LOG_LEVEL", "INFO").upper(),
        format="%(levelname)s %(name)s: %(message)s",
    )

    settings = load_settings()
    port = _pick_port()

    sys.stdout.write(f"RPA_ENGINE_PORT={port}\n")
    sys.stdout.flush()

    app = build_app(settings)
    config = uvicorn.Config(app, host="127.0.0.1", port=port, log_level="info", lifespan="on")
    server = uvicorn.Server(config)
    asyncio.run(server.serve())


if __name__ == "__main__":
    main()
