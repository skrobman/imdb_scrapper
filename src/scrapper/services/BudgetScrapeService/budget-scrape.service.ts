import { Injectable } from '@nestjs/common';
import { Page } from 'puppeteer';

@Injectable()
export class BudgetScrapperService {
  async scrapeBudget(page: Page): Promise<number | null> {
    await page.waitForSelector('[data-testid="title-boxoffice-section"]', { timeout: 15000 }).catch(() => null);

    return page.$$eval(
      '[data-testid="title-boxoffice-section"] .ipc-metadata-list__item',
      (items) => {
        const extractNumber = (text: string): number | null => {
          const match = text.match(/[\d,]+/);
          if (!match) return null;
          return parseInt(match[0].replace(/,/g, ''), 10);
        };

        for (const item of items as HTMLElement[]) {
          const label = item.querySelector('.ipc-metadata-list-item__label')?.textContent?.trim() || '';
          const value = item.querySelector('.ipc-metadata-list-item__list-content-item, .ipc-metadata-list-item__content-container')?.textContent?.trim() || '';
          if (/Budget/i.test(label)) {
            return extractNumber(value);
          }
        }
        return null;
      }
    ).catch(() => null);
  }

  async scrapeGrossUSCanada(page: Page): Promise<number | null> {
    await page.waitForSelector('[data-testid="title-boxoffice-section"]', { timeout: 15000 }).catch(() => null);

    return page.$$eval(
      '[data-testid="title-boxoffice-section"] .ipc-metadata-list__item',
      (items) => {
        const extractNumber = (text: string): number | null => {
          const match = text.match(/[\d,]+/);
          if (!match) return null;
          return parseInt(match[0].replace(/,/g, ''), 10);
        };

        for (const item of items as HTMLElement[]) {
          const label = item.querySelector('.ipc-metadata-list-item__label')?.textContent?.trim() || '';
          const value = item.querySelector('.ipc-metadata-list-item__list-content-item, .ipc-metadata-list-item__content-container')?.textContent?.trim() || '';
          if (/Gross US & Canada/i.test(label)) {
            return extractNumber(value);
          }
        }
        return null;
      }
    ).catch(() => null);
  }

  async scrapeOpeningWeekendUSCanada(page: Page): Promise<number | null> {
    await page.waitForSelector('[data-testid="title-boxoffice-section"]', { timeout: 15000 }).catch(() => null);

    return page.$$eval(
      '[data-testid="title-boxoffice-section"] .ipc-metadata-list__item',
      (items) => {
        const extractNumber = (text: string): number | null => {
          const match = text.match(/[\d,]+/);
          if (!match) return null;
          return parseInt(match[0].replace(/,/g, ''), 10);
        };

        for (const item of items as HTMLElement[]) {
          const label = item.querySelector('.ipc-metadata-list-item__label')?.textContent?.trim() || '';
          const value = item.querySelector('.ipc-metadata-list-item__list-content-item, .ipc-metadata-list-item__content-container')?.textContent?.trim() || '';
          if (/Opening weekend US & Canada/i.test(label)) {
            return extractNumber(value);
          }
        }
        return null;
      }
    ).catch(() => null);
  }

  async scrapeGrossWorldwide(page: Page): Promise<number | null> {
    await page.waitForSelector('[data-testid="title-boxoffice-section"]', { timeout: 15000 }).catch(() => null);

    return page.$$eval(
      '[data-testid="title-boxoffice-section"] .ipc-metadata-list__item',
      (items) => {
        const extractNumber = (text: string): number | null => {
          const match = text.match(/[\d,]+/);
          if (!match) return null;
          return parseInt(match[0].replace(/,/g, ''), 10);
        };

        for (const item of items as HTMLElement[]) {
          const label = item.querySelector('.ipc-metadata-list-item__label')?.textContent?.trim() || '';
          const value = item.querySelector('.ipc-metadata-list-item__list-content-item, .ipc-metadata-list-item__content-container')?.textContent?.trim() || '';
          if (/Gross worldwide/i.test(label)) {
            return extractNumber(value);
          }
        }
        return null;
      }
    ).catch(() => null);
  }
}