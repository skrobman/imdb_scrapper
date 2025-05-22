import { Injectable } from '@nestjs/common';
import { Page } from 'puppeteer';

@Injectable()
export class LanguagesScrapperService {
  async scrapeLanguages(page: Page): Promise<string[]> {
    await page.waitForSelector('[data-testid="title-details-languages"]', { timeout: 15000 }).catch(() => null);
    return await page.$eval(
      '[data-testid="title-details-languages"]',
      el => {
        const container = el.querySelector('.ipc-metadata-list-item__content-container');
        if (!container) return [];
        return Array.from(container.querySelectorAll('a'))
          .map(a => a.textContent?.trim())
          .filter((text): text is string => !!text && text !== "Languages"); // type guard
      }
    ).catch(() => []);
  }
}