import { Injectable } from '@nestjs/common';
import { Page } from 'puppeteer';

export type Financials = {
  budget: number | null;
  grossUSCanada: number | null;
  openingWeekendUSCanada: number | null;
  grossWorldwide: number | null;
};

@Injectable()
export class BudgetScrapperService {
  async scrapeFinancials(page: Page): Promise<Financials> {
    await page.waitForSelector('[data-testid="title-boxoffice-section"]', { timeout: 15000 })
      .catch(() => null);

    return await page.$$eval(
      '[data-testid="title-boxoffice-section"] .ipc-metadata-list__item',
      (items) => {
        const res: Financials = {
          budget: null,
          grossUSCanada: null,
          openingWeekendUSCanada: null,
          grossWorldwide: null,
        };

        const extractNumber = (text: string): number | null => {
          const match = text.match(/[\d,]+/);
          if (!match) return null;
          const digitsOnly = match[0].replace(/,/g, '');
          return digitsOnly ? parseInt(digitsOnly, 10) : null;
        };

        for (const item of items) {
          const label = item
            .querySelector('.ipc-metadata-list-item__label')
            ?.textContent
            ?.trim() || '';
          const value = item
            .querySelector(
              '.ipc-metadata-list-item__list-content-item, .ipc-metadata-list-item__content-container'
            )
            ?.textContent
            ?.trim() || '';

          if (/Budget/i.test(label)) {
            res.budget = extractNumber(value);
          } else if (/Gross US & Canada/i.test(label)) {
            res.grossUSCanada = extractNumber(value);
          } else if (/Opening weekend US & Canada/i.test(label)) {
            res.openingWeekendUSCanada = extractNumber(value);
          } else if (/Gross worldwide/i.test(label)) {
            res.grossWorldwide = extractNumber(value);
          }
        }
        return res;
      }
    ).catch(() => ({
      budget: null,
      grossUSCanada: null,
      openingWeekendUSCanada: null,
      grossWorldwide: null,
    }));
  }
}
