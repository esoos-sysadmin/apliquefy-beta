-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TransactionType" ADD VALUE 'SUBSCRIPTION_CREDIT';
ALTER TYPE "TransactionType" ADD VALUE 'RESET';

-- DropIndex
DROP INDEX "job_applications_job_url_key";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "idempotency_key" VARCHAR,
ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "job_applications" ADD COLUMN     "got_interview" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "got_response" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "current_period_end" TIMESTAMP,
ADD COLUMN     "stripe_subscription_id" VARCHAR,
ADD COLUMN     "subscription_status" VARCHAR,
ALTER COLUMN "credits" SET NOT NULL,
ALTER COLUMN "credits" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "credit_weights" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "stage" VARCHAR NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "label" VARCHAR NOT NULL,

    CONSTRAINT "credit_weights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_events" (
    "id" VARCHAR NOT NULL,
    "type" VARCHAR NOT NULL,
    "processed_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ab_tests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "name" VARCHAR NOT NULL,
    "platform" "platform" NOT NULL,
    "hypothesis" VARCHAR,
    "variant_a_id" UUID NOT NULL,
    "variant_b_id" UUID NOT NULL,
    "winner" VARCHAR,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ab_tests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "credit_weights_stage_key" ON "credit_weights"("stage");

-- CreateIndex
CREATE UNIQUE INDEX "ab_tests_variant_a_id_key" ON "ab_tests"("variant_a_id");

-- CreateIndex
CREATE UNIQUE INDEX "ab_tests_variant_b_id_key" ON "ab_tests"("variant_b_id");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_idempotency_key_key" ON "Transaction"("idempotency_key");

-- CreateIndex
CREATE INDEX "job_applications_user_id_applied_at_idx" ON "job_applications"("user_id", "applied_at");

-- CreateIndex
CREATE INDEX "job_applications_campaign_id_applied_at_idx" ON "job_applications"("campaign_id", "applied_at");

-- CreateIndex
CREATE UNIQUE INDEX "job_applications_user_id_job_url_key" ON "job_applications"("user_id", "job_url");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripe_subscription_id_key" ON "users"("stripe_subscription_id");

-- AddForeignKey
ALTER TABLE "ab_tests" ADD CONSTRAINT "ab_tests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ab_tests" ADD CONSTRAINT "ab_tests_variant_a_id_fkey" FOREIGN KEY ("variant_a_id") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ab_tests" ADD CONSTRAINT "ab_tests_variant_b_id_fkey" FOREIGN KEY ("variant_b_id") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
