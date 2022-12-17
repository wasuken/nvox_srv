/*
  Warnings:

  - Added the required column `updated_at` to the `rss_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rss_item" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "voice_downloaded" BOOLEAN NOT NULL DEFAULT false;
