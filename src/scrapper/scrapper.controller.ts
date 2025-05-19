import {Controller, Get} from '@nestjs/common';
import {ScrapperService} from "./scrapper.service";

@Controller('scrapper')
export class ScrapperController {
    constructor(private readonly scrapperService: ScrapperService) {}

    @Get('scrapped-films')
    getFilms() {
        return this.scrapperService.getFilms();
    }
}
