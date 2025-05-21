import { Injectable } from '@nestjs/common';
import { FilmScrapperService } from './services/film-scrapper.service';
import { DirectorScraperService } from './services/director-scrape.service';
import { ScrappedMovieType } from '../types/scrapped-movie.type';
import { WritersScrapperService } from './services/writers-scrapper.service';
import pLimit from 'p-limit';
import { TopCastScrapperService } from './services/top-cast-scrapper.service';

@Injectable()
export class ScrapperService {
  constructor(
    private readonly filmScrapper: FilmScrapperService,
    private readonly directorScrapper: DirectorScraperService,
    private readonly writersScrapper: WritersScrapperService,
    private readonly topCastScrapper: TopCastScrapperService,
  ) {}

  async getFilms(): Promise<ScrappedMovieType[]> {
    const films = await this.filmScrapper.scrapeTopFilms();
    const limit = pLimit(5)

    await Promise.all(
      films.map(film =>
        limit(async () => {
          if (film.url) {
            const [directors, writers, topCast] = await Promise.all([
              this.directorScrapper.scrapeDirectors(film.url),
              this.writersScrapper.scrapeWriters(film.url),
              this.topCastScrapper.scrapeTopCast(film.url)
            ]);
            film.directors = directors;
            film.writers = writers;
            film.topCast = topCast;
          }
        })
      )
    );

    return films;
  }
}