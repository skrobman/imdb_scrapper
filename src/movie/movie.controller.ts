import { Controller, Post } from '@nestjs/common';
import { MovieService } from './movie.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Save to database')
@Controller('movies')
export class MoviesController {
  constructor(private readonly movieService: MovieService) {}

  @ApiOperation({ summary: 'Save scrapped data to database' })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error — что-то пошло не так на сервере',
    schema: {
      example: {
        statusCode: 500,
        message: 'Unexpected error',
        error: 'Internal Server Error',
      },
    },
  })
  @Post('import-all-from-cache')
  async importAllFromCache() {
    return this.movieService.saveMoviesFromCache();
  }
}