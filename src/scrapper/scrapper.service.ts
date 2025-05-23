import { Injectable } from '@nestjs/common';
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
import { BudgetScrapperService } from './services/BudgetScrapeService/budget-scrape.service';

@Injectable()
export class ScrapperService {
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
    private readonly budgetScrapper: BudgetScrapperService, // Add this line
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

              const [
                directors,
                writers,
                topCast,
                releaseInfo,
                languages,
                filmLocations,
                countriesOfOrigin,
                productionCompanies,
                financials, // Add financials to the Promise.all
              ] = await Promise.all([
                this.directorScrapper.scrapeDirectors(page),
                this.writersScrapper.scrapeWriters(page),
                this.topCastScrapper.scrapeTopCast(page),
                this.releaseDateService.scrapeReleaseDate(page),
                this.languagesService.scrapeLanguages(page),
                this.filmLocations.scrapeFilmingLocations(page),
                this.countriesService.scrapeCountries(page),
                this.productionsCompaniesService.scrapeProductionCompanies(page),
                this.budgetScrapper.scrapeFinancials(page), // Add this call
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
              film.financials = financials; // Assign scraped financials
            } catch (e) {
              film.directors = [];
              film.writers = [];
              film.topCast = [];
              film.releaseDate = null;
              film.releaseCountry = null;
              film.filmLocations = null;
              film.countriesOfOrigin = [];
              film.productionCompanies = [];
              film.financials = {
                budget: null,
                grossUSCanada: null,
                openingWeekendUSCanada: null,
                grossWorldwide: null,
              };
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