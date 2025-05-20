import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PuppeteerService implements OnModuleInit, OnModuleDestroy {
  private browser: puppeteer.Browser;

  async onModuleInit(){
    this.browser = await puppeteer.launch({
      headless: false,
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      args: ['--lang=en-US']
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