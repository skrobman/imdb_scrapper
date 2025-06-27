import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ConfigService} from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT');

  const config = new DocumentBuilder()
    .setTitle('Imdb top 250 moive scraper')
    .setDescription('This scraper is designed to automatically collect detailed information about movies from IMDb. It processes approximately 250 films and extracts the following data for each movie:\n' +
      '\n' +
      '1. Basic Movie Information\n' +
      'Title (title)\n' +
      '\n' +
      'Release Year (year)\n' +
      '\n' +
      'Runtime in minutes (runtime)\n' +
      '\n' +
      'Film Rating System (e.g., R, PG-13)\n' +
      '\n' +
      'IMDb Rating (imdbRating)\n' +
      '\n' +
      'IMDb URL (url)\n' +
      '\n' +
      '2. Creative Team\n' +
      'Directors (list, each with their name)\n' +
      '\n' +
      'Writers (list, each with their full name)\n' +
      '\n' +
      '3. Main Cast\n' +
      'Top Cast (list, each with their full name)\n' +
      '\n' +
      '4. Release Details\n' +
      'Release Date (releaseDate)\n' +
      '\n' +
      'Release Country (releaseCountry)\n' +
      '\n' +
      '5. Languages and Production Countries\n' +
      'Languages (list)\n' +
      '\n' +
      'Countries of Origin (list)\n' +
      '\n' +
      '6. Filming Locations\n' +
      'Filming Locations (e.g., specific sites, cities, countries)\n' +
      '\n' +
      '7. Production Companies\n' +
      'Production Companies (list)\n' +
      '\n' +
      '8. Financial Information\n' +
      'Budget (in USD)\n' +
      '\n' +
      'Gross US/Canada (grossUSCanada)\n' +
      '\n' +
      'Opening Weekend US/Canada (openingWeekendUSCanada)\n' +
      '\n' +
      'Worldwide Gross (grossWorldwide)')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT || 3000);
}
bootstrap();
