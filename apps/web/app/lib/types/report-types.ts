import { z } from "zod"
import { createReportSchema } from "../validations/report"
import { Report } from "@repo/database"

type ReportData = z.infer<typeof createReportSchema>

export type ReportPagination = {
    page: number
    limit: number
    total: number
    total_pages: number
}

export type ReportWithCampaign = Report & {
    campaign_name: string
    campaign_platform: string
}

export type ReportResponseError = {
    success: false
    errorDesc?: z.ZodFormattedError<ReportData> | string
    message?: string
    code?: "NOT_FOUND" | "FORBIDDEN"
}

export type ReportResponseSuccess = {
    success: true
    data?: Report | ReportWithCampaign | ReportWithCampaign[]
    pagination?: ReportPagination
    message?: string
}

export type ReportResponse = ReportResponseError | ReportResponseSuccess
