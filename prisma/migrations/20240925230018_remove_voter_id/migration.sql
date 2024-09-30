/*
  Warnings:

  - You are about to drop the column `voterId` on the `Vote` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Vote_pollId_voterId_key";

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "voterId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Vote_pollId_idx" ON "Vote"("pollId");
