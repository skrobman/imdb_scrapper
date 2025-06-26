/*
  Warnings:

  - You are about to drop the column `box_office` on the `movie_financial` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "movie_financial" DROP COLUMN "box_office",
ADD COLUMN     "gross_us_canada" BIGINT,
ADD COLUMN     "gross_worldwide" BIGINT;
