import { Injectable } from '@nestjs/common';
import { Page } from 'puppeteer';

@Injectable()
export class FilmLocationsScrapeService {
  async scrapeFilmingLocations(page: Page): Promise<string | null> {
    await page.waitForSelector('[data-testid="title-details-filminglocations"]', { timeout: 15000 }).catch(() => null);
    return await page.$eval(
      '[data-testid="title-details-filminglocations"]',
      el => {
        const container = el.querySelector('.ipc-metadata-list-item__content-container');
        if (!container) return null;
        const a = container.querySelector('a');
        const text = a?.textContent?.trim();
        // В некоторых случаях может быть несколько ссылок, но если нужен только первый — этого достаточно
        return text && text !== "Filming locations" ? text : null;
      }
    ).catch(() => null);
  }
}