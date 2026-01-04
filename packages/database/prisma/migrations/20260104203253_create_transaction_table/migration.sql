/*
  Warnings:

  - You are about to drop the column `cakto_customer_id` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripe_customer_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('purchase', 'usage', 'bonus', 'refund');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "cakto_customer_id",
ADD COLUMN     "credits" INTEGER,
ADD COLUMN     "stripe_customer_id" VARCHAR;

-- CreateTable
CREATE TABLE "transaction" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT,
    "amount" INTEGER,
    "type" "TransactionType",
    "reference_id" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3),

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_stripe_customer_id_key" ON "users"("stripe_customer_id");

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_reference_id_fkey" FOREIGN KEY ("reference_id") REFERENCES "users"("stripe_customer_id") ON DELETE SET NULL ON UPDATE CASCADE;
