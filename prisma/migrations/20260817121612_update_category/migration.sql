/*
  Warnings:

  - You are about to drop the column `categoryId` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Categories" AS ENUM ('APARTMENT', 'HOUSE', 'STUDIO', 'VILLA', 'ROOM');

-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_categoryId_fkey";

-- DropIndex
DROP INDEX "properties_categoryId_idx";

-- AlterTable
ALTER TABLE "properties" DROP COLUMN "categoryId",
ADD COLUMN     "category" "Categories" NOT NULL;

-- DropTable
DROP TABLE "Category";

-- CreateIndex
CREATE INDEX "properties_category_idx" ON "properties"("category");
