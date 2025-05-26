import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import Redis from 'ioredis';
import { ScrappedMovieType } from '../types/scrapped-movie.type';
import { stringify } from 'csv-stringify/sync';

@Injectable()
export class ExportService {
  private readonly CACHE_KEY= 'scrapped-films';

  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis,
  ) {}

  async getCachedFilms(): Promise<ScrappedMovieType[]>{
    const cached = await this.redisClient.get(this.CACHE_KEY);
    if(!cached){
      throw new NotFoundException('No cached films found');
    }

    return JSON.parse(cached) as ScrappedMovieType[];
  }

  async downloadCsv(){
    const films = await this.getCachedFilms();
    if (films.length === 0) {
      throw new NotFoundException('No data to export');
    }

    const columns = Object.keys(films[0]);
    return  stringify(films, {
      header: true,
      columns,
    });
  }
}