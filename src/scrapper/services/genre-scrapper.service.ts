import { Injectable } from '@nestjs/common';
import { PuppeteerService } from './puppeteer.service';
import { ScrappedGenreType } from '../../types/scrapped-genre.type';

@Injectable()
export class GenreScrapperService {
  constructor(private puppeteerService: PuppeteerService) {}

  async scrapeGenre(filmUrl: string): Promise<ScrappedGenreType[]>{
    const page = await this.puppeteerService.newPage();
    await page.goto(filmUrl, { waitUntil: 'networkidle0', timeout: 30_000 });

    await page.waitForSelector('li[data-testid="storyline-genres"] a', { timeout: 15_000 }).catch(() => null);

    const genres = await page.$$eval('li[data-testid="storyline-genres"] a', elements =>
      elements.map(element => ({ genre_name: element.textContent?.trim() ?? '' })),
    );
    await page.close();

    // Для отладки:
    console.log('Genres found:', genres);

    return genres;
  }
}