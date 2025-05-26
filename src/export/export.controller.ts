import { Controller, Get, Header, Res, StreamableFile } from '@nestjs/common';
import { ExportService } from './export.service';

@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('json')
  @Header('Content-Disposition', 'attachment; filename="films.json"')
  @Header('Content-Type', 'application/json')
  async downloadJson() {
    const films = await this.exportService.getCachedFilms();
    return JSON.stringify(films, null, 2);
  }

  @Get('csv')
  @Header('Content-Disposition', 'attachment; filename="films.csv"')
  @Header('Content-Type', 'text/csv')
  async downloadCSV(@Res({ passthrough: true }) res: Response): Promise<StreamableFile> {
    const csvString = await this.exportService.downloadCsv();

    const buffer = Buffer.from(csvString, 'utf-8');

    return new StreamableFile(buffer);
  }
}
