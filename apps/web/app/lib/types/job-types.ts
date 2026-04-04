import { z } from "zod"
import { createJobSchema } from "../validations/job"
import { Job } from "@repo/database"

type JobData = z.infer<typeof createJobSchema>

export type JobPagination = {
    page: number
    limit: number
    total: number
    total_pages: number
}

export type JobResponseError = {
    success: false
    errorDesc?: z.ZodFormattedError<JobData> | string
    message?: string
    code?: "CONFLICT" | "NOT_FOUND" | "FORBIDDEN"
}

export type JobResponseSuccess = {
    success: true
    data?: Job | Job[]
    pagination?: JobPagination
    message?: string
}

export type JobResponse = JobResponseError | JobResponseSuccess
