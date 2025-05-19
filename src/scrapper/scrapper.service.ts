import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer-core';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ScrapperService {
    constructor(private readonly configService: ConfigService) {}

    async getFilms() {

        //Connect to remote Chrome
        console.log('Connecting...');
        const browser = await puppeteer.launch({
            headless: false,
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            // browserWSEndpoint: this.configService.get<string>('CHROME_URL'),
        });
        console.log('Connected!');

        try {
            /**
             * Open new Page
             * Set Max Timeout to 2 minutes
             **/
            console.log('Opening new page...');
            const page = await browser.newPage();
            page.setDefaultTimeout(2 * 60 * 1000);

            //Go to top 100 films on imdb page
            await page.goto('https://www.imdb.com/chart/moviemeter/', {
                waitUntil: 'networkidle2',
                timeout: 30_000, // Maximum time to wait
            });

            await page.waitForSelector('.ipc-metadata-list-summary-item', { timeout: 30_000 });

            console.log('Performing $$eval...');
            const items = await page.$$eval(
                '.ipc-metadata-list-summary-item',
                (items) => items.map(item => {

                    //Extract Rank
                    const rankEl = item.querySelector('div[aria-label^="Ranking"]');
                    if (!rankEl) return null;
                    const label = rankEl.getAttribute('aria-label') || '';
                    const rank = parseInt(label.replace('Ranking ', ''), 10);

                    //Extract Title
                    const titleEl = item.querySelector<HTMLHeadingElement>('.ipc-title__text');

                    //Find div with meta data
                    const metaEl = item.querySelector<HTMLDivElement>('.cli-title-metadata');
                    if (!metaEl) return null;

                    const spanEls = Array.from(
                        metaEl.querySelectorAll<HTMLSpanElement>('.cli-title-metadata-item')
                    );
                    if (spanEls.length < 3) return null;
                    const yearText = spanEls[0].textContent?.trim() ?? '';
                    const runtimeText = spanEls[1].textContent?.trim() ?? '';
                    const ratingText = spanEls[2].textContent?.trim() ?? '';

                    //Extract Year
                    const year = parseInt(yearText, 10) || 0;

                    //Extract Runtime(Minutes)
                    let runTimeMinutes = 0;
                    const hoursMatch = runtimeText.match(/(\d+)\s*h/);
                    const minutesMatch  = runtimeText.match(/(\d+)\s*m/);

                    if(hoursMatch) runTimeMinutes += parseInt(hoursMatch[1], 10) * 60;
                    if(minutesMatch) runTimeMinutes += parseInt(minutesMatch[1], 10);

                    //Extract Film Rating System
                    const filmRatingSystem = ratingText;

                    //Extract Imdb Rating
                    const imdbRatingEl = item.querySelector<HTMLSpanElement>('span.ipc-rating-star--rating');
                    if (!imdbRatingEl) return null;
                    const imdbRating = parseFloat(imdbRatingEl.textContent?.trim() ?? '0');

                    return {
                        rank: rank,
                        title: titleEl?.textContent?.trim() ?? '',
                        year: year,
                        runtime: runTimeMinutes,
                        filmRatingSystem: filmRatingSystem,
                        imdbRating: imdbRating
                    }
                }).filter(r => r !== null)
            )

            console.log(`Scrapped films: ${items}`);
            return items;

        } catch (error) {
            console.error(`Scraping failed: ${error}`);
        } finally {
            await browser.close();
        }
    }
}