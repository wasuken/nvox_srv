/*
  Warnings:

  - Added the required column `contents` to the `naro_work_wav` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seq_no` to the `naro_work_wav` table without a default value. This is not possible if the table is not empty.
  - Made the column `wavpath` on table `naro_work_wav` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "naro_work_wav" ADD COLUMN     "contents" TEXT NOT NULL,
ADD COLUMN     "seq_no" INTEGER NOT NULL,
ALTER COLUMN "wavpath" SET NOT NULL;
