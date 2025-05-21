import { Injectable } from '@nestjs/common';
import { FilmScrapperService } from './services/film-scrapper.service';
import { DirectorScraperService } from './services/director-scrape.service';
import { ScrappedMovieType } from '../types/scrapped-movie.type';
import { GenreScrapperService } from './services/genre-scrapper.service';
import pLimit from 'p-limit';

@Injectable()
export class ScrapperService {
  constructor(
    private readonly filmScrapper: FilmScrapperService,
    private readonly directorScrapper: DirectorScraperService,
    private readonly genreScrapper: GenreScrapperService,
  ) {}

  async getFilms(): Promise<ScrappedMovieType[]> {
    const films = await this.filmScrapper.scrapeTopFilms();
    const limit = pLimit(5)

    await Promise.all(
      films.map(film =>
        limit(async () => {
          if (film.url) {
            const [directors, genres] = await Promise.all([
              this.directorScrapper.scrapeDirectors(film.url),
              this.genreScrapper.scrapeGenre(film.url)
            ]);
            film.directors = directors;
            film.genres = genres;
          }
        })
      )
    );

    return films;
  }
}