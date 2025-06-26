/*
  Warnings:

  - Added the required column `rank` to the `movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "movie" ADD COLUMN     "rank" INTEGER NOT NULL;
