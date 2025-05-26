import { Inject, Injectable } from '@nestjs/common';
import { FilmScrapperService } from './services/FilmScrapeService/film-scrapper.service';
import { DirectorScraperService } from './services/DirectorScrapeService/director-scrape.service';
import { ScrappedMovieType } from '../types/scrapped-movie.type';
import { WritersScrapperService } from './services/WritersScrapeService/writers-scrapper.service';
import pLimit from 'p-limit';
import { TopCastScrapperService } from './services/TopCastScrapeService/top-cast-scrapper.service';
import { PuppeteerService } from './services/puppeteer.service';
import { Page } from 'puppeteer';
import { LanguagesScrapperService } from './services/LanguagesScrapeService/languages-scrape.service';
import { FilmLocationsScrapeService } from './services/FilmLocationsScrapeService/film-locations-scrape.service';
import { ReleaseDateScrapperService } from './services/DateReleaseScrapperService/release-date-scrapper.service';
import { CountriesScrapperService } from './services/CountriesOfOriginScrapeService/countries-of-origin-scrape.service';
import {
  ProductionCompaniesScrapperService
} from './services/ProductionCompaniesScrapperService/production-companies-scrapper.service';
import Redis from 'ioredis';
import { BudgetScrapperService } from './services/BudgetScrapeService/budget-scrape.service';

@Injectable()
export class ScrapperService {
  private readonly CACHE_KEY = 'scrapped-films';
  private readonly CACHE_TTL = 600;

  constructor(
    private readonly filmScrapper: FilmScrapperService,
    private readonly directorScrapper: DirectorScraperService,
    private readonly writersScrapper: WritersScrapperService,
    private readonly topCastScrapper: TopCastScrapperService,
    private readonly puppeteerService: PuppeteerService,
    private readonly releaseDateService: ReleaseDateScrapperService,
    private readonly languagesService: LanguagesScrapperService,
    private readonly filmLocations: FilmLocationsScrapeService,
    private readonly countriesService: CountriesScrapperService,
    private readonly productionsCompaniesService: ProductionCompaniesScrapperService,
    private readonly budgetScrapper: BudgetScrapperService,

    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis,
  ) {}

  async getFilms(): Promise<ScrappedMovieType[]> {
    const cached = await this.redisClient.get(this.CACHE_KEY);
    if (cached) {
      return JSON.parse(cached) as ScrappedMovieType[];
    }

    const films = await this.filmScrapper.scrapeTopFilms();
    const limit = pLimit(5);

    await Promise.all(
      films.map((film) =>
        limit(async () => {
          if (film.url) {
            const page: Page = await this.puppeteerService.newPage();
            try {
              await page.goto(film.url, { waitUntil: 'networkidle0', timeout: 30_000 });

              const [
                directors,
                writers,
                topCast,
                releaseInfo,
                languages,
                filmLocations,
                countriesOfOrigin,
                productionCompanies,
                budget,
                grossUSCanada,
                openingWeekendUSCanada,
                grossWorldwide,
              ] = await Promise.all([
                this.directorScrapper.scrapeDirectors(page),
                this.writersScrapper.scrapeWriters(page),
                this.topCastScrapper.scrapeTopCast(page),
                this.releaseDateService.scrapeReleaseDate(page),
                this.languagesService.scrapeLanguages(page),
                this.filmLocations.scrapeFilmingLocations(page),
                this.countriesService.scrapeCountries(page),
                this.productionsCompaniesService.scrapeProductionCompanies(page),
                this.budgetScrapper.scrapeBudget(page),
                this.budgetScrapper.scrapeGrossUSCanada(page),
                this.budgetScrapper.scrapeOpeningWeekendUSCanada(page),
                this.budgetScrapper.scrapeGrossWorldwide(page),
              ]);

              film.directors = directors;
              film.writers = writers;
              film.topCast = topCast;
              film.releaseDate = releaseInfo.date;
              film.releaseCountry = releaseInfo.country;
              film.languages = languages;
              film.filmLocations = filmLocations;
              film.countriesOfOrigin = countriesOfOrigin;
              film.productionCompanies = productionCompanies;
              film.budget = budget;
              film.grossUSCanada = grossUSCanada;
              film.openingWeekendUSCanada = openingWeekendUSCanada;
              film.grossWorldwide = grossWorldwide;
            } catch (e) {
              film.directors = [];
              film.writers = [];
              film.topCast = [];
              film.releaseDate = null;
              film.releaseCountry = null;
              film.filmLocations = null;
              film.countriesOfOrigin = [];
              film.productionCompanies = [];
              film.budget = null;
              film.grossUSCanada = null;
              film.openingWeekendUSCanada = null;
              film.grossWorldwide = null;
            } finally {
              await page.close();
            }
          }
        }),
      ),
    );

    await this.redisClient.set(
      this.CACHE_KEY,
      JSON.stringify(films),
      'EX',
      this.CACHE_TTL,
    );

    return films;
  }
}