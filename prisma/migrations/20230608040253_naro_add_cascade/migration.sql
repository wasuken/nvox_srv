-- DropForeignKey
ALTER TABLE "naro_work" DROP CONSTRAINT "naro_work_naro_id_fkey";

-- DropForeignKey
ALTER TABLE "naro_work_wav" DROP CONSTRAINT "naro_work_wav_naro_work_id_fkey";

-- AddForeignKey
ALTER TABLE "naro_work" ADD CONSTRAINT "naro_work_naro_id_fkey" FOREIGN KEY ("naro_id") REFERENCES "naro"("naro_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "naro_work_wav" ADD CONSTRAINT "naro_work_wav_naro_work_id_fkey" FOREIGN KEY ("naro_work_id") REFERENCES "naro_work"("naro_work_id") ON DELETE CASCADE ON UPDATE NO ACTION;
