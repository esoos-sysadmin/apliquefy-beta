-- Filtros da campanha "Sites de empresas" (B1): work_models/seniorities/exclude_terms
-- substituem remote_only; vazio = sem filtro.
ALTER TABLE "campaign_ats"
  ADD COLUMN "work_models"   TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "seniorities"   TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "exclude_terms" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

UPDATE "campaign_ats" SET "work_models" = ARRAY['remote']::TEXT[] WHERE "remote_only" = true;

ALTER TABLE "campaign_ats" DROP COLUMN "remote_only";

ALTER TABLE "job_postings" ADD COLUMN "workplace_type" VARCHAR;
