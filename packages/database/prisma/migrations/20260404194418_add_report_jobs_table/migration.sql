/*
  Warnings:

  - You are about to drop the column `stripe_customer_id` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[gateway_customer_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_stripe_customer_id_key";

-- AlterTable
ALTER TABLE "campaigns" ALTER COLUMN "status" SET DEFAULT 'paused';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "stripe_customer_id",
ADD COLUMN     "gateway_customer_id" VARCHAR,
ALTER COLUMN "credits" DROP NOT NULL;

-- CreateTable
CREATE TABLE "jobs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "campaign_id" UUID,
    "link" VARCHAR,
    "company_name" VARCHAR,
    "position" VARCHAR,
    "expiration_date" TIMESTAMP,
    "number_of_applications" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "campaign_id" UUID,
    "total_jobs_applications" INTEGER NOT NULL DEFAULT 0,
    "success_applications" INTEGER NOT NULL DEFAULT 0,
    "fail_applications" INTEGER NOT NULL DEFAULT 0,
    "credits_used" INTEGER NOT NULL DEFAULT 0,
    "credits_refund" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "jobs_link_key" ON "jobs"("link");

-- CreateIndex
CREATE UNIQUE INDEX "users_gateway_customer_id_key" ON "users"("gateway_customer_id");

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;
