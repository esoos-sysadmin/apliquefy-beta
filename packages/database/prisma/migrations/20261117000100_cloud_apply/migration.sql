-- Envio pela nuvem: catálogo global de vagas, boards de ATS, config da campanha ats
-- e colunas da fila em job_applications (SDD-candidatura-nuvem §5).

-- AlterTable
ALTER TABLE "job_applications" ADD COLUMN     "ats" VARCHAR,
ADD COLUMN     "attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "job_posting_id" UUID,
ADD COLUMN     "live_view_url" VARCHAR,
ADD COLUMN     "locked_at" TIMESTAMP,
ADD COLUMN     "locked_by" VARCHAR,
ADD COLUMN     "needs_user_until" TIMESTAMP,
ADD COLUMN     "run_after" TIMESTAMP;

-- CreateTable
CREATE TABLE "campaign_ats" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "campaign_id" UUID NOT NULL,
    "search_terms" VARCHAR NOT NULL,
    "location_term" VARCHAR,
    "remote_only" BOOLEAN NOT NULL DEFAULT false,
    "ats_allowlist" TEXT[],
    "fit_min_score" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "campaign_ats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_postings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "canonical_url" VARCHAR NOT NULL,
    "apply_url" VARCHAR NOT NULL,
    "ats" VARCHAR NOT NULL,
    "board_token" VARCHAR,
    "external_id" VARCHAR,
    "title" VARCHAR NOT NULL,
    "company_name" VARCHAR,
    "location" VARCHAR,
    "is_remote" BOOLEAN,
    "description" TEXT,
    "posted_at" TIMESTAMP,
    "closed_at" TIMESTAMP,
    "source" VARCHAR NOT NULL,
    "source_ref" VARCHAR,
    "first_seen_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_postings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ats_boards" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ats" VARCHAR NOT NULL,
    "token" VARCHAR NOT NULL,
    "company_name" VARCHAR,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "last_fetched_at" TIMESTAMP,

    CONSTRAINT "ats_boards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "campaign_ats_campaign_id_key" ON "campaign_ats"("campaign_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_postings_canonical_url_key" ON "job_postings"("canonical_url");

-- CreateIndex
CREATE INDEX "job_postings_ats_last_seen_at_idx" ON "job_postings"("ats", "last_seen_at");

-- CreateIndex
CREATE UNIQUE INDEX "ats_boards_ats_token_key" ON "ats_boards"("ats", "token");

-- CreateIndex
CREATE INDEX "job_applications_platform_status_run_after_idx" ON "job_applications"("platform", "status", "run_after");

-- AddForeignKey
ALTER TABLE "campaign_ats" ADD CONSTRAINT "campaign_ats_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_job_posting_id_fkey" FOREIGN KEY ("job_posting_id") REFERENCES "job_postings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

