import { Injectable } from '@nestjs/common';
import { FilmScrapperService } from './services/film-scrapper.service';
import { DirectorScraperService } from './services/director-scrape.service';
import { ScrappedMovieType } from '../types/scrapped-movie.type';

@Injectable()
export class ScrapperService {
  constructor(
    private readonly filmScrapper: FilmScrapperService,
    private readonly directorScrapper: DirectorScraperService
  ) {}

  async getFilms(): Promise<ScrappedMovieType[]> {
    const films = await this.filmScrapper.scrapeTopFilms();

    for(const film of films){
      if(film.url){
        film.directors = await this.directorScrapper.scrapeDirectors(film.url);
      }
    }

    return films;
  }
}