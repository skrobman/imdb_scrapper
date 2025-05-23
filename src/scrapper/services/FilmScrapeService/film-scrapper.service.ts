import { Injectable } from '@nestjs/common';
import { PuppeteerService } from '../puppeteer.service';
import { ScrappedMovieType } from '../../../types/scrapped-movie.type';
import { Selectors } from '../../utils/selectors';

@Injectable()
export class FilmScrapperService {
  constructor(private puppeteerService: PuppeteerService) {}

  async scrapeTopFilms(): Promise<ScrappedMovieType[]> {
    const page = await this.puppeteerService.newPage();

    //await page.setUserAgent(
      //'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
      //'AppleWebKit/537.36 (KHTML, like Gecko) ' +
      //'Chrome/114.0.0.0 Safari/537.36'
    //);

    await page.goto('https://www.imdb.com/chart/moviemeter/', {
      waitUntil: 'networkidle2',
      timeout: 30_000,
    });

    await page.waitForSelector(Selectors.filmListItem)

    const films = await page.$$eval(
      Selectors.filmListItem,
      (items, selectors) =>
        items
          .map(item => {

            //Parse Rank
            const rankEl = item.querySelector(selectors.rank);
            if (!rankEl) return null;
            const label = rankEl.getAttribute('aria-label') || '';
            const rank = parseInt(label.replace('Ranking ', ''), 10);

            //Parse Title
            const titleEl = item.querySelector(selectors.titleText);
            const urlEl   = item.querySelector<HTMLAnchorElement>(selectors.titleLink);

            //Parse Metadata(year, runtime, film rating system)
            const metaEls = Array.from(
              item.querySelectorAll<HTMLSpanElement>(selectors.metadataItem)
            );
            if (metaEls.length < 3) return null;

            // Parse Year
            const yearText = metaEls[0].textContent!.trim();
            const year = parseInt(yearText, 10) || 0;

            // Parse Runtime and convert to minutes
            const rt = metaEls[1].textContent!.trim();
            let runtime = 0;
            const hMatch = rt.match(/(\d+)\s*h/);
            const mMatch = rt.match(/(\d+)\s*m/);
            if (hMatch) runtime += +hMatch[1] * 60;
            if (mMatch) runtime += +mMatch[1];

            // Parse Rating
            const ratingText = item.querySelector<HTMLSpanElement>(selectors.imdbRating)
              ?.textContent?.trim() ?? '';
            const imdbRating = parseFloat(ratingText) || 0;

            return {
              rank,
              title: titleEl?.textContent?.trim() ?? '',
              url:   urlEl?.href ?? null,
              year,
              runtime,
              filmRatingSystem: metaEls[2].textContent!.trim(),
              imdbRating,
              directors: [],
              writers: [],
              topCast: [],
              // genres: []
              releaseDate: null,
              releaseCountry: null,
              languages: [],
              filmLocations: null,
            };
          })
          .filter(Boolean),
      Selectors
    ) as ScrappedMovieType[];

    await page.close();
    return films;
  }
}