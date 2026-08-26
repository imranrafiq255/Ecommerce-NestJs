/*
  Warnings:

  - You are about to drop the column `revoketAt` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "revoketAt",
ADD COLUMN     "revokedAt" TIMESTAMP(3);
