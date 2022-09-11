-- DropIndex
DROP INDEX "AuthAccessToken_accountId_key";

-- DropIndex
DROP INDEX "AuthRefreshToken_accountId_key";

-- AlterTable
ALTER TABLE "AuthAccessToken" ALTER COLUMN "expireAt" SET DEFAULT NOW() + interval '1 hour';

-- AlterTable
ALTER TABLE "AuthRefreshToken" ALTER COLUMN "expireAt" SET DEFAULT NOW() + interval '1 week';
