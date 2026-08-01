import json
from pathlib import Path

from rpa_engine.runtime.session_loader import _sanitize_storage_state


def test_drops_partition_key_and_keeps_auth_cookies(tmp_path: Path) -> None:
    state = {
        "cookies": [
            {"name": "__cf_bm", "value": "x", "partitionKey": "https://linkedin.com"},
            {"name": "li_at", "value": "auth"},
        ],
        "origins": [{"origin": "https://www.linkedin.com"}],
    }
    path = tmp_path / "storage-state.json"
    path.write_text(json.dumps(state), encoding="utf-8")

    _sanitize_storage_state(path)

    data = json.loads(path.read_text(encoding="utf-8"))
    assert all("partitionKey" not in cookie for cookie in data["cookies"])
    assert [cookie["name"] for cookie in data["cookies"]] == ["__cf_bm", "li_at"]
    assert data["origins"] == state["origins"]


def test_leaves_clean_file_untouched(tmp_path: Path) -> None:
    path = tmp_path / "storage-state.json"
    raw = '{"cookies": [{"name": "li_at", "value": "auth"}]}'
    path.write_text(raw, encoding="utf-8")

    _sanitize_storage_state(path)

    assert path.read_text(encoding="utf-8") == raw
