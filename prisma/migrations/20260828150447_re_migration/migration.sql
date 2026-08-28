/*
  Warnings:

  - Added the required column `paidAt` to the `Payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payments" ADD COLUMN     "paidAt" TIMESTAMP(3) NOT NULL;
