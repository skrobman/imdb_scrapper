import { Injectable } from '@nestjs/common';
import { ScrappedPeoplesType } from '../../../types/scrapped-peoples.type';
import { Page } from 'puppeteer';

@Injectable()
export class WritersScrapperService {
  async scrapeWriters(page: Page): Promise<ScrappedPeoplesType[]> {
    await page.waitForSelector('li[data-testid="title-pc-principal-credit"]', { timeout: 15_000 }).catch(() => null);

    return await page.$$eval(
      'li[data-testid="title-pc-principal-credit"]',
      (elements) => {
        for (const li of elements) {
          const label = li.querySelector(
            '.ipc-metadata-list-item__label, .ipc-metadata-list-item__label--link, .ipc-metadata-list-item__label--btn'
          );
          if (
            label &&
            /writer/i.test(label.textContent || '')
          ) {
            const container = li.querySelector('.ipc-metadata-list-item__content-container');
            if (!container) return [];
            return Array.from(
              container.querySelectorAll('a.ipc-metadata-list-item__list-content-item--link')
            ).map((a) => ({
              full_name: a.textContent?.trim() ?? '',
            }));
          }
        }
        return [];
      }
    );
  }
}