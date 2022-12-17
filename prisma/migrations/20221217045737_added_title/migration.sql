/*
  Warnings:

  - Added the required column `title` to the `rss_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rss_item" ADD COLUMN     "title" TEXT NOT NULL;
