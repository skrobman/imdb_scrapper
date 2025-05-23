import { Injectable } from '@nestjs/common';
import { Page } from 'puppeteer';

@Injectable()
export class CountriesScrapperService {
  async scrapeCountries(page: Page): Promise<string[]> {
    await page.waitForSelector('[data-testid="title-details-origin"]', { timeout: 15000 }).catch(() => null);
    return await page.$eval(
      '[data-testid="title-details-origin"]',
      el => {
        const container = el.querySelector('.ipc-metadata-list-item__content-container');
        if (!container) return [];
        return Array.from(container.querySelectorAll('a'))
          .map(a => a.textContent?.trim())
          .filter((text): text is string => !!text && text !== "Country of origin" && text !== "Countries of origin");
      }
    ).catch(() => []);
  }
}