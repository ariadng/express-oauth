-- AlterTable
ALTER TABLE "AuthAccessToken" ALTER COLUMN "expireAt" SET DEFAULT NOW() + interval '1 hour';

-- AlterTable
ALTER TABLE "AuthRefreshToken" ALTER COLUMN "expireAt" SET DEFAULT NOW() + interval '1 week';

-- CreateTable
CREATE TABLE "AuthClientDomain" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "domain" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthClientDomain_id_key" ON "AuthClientDomain"("id");

-- AddForeignKey
ALTER TABLE "AuthClientDomain" ADD CONSTRAINT "AuthClientDomain_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "AuthClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
