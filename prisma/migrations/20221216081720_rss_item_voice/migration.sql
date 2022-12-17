-- CreateTable
CREATE TABLE "rss_item_voice" (
    "rss_voice_id" SERIAL NOT NULL,
    "rss_item_id" INTEGER NOT NULL,
    "voice_filepath" TEXT NOT NULL,

    CONSTRAINT "rss_item_voice_pkey" PRIMARY KEY ("rss_voice_id")
);

-- AddForeignKey
ALTER TABLE "rss_item_voice" ADD CONSTRAINT "rss_item_voice_rss_item_id_fkey" FOREIGN KEY ("rss_item_id") REFERENCES "rss_item"("rss_item_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
