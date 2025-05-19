import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { ConfigService } from '@nestjs/config';

type Director = { full_name: string };

type Film = {
  rank: number;
  title: string;
  year: number;
  runtime: number;
  filmRatingSystem: string;
  imdbRating: number;
  url: string | null;
  directors: Director[];
};

@Injectable()
export class ScrapperService {
  constructor(private readonly configService: ConfigService) {}

  async getFilms() {
    console.log('Connecting...');
    const browser = await puppeteer.launch({
      headless: false,
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      args: ['--lang=en-US']
    });
    console.log('Connected!');

    try {
      console.log('Opening new page...');
      const page = await browser.newPage();
      page.setDefaultTimeout(2 * 60 * 1000);

      await page.goto('https://www.imdb.com/chart/moviemeter/', {
        waitUntil: 'networkidle2',
        timeout: 30_000,
      });

      await page.waitForSelector('.ipc-metadata-list-summary-item', { timeout: 30_000 });

      console.log('Performing $$eval...');
      const items = await page.$$eval(
        '.ipc-metadata-list-summary-item',
        (items) => items.map(item => {

          const rankEl = item.querySelector('div[aria-label^="Ranking"]');
          if (!rankEl) return null;
          const label = rankEl.getAttribute('aria-label') || '';
          const rank = parseInt(label.replace('Ranking ', ''), 10);

          const titleEl = item.querySelector('.ipc-title__text') as HTMLHeadingElement | null;
          const linkEl = item.querySelector('a.ipc-title-link-wrapper') as HTMLAnchorElement | null;
          const href = linkEl?.href ?? null;

          const metaEl = item.querySelector('.cli-title-metadata') as HTMLDivElement | null;
          if (!metaEl) return null;

          const spanEls = Array.from(
            metaEl.querySelectorAll('.cli-title-metadata-item')
          ) as HTMLSpanElement[];
          if (spanEls.length < 3) return null;
          const yearText = spanEls[0].textContent?.trim() ?? '';
          const runtimeText = spanEls[1].textContent?.trim() ?? '';
          const ratingText = spanEls[2].textContent?.trim() ?? '';

          const year = parseInt(yearText, 10) || 0;

          let runTimeMinutes = 0;
          const hoursMatch = runtimeText.match(/(\d+)\s*h/);
          const minutesMatch  = runtimeText.match(/(\d+)\s*m/);

          if(hoursMatch) runTimeMinutes += parseInt(hoursMatch[1], 10) * 60;
          if(minutesMatch) runTimeMinutes += parseInt(minutesMatch[1], 10);

          const filmRatingSystem = ratingText;

          const imdbRatingEl = item.querySelector('span.ipc-rating-star--rating') as HTMLSpanElement | null;
          if (!imdbRatingEl) return null;
          const imdbRating = parseFloat(imdbRatingEl.textContent?.trim() ?? '0');

          return {
            rank: rank,
            title: titleEl?.textContent?.trim() ?? '',
            year: year,
            runtime: runTimeMinutes,
            filmRatingSystem: filmRatingSystem,
            imdbRating: imdbRating,
            url: href,
            directors: [] as Director[]
          };
        }).filter(r => r !== null)
      ) as Film[];

      for (const film of items) {
        if (film.url) {
          try {
            const filmPage = await browser.newPage();
            await filmPage.goto(film.url, { waitUntil: 'domcontentloaded', timeout: 30_000 });

            await filmPage.waitForSelector('li[data-testid="title-pc-principal-credit"]:nth-child(1)', { timeout: 15_000 }).catch(() => null);

            const directors = await filmPage.$$eval('li[data-testid="title-pc-principal-credit"]:nth-child(1) a', els =>
              els.map(el => ({ full_name: el.textContent?.trim() ?? '' }))
            );

            film.directors = directors.filter(
              (d, i, arr) => arr.findIndex(dd => dd.full_name === d.full_name) === i
            );

            await filmPage.close();
          } catch (e) {
            film.directors = [];
          }
        } else {
          film.directors = [];
        }
      }

      console.log(`Scrapped films: ${JSON.stringify(items, null, 2)}`);
      return items;

    } catch (error) {
      console.error(`Scraping failed: ${error}`);
    } finally {
      await browser.close();
    }
  }
}