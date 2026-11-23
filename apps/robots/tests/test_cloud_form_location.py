from rpa_engine.cloud.adapters.base import _city_query, _unique_match

OPTS = ["Recife, Pernambuco, Brazil", "Recife, Bahia, Brazil", "Fazenda Recife, Ceara, Brazil"]


def test_uf_disambiguates_city() -> None:
    assert _unique_match("Recife, PE", OPTS) == "Recife, Pernambuco, Brazil"
    assert _unique_match("Recife - PE", OPTS) == "Recife, Pernambuco, Brazil"


def test_r10_ambiguous_city_is_not_guessed() -> None:
    assert _unique_match("Recife", OPTS) is None
    assert _unique_match("Recife, BA", OPTS + ["Recife, Bahia, Brazil"]) is None  # duas "Recife, Bahia"


def test_city_query_is_first_segment() -> None:
    assert _city_query("Recife, PE") == "Recife"
    assert _city_query("Recife - PE") == "Recife"
    assert _city_query("Rio de Janeiro") == "Rio de Janeiro"
