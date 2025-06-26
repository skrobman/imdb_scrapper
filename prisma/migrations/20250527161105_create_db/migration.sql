-- CreateTable
CREATE TABLE "movie" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "release_date" TIMESTAMP(3) NOT NULL,
    "imdb_rating" DECIMAL(3,1) NOT NULL,
    "runtime" INTEGER NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movie_financial" (
    "id" TEXT NOT NULL,
    "movie_id" TEXT NOT NULL,
    "budget" BIGINT,
    "box_office" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "movie_financial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actor" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "actor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movie_actor" (
    "movie_id" TEXT NOT NULL,
    "actor_id" TEXT NOT NULL,
    "role" TEXT,

    CONSTRAINT "movie_actor_pkey" PRIMARY KEY ("movie_id","actor_id")
);

-- CreateTable
CREATE TABLE "director" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "director_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movie_director" (
    "movie_id" TEXT NOT NULL,
    "director_id" TEXT NOT NULL,

    CONSTRAINT "movie_director_pkey" PRIMARY KEY ("movie_id","director_id")
);

-- CreateTable
CREATE TABLE "writer" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "writer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movie_writer" (
    "movie_id" TEXT NOT NULL,
    "writer_id" TEXT NOT NULL,

    CONSTRAINT "movie_writer_pkey" PRIMARY KEY ("movie_id","writer_id")
);

-- CreateTable
CREATE TABLE "company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_film" (
    "movie_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,

    CONSTRAINT "company_film_pkey" PRIMARY KEY ("movie_id","company_id")
);

-- CreateTable
CREATE TABLE "country" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movie_country" (
    "movie_id" TEXT NOT NULL,
    "country_id" TEXT NOT NULL,

    CONSTRAINT "movie_country_pkey" PRIMARY KEY ("movie_id","country_id")
);

-- CreateTable
CREATE TABLE "language" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movie_language" (
    "movie_id" TEXT NOT NULL,
    "language_id" TEXT NOT NULL,

    CONSTRAINT "movie_language_pkey" PRIMARY KEY ("movie_id","language_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "movie_title_key" ON "movie"("title");

-- CreateIndex
CREATE UNIQUE INDEX "movie_financial_movie_id_key" ON "movie_financial"("movie_id");

-- CreateIndex
CREATE UNIQUE INDEX "actor_full_name_key" ON "actor"("full_name");

-- CreateIndex
CREATE UNIQUE INDEX "director_full_name_key" ON "director"("full_name");

-- CreateIndex
CREATE UNIQUE INDEX "writer_full_name_key" ON "writer"("full_name");

-- CreateIndex
CREATE UNIQUE INDEX "company_name_key" ON "company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "country_name_key" ON "country"("name");

-- CreateIndex
CREATE UNIQUE INDEX "language_name_key" ON "language"("name");

-- AddForeignKey
ALTER TABLE "movie_financial" ADD CONSTRAINT "movie_financial_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_actor" ADD CONSTRAINT "movie_actor_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_actor" ADD CONSTRAINT "movie_actor_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "actor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_director" ADD CONSTRAINT "movie_director_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_director" ADD CONSTRAINT "movie_director_director_id_fkey" FOREIGN KEY ("director_id") REFERENCES "director"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_writer" ADD CONSTRAINT "movie_writer_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_writer" ADD CONSTRAINT "movie_writer_writer_id_fkey" FOREIGN KEY ("writer_id") REFERENCES "writer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_film" ADD CONSTRAINT "company_film_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_film" ADD CONSTRAINT "company_film_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_country" ADD CONSTRAINT "movie_country_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_country" ADD CONSTRAINT "movie_country_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_language" ADD CONSTRAINT "movie_language_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_language" ADD CONSTRAINT "movie_language_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
