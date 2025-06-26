import { Injectable } from '@nestjs/common';
import { Page } from 'puppeteer';

@Injectable()
export class GenresService {
  async scrapeGenres(page: Page): Promise<string[]> {
    const containerSelector = 'li[data-testid="storyline-genres"] .ipc-metadata-list-item__content-container';
    const found = await page.waitForSelector(containerSelector, { timeout: 10000 }).catch(() => null);

    if (!found) {
      console.log('Genre not found');
      return [];
    }
    return await page.$$eval(
      `${containerSelector} a`,
      elements =>
        elements
          .map(el => el.textContent?.trim())
          .filter((text): text is string => !!text)
    ).catch(() => []);
  }
}