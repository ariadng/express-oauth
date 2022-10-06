-- AlterTable
ALTER TABLE "AuthAccessToken" ALTER COLUMN "expireAt" SET DEFAULT NOW() + interval '1 hour';

-- AlterTable
ALTER TABLE "AuthRefreshToken" ALTER COLUMN "expireAt" SET DEFAULT NOW() + interval '1 week';

-- CreateTable
CREATE TABLE "AuthCode" (
    "token" TEXT NOT NULL,
    "expireAt" TIMESTAMP(3) NOT NULL,
    "accountId" INTEGER NOT NULL,
    "clientId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthCode_token_key" ON "AuthCode"("token");

-- AddForeignKey
ALTER TABLE "AuthCode" ADD CONSTRAINT "AuthCode_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "AuthAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthCode" ADD CONSTRAINT "AuthCode_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "AuthClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
