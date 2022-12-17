-- CreateTable
CREATE TABLE "rss" (
    "rss_id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rss_pkey" PRIMARY KEY ("rss_id")
);

-- CreateTable
CREATE TABLE "rss_item" (
    "rss_item_id" SERIAL NOT NULL,
    "rss_id" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "desc" TEXT NOT NULL,

    CONSTRAINT "rss_item_pkey" PRIMARY KEY ("rss_item_id")
);

-- AddForeignKey
ALTER TABLE "rss_item" ADD CONSTRAINT "rss_item_rss_id_fkey" FOREIGN KEY ("rss_id") REFERENCES "rss"("rss_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
