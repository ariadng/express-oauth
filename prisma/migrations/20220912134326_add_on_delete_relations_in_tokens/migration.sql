-- DropForeignKey
ALTER TABLE "AuthAccessToken" DROP CONSTRAINT "AuthAccessToken_accountId_fkey";

-- DropForeignKey
ALTER TABLE "AuthAccessToken" DROP CONSTRAINT "AuthAccessToken_clientId_fkey";

-- AlterTable
ALTER TABLE "AuthAccessToken" ALTER COLUMN "expireAt" SET DEFAULT NOW() + interval '1 hour';

-- AlterTable
ALTER TABLE "AuthRefreshToken" ALTER COLUMN "expireAt" SET DEFAULT NOW() + interval '1 week';

-- AddForeignKey
ALTER TABLE "AuthAccessToken" ADD CONSTRAINT "AuthAccessToken_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "AuthAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthAccessToken" ADD CONSTRAINT "AuthAccessToken_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "AuthClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
