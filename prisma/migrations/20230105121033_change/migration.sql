/*
  Warnings:

  - You are about to drop the column `wavpath` on the `naro_work` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ncode]` on the table `naro` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `total` to the `naro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `naro_work` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "naro" ADD COLUMN     "total" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "naro_work" DROP COLUMN "wavpath",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "naro_work_wav" (
    "naro_work_wav_id" SERIAL NOT NULL,
    "naro_work_id" INTEGER NOT NULL,
    "wavpath" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "naro_work_wav_pkey" PRIMARY KEY ("naro_work_wav_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "naro_ncode_key" ON "naro"("ncode");

-- AddForeignKey
ALTER TABLE "naro_work_wav" ADD CONSTRAINT "naro_work_wav_naro_work_id_fkey" FOREIGN KEY ("naro_work_id") REFERENCES "naro_work"("naro_work_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
