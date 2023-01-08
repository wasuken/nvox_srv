/*
  Warnings:

  - You are about to drop the column `voice_filepath` on the `rss_item` table. All the data in the column will be lost.
  - Added the required column `wavpath` to the `naro_work` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "naro_work" ADD COLUMN     "wavpath" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "rss_item" DROP COLUMN "voice_filepath",
ADD COLUMN     "wavpath" TEXT;
