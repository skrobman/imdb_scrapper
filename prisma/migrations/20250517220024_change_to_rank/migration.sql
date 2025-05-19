/*
  Warnings:

  - You are about to drop the column `rating_pk` on the `Movie` table. All the data in the column will be lost.
  - Added the required column `rank` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "rating_pk",
ADD COLUMN     "rank" INTEGER NOT NULL;
