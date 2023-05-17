-- AlterTable
ALTER TABLE "naro_work_wav" ALTER COLUMN "wavpath" DROP NOT NULL,
ALTER COLUMN "seq_no" SET DEFAULT 0;
