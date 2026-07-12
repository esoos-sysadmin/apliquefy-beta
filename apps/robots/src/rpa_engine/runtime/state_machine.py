"""Map agent status_code → orchestrator outcome."""
from __future__ import annotations

from enum import Enum


class Outcome(str, Enum):
    CONTINUE = "continue"
    SUCCESS = "success"
    PAUSE_MISSING_DATA = "pause_missing_data"
    PAUSE_SESSION_INVALID = "pause_session_invalid"
    SKIP_DEAD_SCREEN = "skip_dead_screen"
    SKIP_UNANSWERABLE = "skip_unanswerable"
    PAUSE_RETRY = "pause_retry"


def classify(status_code: int) -> Outcome:
    return {
        200: Outcome.CONTINUE,
        201: Outcome.SUCCESS,
        400: Outcome.PAUSE_MISSING_DATA,
        403: Outcome.PAUSE_SESSION_INVALID,
        404: Outcome.SKIP_DEAD_SCREEN,
        422: Outcome.SKIP_UNANSWERABLE,
        500: Outcome.PAUSE_RETRY,
    }.get(status_code, Outcome.PAUSE_RETRY)
