import { Injectable } from '@nestjs/common';
import { PuppeteerService } from './puppeteer.service';
import { ScrappedDirectorType } from '../../types/scrapped-director.type';
import { Selectors } from '../utils/selectors';

@Injectable()
export class DirectorScraperService{
  constructor(private puppeteerService: PuppeteerService) {}

  async scrapeDirectors(filmUrl: string): Promise<ScrappedDirectorType[]> {
    const page = await this.puppeteerService.newPage();
    await page.goto(filmUrl, { waitUntil: 'domcontentloaded' });

    await page.waitForSelector(Selectors.directorList, { timeout: 15_000 }).catch(() => null);

    const directors = await page.$$eval(Selectors.directorList, elements =>
      elements.map(element => ({ director_name: element.textContent?.trim() ?? '' })),
    );
    await page.close();

    //Delete Duplicates
    return directors.filter((d, i, arr) =>
      arr.findIndex(x => x.director_name === d.director_name) === i,
    );
  }
}