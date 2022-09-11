-- AlterTable
ALTER TABLE "AuthAccessToken" ALTER COLUMN "expireAt" SET DEFAULT NOW() + interval '1 hour';

-- AlterTable
ALTER TABLE "AuthAccount" ADD COLUMN     "privileges" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "AuthRefreshToken" ALTER COLUMN "expireAt" SET DEFAULT NOW() + interval '1 week';
