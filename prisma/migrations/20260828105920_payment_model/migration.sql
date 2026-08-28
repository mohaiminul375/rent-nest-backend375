/*
  Warnings:

  - You are about to alter the column `price` on the `properties` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to drop the column `payment` on the `rental_requests` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "properties" ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "rental_requests" DROP COLUMN "payment";

-- CreateTable
CREATE TABLE "Payments" (
    "id" TEXT NOT NULL,
    "rentalRequestId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "transactionId" TEXT,
    "provider" "PaymentProvider" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payments_rentalRequestId_key" ON "Payments"("rentalRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "Payments_transactionId_key" ON "Payments"("transactionId");

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_rentalRequestId_fkey" FOREIGN KEY ("rentalRequestId") REFERENCES "rental_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
