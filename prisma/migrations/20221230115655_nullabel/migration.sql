-- AlterTable
ALTER TABLE "rss_item" ALTER COLUMN "desc" DROP NOT NULL,
ALTER COLUMN "desc" SET DEFAULT '',
ALTER COLUMN "shortdesc" DROP NOT NULL;
