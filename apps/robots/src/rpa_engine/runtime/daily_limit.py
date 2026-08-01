"""Daily limit enforcement against the web backend."""
from __future__ import annotations

from ..web_api.client import WebApiClient


async def remaining_for_campaign(client: WebApiClient, campaign_id: str) -> int:
    status = await client.get_daily_status(campaign_id)
    return int(status.get("remaining", 0))
