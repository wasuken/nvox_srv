/*
  Warnings:

  - Added the required column `contents` to the `naro_work` table without a default value. This is not possible if the table is not empty.
  - Added the required column `html` to the `naro_work` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "naro_work" ADD COLUMN     "contents" TEXT NOT NULL,
ADD COLUMN     "html" TEXT NOT NULL;
