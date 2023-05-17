/*
  Warnings:

  - You are about to drop the column `wav_web_path` on the `rss_item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "naro_work_wav" ADD COLUMN     "wav_web_path" TEXT;

-- AlterTable
ALTER TABLE "rss_item" DROP COLUMN "wav_web_path";
