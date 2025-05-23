import { Injectable } from '@nestjs/common';
import { Page } from 'puppeteer';

export type Financials = {
  budget: string | null;
  grossUSCanada: string | null;
  openingWeekendUSCanada: string | null;
  grossWorldwide: string | null;
};

@Injectable()
export class BudgetScrapperService {
  async scrapeFinancials(page: Page): Promise<Financials> {
    await page.waitForSelector('[data-testid="title-boxoffice-section"]', { timeout: 15000 }).catch(() => null);

    return await page.$$eval(
      '[data-testid="title-boxoffice-section"] .ipc-metadata-list__item',
      (items) => {
        // Создаём результат с null по умолчанию
        const res: Financials = {
          budget: null,
          grossUSCanada: null,
          openingWeekendUSCanada: null,
          grossWorldwide: null,
        };

        for (const item of items) {
          const label = item.querySelector('.ipc-metadata-list-item__label')?.textContent?.trim() || '';
          const value = item.querySelector('.ipc-metadata-list-item__list-content-item, .ipc-metadata-list-item__content-container')?.textContent?.trim() || '';

          if (/Budget/i.test(label)) res.budget = value || null;
          else if (/Gross US & Canada/i.test(label)) res.grossUSCanada = value || null;
          else if (/Opening weekend US & Canada/i.test(label)) res.openingWeekendUSCanada = value || null;
          else if (/Gross worldwide/i.test(label)) res.grossWorldwide = value || null;
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