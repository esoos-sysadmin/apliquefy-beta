import { NextResponse } from "next/server"
import { workerRoute } from "../../../../lib/auth/server/worker"
import { campaignService } from "../../../../../backend/modules/campaign/campaign.service"

export const GET = workerRoute(async () => {
    return NextResponse.json({ success: true, data: await campaignService.listActiveCloudCampaigns() })
})
