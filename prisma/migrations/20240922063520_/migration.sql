/*
  Warnings:

  - Changed the type of `emoji` on the `Vote` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Emoji" AS ENUM ('HAPPY', 'NEUTRAL', 'SAD');

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "emoji",
ADD COLUMN     "emoji" "Emoji" NOT NULL;
