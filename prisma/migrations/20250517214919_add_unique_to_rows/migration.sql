/*
  Warnings:

  - A unique constraint covering the columns `[actor_name]` on the table `Actor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[country_name]` on the table `Country` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[director_name]` on the table `Director` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[genre_name]` on the table `Genre` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[language]` on the table `Language` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[movie_title]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[writer_name]` on the table `Writer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Actor_actor_name_key" ON "Actor"("actor_name");

-- CreateIndex
CREATE UNIQUE INDEX "Country_country_name_key" ON "Country"("country_name");

-- CreateIndex
CREATE UNIQUE INDEX "Director_director_name_key" ON "Director"("director_name");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_genre_name_key" ON "Genre"("genre_name");

-- CreateIndex
CREATE UNIQUE INDEX "Language_language_key" ON "Language"("language");

-- CreateIndex
CREATE UNIQUE INDEX "Movie_movie_title_key" ON "Movie"("movie_title");

-- CreateIndex
CREATE UNIQUE INDEX "Writer_writer_name_key" ON "Writer"("writer_name");
