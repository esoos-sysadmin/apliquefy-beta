import { z } from "zod"
import { resumeSchema } from "../validations/resume"
import { Resume } from "@prisma/client"

type ResumeData = z.infer<typeof resumeSchema>;

export type CreateResumeError = {
    success: false;
    errorDesc?: z.ZodFormattedError<ResumeData> | string;
    message?: string;
}

export type CreateResumeSucess = {
    success: true;
    data?: Resume | Resume[]; 
    message?: string; 
}

export type CreateResumeResponse = CreateResumeError | CreateResumeSucess;