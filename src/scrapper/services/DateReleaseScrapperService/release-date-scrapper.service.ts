import { Injectable } from '@nestjs/common';
import { Page } from 'puppeteer';

@Injectable()
export class ReleaseDateScrapperService {
  async scrapeReleaseDate(page: Page): Promise<{ date: string | null, country: string | null }> {
    await page.waitForSelector('[data-testid="title-details-releasedate"]', { timeout: 15000 }).catch(() => null);
    return await page.$eval(
      '[data-testid="title-details-releasedate"]',
      el => {
        const contentContainer = el.querySelector('.ipc-metadata-list-item__content-container');
        if (!contentContainer) return { date: null, country: null };

        const dateAnchor = contentContainer.querySelector('a');
        if (!dateAnchor) return { date: null, country: null };

        const raw = dateAnchor.textContent?.trim() ?? '';

        const dateMatch = raw.match(/^(.+?)\s+\(/);
        const countryMatch = raw.match(/\(([^)]+)\)/);

        return {
          date: dateMatch ? dateMatch[1].trim() : raw,
          country: countryMatch ? countryMatch[1].trim() : null
        };
      }
    ).catch(() => ({ date: null, country: null }));
  }
}