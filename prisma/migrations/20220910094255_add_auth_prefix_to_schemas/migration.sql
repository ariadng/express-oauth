/*
  Warnings:

  - You are about to drop the `AccessToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RefreshToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AccessToken" DROP CONSTRAINT "AccessToken_accountId_fkey";

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_accountId_fkey";

-- DropTable
DROP TABLE "AccessToken";

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "RefreshToken";

-- CreateTable
CREATE TABLE "AuthAccount" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "AuthAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthRefreshToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "expireAt" TIMESTAMP(3) NOT NULL DEFAULT NOW() + interval '1 week',
    "accountId" INTEGER NOT NULL,

    CONSTRAINT "AuthRefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthAccessToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "expireAt" TIMESTAMP(3) NOT NULL DEFAULT NOW() + interval '1 hour',
    "accountId" INTEGER NOT NULL,

    CONSTRAINT "AuthAccessToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthAccount_username_key" ON "AuthAccount"("username");

-- CreateIndex
CREATE UNIQUE INDEX "AuthRefreshToken_token_key" ON "AuthRefreshToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "AuthRefreshToken_accountId_key" ON "AuthRefreshToken"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthAccessToken_token_key" ON "AuthAccessToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "AuthAccessToken_accountId_key" ON "AuthAccessToken"("accountId");

-- AddForeignKey
ALTER TABLE "AuthRefreshToken" ADD CONSTRAINT "AuthRefreshToken_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "AuthAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthAccessToken" ADD CONSTRAINT "AuthAccessToken_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "AuthAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
