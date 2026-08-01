"""Falha mecânica não pode virar 'Ignorada' — foi o que zerou o contador de Falhas."""
from rpa_engine.runtime.apply_agent import SKIP_MARKER, _STATUS_BY_OUTCOME, _outcome_from_result
from rpa_engine.runtime.state_machine import Outcome


def test_outcomes() -> None:
    assert _outcome_from_result(True, "enviado") is Outcome.SUCCESS
    # skip legítimo: só com o marcador
    assert _outcome_from_result(False, f"{SKIP_MARKER} exige visto de trabalho") is Outcome.SKIP_UNANSWERABLE
    assert _outcome_from_result(False, f"  {SKIP_MARKER.lower()} exige CNH") is Outcome.SKIP_UNANSWERABLE
    # bloqueio mecânico: os error_log reais que estavam caindo como "Ignorada"
    for log in (
        "no functional 'Submit' button available on the page",
        "final step of submission failed repeatedly due to redirection issues",
        None,
        "",
    ):
        assert _outcome_from_result(False, log) is Outcome.PAUSE_RETRY, log
    assert _outcome_from_result(None, None) is Outcome.PAUSE_RETRY  # estourou max_steps

    assert _STATUS_BY_OUTCOME[Outcome.SKIP_UNANSWERABLE] == "skipped"
    assert _STATUS_BY_OUTCOME[Outcome.PAUSE_RETRY] == "failed"


if __name__ == "__main__":
    test_outcomes()
    print("ok")
