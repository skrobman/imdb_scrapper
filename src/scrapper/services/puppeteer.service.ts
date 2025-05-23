import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PuppeteerService implements OnModuleInit, OnModuleDestroy {
  private browser: puppeteer.Browser;

  async onModuleInit(){
    this.browser = await puppeteer.launch({
      headless: false,
      //executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      args: [
        '--lang=en-US',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled', // скрывает флаг автоматизации
        '--user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"',
      ]
    });
  }

  async newPage() {
    if(!this.browser) throw new Error('No browser found');

    const page = await this.browser.newPage();
    page.setDefaultTimeout(2 * 60 * 1000);

    return page;
  }

  async onModuleDestroy() {
    await this.browser.close();
  }
}