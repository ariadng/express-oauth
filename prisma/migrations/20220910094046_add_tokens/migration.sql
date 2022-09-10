/*
  Warnings:

  - You are about to drop the column `accessToken` on the `AccessToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `AccessToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `AccessToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "AccessToken_accessToken_key";

-- AlterTable
ALTER TABLE "AccessToken" DROP COLUMN "accessToken",
ADD COLUMN     "expireAt" TIMESTAMP(3) NOT NULL DEFAULT NOW() + interval '1 hour',
ADD COLUMN     "token" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "expireAt" TIMESTAMP(3) NOT NULL DEFAULT NOW() + interval '1 week',
    "accountId" INTEGER NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_accountId_key" ON "RefreshToken"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "AccessToken_token_key" ON "AccessToken"("token");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
