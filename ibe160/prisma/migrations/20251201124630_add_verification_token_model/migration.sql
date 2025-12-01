/*
  Warnings:

  - You are about to drop the column `identifier` on the `VerificationToken` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `VerificationToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[hashedToken]` on the table `VerificationToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,hashedToken]` on the table `VerificationToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hashedToken` to the `VerificationToken` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `VerificationToken` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updatedAt` to the `VerificationToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `VerificationToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "VerificationToken_identifier_token_key";

-- DropIndex
DROP INDEX "VerificationToken_token_key";

-- AlterTable
ALTER TABLE "VerificationToken" DROP COLUMN "identifier",
DROP COLUMN "token",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "hashedToken" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_hashedToken_key" ON "VerificationToken"("hashedToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_userId_hashedToken_key" ON "VerificationToken"("userId", "hashedToken");

-- AddForeignKey
ALTER TABLE "VerificationToken" ADD CONSTRAINT "VerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
