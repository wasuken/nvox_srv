-- CreateTable
CREATE TABLE "rss_item_tag" (
    "rss_item_tag_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "rss_item_id" INTEGER NOT NULL,

    CONSTRAINT "rss_item_tag_pkey" PRIMARY KEY ("rss_item_tag_id")
);

-- AddForeignKey
ALTER TABLE "rss_item_tag" ADD CONSTRAINT "rss_item_tag_rss_item_id_fkey" FOREIGN KEY ("rss_item_id") REFERENCES "rss_item"("rss_item_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
