/*
  Warnings:

  - A unique constraint covering the columns `[accessToken]` on the table `AccessToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accessToken` to the `AccessToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccessToken" ADD COLUMN     "accessToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AccessToken_accessToken_key" ON "AccessToken"("accessToken");
