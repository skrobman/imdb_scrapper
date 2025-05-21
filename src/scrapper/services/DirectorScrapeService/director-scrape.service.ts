import { Injectable } from '@nestjs/common';
import { PuppeteerService } from '../puppeteer.service';
import { ScrappedDirectorType } from '../../../types/scrapped-director.type';
import { Selectors } from '../../utils/selectors';
import { Page } from 'puppeteer';

@Injectable()
export class DirectorScraperService{
  constructor(private puppeteerService: PuppeteerService) {}

  async scrapeDirectors(page: Page): Promise<ScrappedDirectorType[]> {

    await page.waitForSelector(Selectors.directorList, { timeout: 15_000 }).catch(() => null);

    const directors = await page.$$eval(Selectors.directorList, elements =>
      elements.map(element => ({ director_name: element.textContent?.trim() ?? '' })),
    );

    //Delete Duplicates
    return directors.filter((d, i, arr) =>
      arr.findIndex(x => x.director_name === d.director_name) === i,
    );
  }
}