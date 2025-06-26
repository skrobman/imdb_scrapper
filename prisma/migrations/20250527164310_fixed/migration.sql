/*
  Warnings:

  - You are about to drop the column `archived` on the `movie` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `movie_actor` table. All the data in the column will be lost.
  - Added the required column `url` to the `movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "movie" DROP COLUMN "archived",
ADD COLUMN     "film_location" TEXT,
ADD COLUMN     "rating_system" TEXT,
ADD COLUMN     "release_country" TEXT,
ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "movie_actor" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "movie_financial" ADD COLUMN     "opening_weekend_us_canada" BIGINT;
