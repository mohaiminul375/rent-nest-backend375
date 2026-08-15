-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('TENANT', 'LANDLORD', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('UNBANNED', 'BANNED');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('AVAILABLE', 'RENTED', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "RentalRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CARD', 'MOBILE_BANKING', 'BANK_TRANSFER');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE', 'SSLCOMMERZ');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "Categories" AS ENUM ('APARTMENT', 'HOUSE', 'STUDIO');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'UNBANNED',
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
