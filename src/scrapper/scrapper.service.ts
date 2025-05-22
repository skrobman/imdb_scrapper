import { Injectable } from '@nestjs/common';
import { FilmScrapperService } from './services/FilmScrapeService/film-scrapper.service';
import { DirectorScraperService } from './services/DirectorScrapeService/director-scrape.service';
import { ScrappedMovieType } from '../types/scrapped-movie.type';
import { WritersScrapperService } from './services/WritersScrapeService/writers-scrapper.service';
import pLimit from 'p-limit';
import { TopCastScrapperService } from './services/TopCastScrapeService/top-cast-scrapper.service';
import { PuppeteerService } from './services/puppeteer.service';
import { Page } from 'puppeteer';
import { ReleaseDateScrapperService } from './services/DateReleaseScrapper/release-date-scrapper.service';

@Injectable()
export class ScrapperService {
  constructor(
    private readonly filmScrapper: FilmScrapperService,
    private readonly directorScrapper: DirectorScraperService,
    private readonly writersScrapper: WritersScrapperService,
    private readonly topCastScrapper: TopCastScrapperService,
    private readonly puppeteerService: PuppeteerService,
    private readonly releaseDateService: ReleaseDateScrapperService,
  ) {}

  async getFilms(): Promise<ScrappedMovieType[]> {
    const films = await this.filmScrapper.scrapeTopFilms();
    const limit = pLimit(5);

    await Promise.all(
      films.map((film) =>
        limit(async () => {
          if (film.url) {
            const page: Page = await this.puppeteerService.newPage();
            try {
              await page.goto(film.url, { waitUntil: 'networkidle0', timeout: 30_000 });

              const [directors, writers, topCast, releaseInfo] = await Promise.all([
                this.directorScrapper.scrapeDirectors(page),
                this.writersScrapper.scrapeWriters(page),
                this.topCastScrapper.scrapeTopCast(page),
                this.releaseDateService.scrapeReleaseDate(page),
              ]);
              film.directors = directors;
              film.writers = writers;
              film.topCast = topCast;
              film.releaseDate = releaseInfo.date;
              film.releaseCountry = releaseInfo.country;
            } catch (e) {
              film.directors = [];
              film.writers = [];
              film.topCast = [];
              film.releaseDate = null;
              film.releaseCountry = null;
            } finally {
              await page.close();
            }
          }
        }),
      ),
    );

    return films;
  }
}