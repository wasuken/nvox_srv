/*
  Warnings:

  - You are about to drop the column `url` on the `naro` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `naro_work` table. All the data in the column will be lost.
  - Added the required column `ncode` to the `naro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `no` to the `naro_work` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "naro" DROP COLUMN "url",
ADD COLUMN     "ncode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "naro_work" DROP COLUMN "url",
ADD COLUMN     "no" INTEGER NOT NULL;
