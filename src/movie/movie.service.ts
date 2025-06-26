import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MovieCacheDto } from './dto/movie.dto';
import { mapMovieCacheDtoToPrismaData } from './dto/map-movie.dto';
import Redis from 'ioredis';

@Injectable()
export class MovieService {
  constructor(
    private prisma: PrismaService,
    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis,
  ) {}

  async saveMoviesFromCache() {
    const raw = await this.redisClient.get('scrapped-films');
    if (!raw) throw new Error('No movie data found in cache.');

    const parsed: MovieCacheDto[] = JSON.parse(raw);

    for (const movieDto of parsed) {
      const data = mapMovieCacheDtoToPrismaData(movieDto);
      const { financial, languages, countries, companies, actors, directors, writers, ...movieData } = data;

      // Check does film exist
      const existing = await this.prisma.movie.findUnique({
        where: { title: data.title },
        select: { id: true }
      });

      if (!existing) {
        // New Film
        await this.prisma.movie.create({ data });
      } else {
        // Обновляем только основные данные, без вложенных связей
        await this.prisma.movie.update({
          where: { title: data.title },
          data: movieData,
        });

        // upsert financial, если есть данные
        if (movieDto.financial) {
          await this.prisma.movieFinancial.upsert({
            where: { movieId: existing.id },
            update: {
              budget: movieDto.financial.budget ?? null,
              grossUsCanada: movieDto.financial.grossUSCanada ?? null,
              openingWeekendUsCanada: movieDto.financial.openingWeekendUSCanada ?? null,
              grossWorldwide: movieDto.financial.grossWorldwide ?? null,
            },
            create: {
              movie: { connect: { id: existing.id } },
              budget: movieDto.financial.budget ?? null,
              grossUsCanada: movieDto.financial.grossUSCanada ?? null,
              openingWeekendUsCanada: movieDto.financial.openingWeekendUSCanada ?? null,
              grossWorldwide: movieDto.financial.grossWorldwide ?? null,
            }
          });
        }
      }
    }

    return 'Movies saved successfully';
  }
}