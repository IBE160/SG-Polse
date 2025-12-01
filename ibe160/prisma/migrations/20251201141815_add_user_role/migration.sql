/*
  Warnings:

  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - The primary key for the `VerificationToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `VerificationToken` table. All the data in the column will be lost.
  - You are about to drop the column `hashedToken` on the `VerificationToken` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `VerificationToken` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `VerificationToken` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `VerificationToken` table. All the data in the column will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[token]` on the table `VerificationToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identifier,token]` on the table `VerificationToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `identifier` to the `VerificationToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `VerificationToken` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'TEACHER');

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_createdById_fkey";

-- DropForeignKey
ALTER TABLE "VerificationToken" DROP CONSTRAINT "VerificationToken_userId_fkey";

-- DropIndex
DROP INDEX "VerificationToken_hashedToken_key";

-- DropIndex
DROP INDEX "VerificationToken_userId_hashedToken_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "passwordHash",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'STUDENT',
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "VerificationToken" DROP CONSTRAINT "VerificationToken_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "hashedToken",
DROP COLUMN "id",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "identifier" TEXT NOT NULL,
ADD COLUMN     "token" TEXT NOT NULL;

-- DropTable
DROP TABLE "Post";

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
