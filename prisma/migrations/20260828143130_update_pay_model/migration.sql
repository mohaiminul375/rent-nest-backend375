/*
  Warnings:

  - You are about to drop the column `stripeCustomerId` on the `Payments` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Payments_stripeCustomerId_key";

-- AlterTable
ALTER TABLE "Payments" DROP COLUMN "stripeCustomerId";
