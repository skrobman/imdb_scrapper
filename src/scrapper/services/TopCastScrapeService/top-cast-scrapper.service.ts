import { Injectable } from '@nestjs/common';
import { PuppeteerService } from '../puppeteer.service';
import { ScrappedPeoplesType } from '../../../types/scrapped-peoples.type';
import { Page } from 'puppeteer';

@Injectable()
export class TopCastScrapperService {
  constructor(private puppeteerService: PuppeteerService) {}

  async scrapeTopCast(page: Page): Promise<ScrappedPeoplesType[]> {

    // Ждём появления любого элемента топ-каста (div внутри секции)
    const hasCastSection = await page.$('section[data-testid="title-cast"]');
    if (!hasCastSection) {
      await page.close();
      return [];
    }

    // Парсим имена актёров из div'ов с data-testid="title-cast-item"
    return await page.$$eval(
      'section[data-testid="title-cast"] [data-testid="title-cast-item"]',
      (items) =>
        items
          .map((div) => {
            const actorLink = div.querySelector('[data-testid="title-cast-item__actor"]');
            return {
              full_name: actorLink?.textContent?.trim() ?? '',
            };
          })
          .filter((actor) => actor.full_name)
    );
  }
}