/*
  Warnings:

  - You are about to drop the column `redirectUrl` on the `AuthClient` table. All the data in the column will be lost.
  - Added the required column `redirectUri` to the `AuthClient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AuthAccessToken" ALTER COLUMN "expireAt" SET DEFAULT NOW() + interval '1 hour';

-- AlterTable
ALTER TABLE "AuthClient" DROP COLUMN "redirectUrl",
ADD COLUMN     "redirectUri" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AuthRefreshToken" ALTER COLUMN "expireAt" SET DEFAULT NOW() + interval '1 week';
