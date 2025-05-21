import { Injectable } from '@nestjs/common';
import { PuppeteerService } from './puppeteer.service';
import {ScrappedWritersType} from '../../types/scrapped-writers.type';

@Injectable()
export class WritersScrapperService {
  constructor(private puppeteerService: PuppeteerService) {}

  async scrapeWriters(filmUrl: string): Promise<ScrappedWritersType[]> {
    const page = await this.puppeteerService.newPage();
    await page.goto(filmUrl, { waitUntil: 'networkidle0', timeout: 30_000 });

    await page.waitForSelector('li[data-testid="title-pc-principal-credit"]', { timeout: 15_000 }).catch(() => null);

    const writers = await page.$$eval(
      'li[data-testid="title-pc-principal-credit"]',
      (elements) => {
        for (const li of elements) {
          // 1. Ищем подпись Writer(s) в <span> или <a>
          const label = li.querySelector(
            '.ipc-metadata-list-item__label, .ipc-metadata-list-item__label--link, .ipc-metadata-list-item__label--btn'
          );
          if (
            label &&
            /writer/i.test(label.textContent || '')
          ) {
            // 2. Ищем все <a> внутри контент-контейнера (имена сценаристов)
            const container = li.querySelector('.ipc-metadata-list-item__content-container');
            if (!container) return [];
            return Array.from(
              container.querySelectorAll('a.ipc-metadata-list-item__list-content-item--link')
            ).map((a) => ({
              writers_name: a.textContent?.trim() ?? '',
            }));
          }
        }
        return [];
      }
    );

    await page.close();
    return writers;
  }
}