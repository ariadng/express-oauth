/*
  Warnings:

  - The `id` column on the `AuthClientDomain` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "AuthClientDomain_id_key";

-- AlterTable
ALTER TABLE "AuthAccessToken" ALTER COLUMN "expireAt" SET DEFAULT NOW() + interval '1 hour';

-- AlterTable
ALTER TABLE "AuthClientDomain" DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "AuthClientDomain_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "AuthRefreshToken" ALTER COLUMN "expireAt" SET DEFAULT NOW() + interval '1 week';
