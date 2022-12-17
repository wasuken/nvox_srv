/*
  Warnings:

  - You are about to drop the `rss_item_voice` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `voice_filepath` to the `rss_item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "rss_item_voice" DROP CONSTRAINT "rss_item_voice_rss_item_id_fkey";

-- AlterTable
ALTER TABLE "rss_item" ADD COLUMN     "voice_filepath" TEXT NOT NULL;

-- DropTable
DROP TABLE "rss_item_voice";
