/*
  Warnings:

  - You are about to drop the column `total` on the `naro` table. All the data in the column will be lost.
  - Added the required column `totalPage` to the `naro` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "naro" DROP COLUMN "total",
ADD COLUMN     "totalPage" INTEGER NOT NULL;
