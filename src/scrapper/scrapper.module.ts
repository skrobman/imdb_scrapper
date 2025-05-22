import { Module } from '@nestjs/common';
import { ScrapperService } from './scrapper.service';
import { ScrapperController } from './scrapper.controller';
import { PuppeteerService } from './services/puppeteer.service';
import { FilmScrapperService } from './services/FilmScrapeService/film-scrapper.service';
import { DirectorScraperService } from './services/DirectorScrapeService/director-scrape.service';
import { WritersScrapperService } from './services/WritersScrapeService/writers-scrapper.service';
import { TopCastScrapperService } from './services/TopCastScrapeService/top-cast-scrapper.service';
import { ReleaseDateScrapperService } from './services/DateReleaseScrapper/release-date-scrapper.service';
import { LanguagesScrapperService } from './services/LanguagesScrapeService/languages-scrape.service';

@Module({
  providers: [
    PuppeteerService,
    FilmScrapperService,
    DirectorScraperService,
    WritersScrapperService,
    TopCastScrapperService,
    ReleaseDateScrapperService,
    LanguagesScrapperService,
    ScrapperService,
  ],
  controllers: [ScrapperController],
  exports: [ScrapperService]
})
export class ScrapperModule {}
