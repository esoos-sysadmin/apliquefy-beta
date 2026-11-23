import pytest

from rpa_engine.cloud.__main__ import main
from rpa_engine.cloud.config import REQUIRED, load_cloud_settings


def test_missing_vars_listed_in_one_message(monkeypatch: pytest.MonkeyPatch) -> None:
    for k in REQUIRED:
        monkeypatch.delenv(k, raising=False)
    monkeypatch.setenv("WORKER_API_TOKEN", "t" * 32)
    with pytest.raises(RuntimeError) as e:
        load_cloud_settings()
    msg = str(e.value)
    assert all(k in msg for k in REQUIRED if k != "WORKER_API_TOKEN")
    assert "WORKER_API_TOKEN" not in msg


async def test_main_exits_1_with_message_no_traceback(monkeypatch: pytest.MonkeyPatch) -> None:
    for k in REQUIRED:
        monkeypatch.delenv(k, raising=False)
    with pytest.raises(SystemExit) as e:
        await main()
    assert isinstance(e.value.code, str) and "APLIQUEFY_WEB_URL" in e.value.code
