/*
  Warnings:

  - A unique constraint covering the columns `[link]` on the table `rss_item` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "rss_item_link_key" ON "rss_item"("link");
