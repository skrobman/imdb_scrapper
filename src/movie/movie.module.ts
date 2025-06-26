import { Module } from '@nestjs/common';
import { MovieService} from './movie.service';
import { MoviesController } from './movie.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MovieService],
  controllers: [MoviesController]
})
export class MovieModule {}
