-- AlterTable
ALTER TABLE "AuthAccessToken" ALTER COLUMN "expireAt" SET DEFAULT NOW() + interval '1 hour';

-- AlterTable
ALTER TABLE "AuthRefreshToken" ALTER COLUMN "expireAt" SET DEFAULT NOW() + interval '1 week';

-- CreateTable
CREATE TABLE "AuthClient" (
    "id" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "redirectUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT ''
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthClient_id_key" ON "AuthClient"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AuthClient_secret_key" ON "AuthClient"("secret");
