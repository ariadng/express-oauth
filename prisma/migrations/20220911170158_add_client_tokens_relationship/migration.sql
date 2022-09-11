/*
  Warnings:

  - Added the required column `clientId` to the `AuthAccessToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientId` to the `AuthRefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AuthAccessToken" ADD COLUMN     "clientId" TEXT NOT NULL,
ALTER COLUMN "expireAt" SET DEFAULT NOW() + interval '1 hour';

-- AlterTable
ALTER TABLE "AuthRefreshToken" ADD COLUMN     "clientId" TEXT NOT NULL,
ALTER COLUMN "expireAt" SET DEFAULT NOW() + interval '1 week';

-- AddForeignKey
ALTER TABLE "AuthRefreshToken" ADD CONSTRAINT "AuthRefreshToken_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "AuthClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthAccessToken" ADD CONSTRAINT "AuthAccessToken_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "AuthClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
