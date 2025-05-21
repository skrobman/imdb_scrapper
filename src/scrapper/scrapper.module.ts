import { Module } from '@nestjs/common';
import { ScrapperService } from './scrapper.service';
import { ScrapperController } from './scrapper.controller';
import { PuppeteerService } from './services/puppeteer.service';
import { FilmScrapperService } from './services/film-scrapper.service';
import { DirectorScraperService } from './services/director-scrape.service';
import { WritersScrapperService } from './services/writers-scrapper.service';
import { TopCastScrapperService } from './services/top-cast-scrapper.service';

@Module({
  providers: [
    PuppeteerService,
    FilmScrapperService,
    DirectorScraperService,
    WritersScrapperService,
    TopCastScrapperService,
    ScrapperService,
  ],
  controllers: [ScrapperController],
  exports: [ScrapperService]
})
export class ScrapperModule {}
