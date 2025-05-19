import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MoviesModule } from './movies/movies.module';
import { ScrapperModule } from './scrapper/scrapper.module';
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env',
      }),
      PrismaModule,
      MoviesModule,
      ScrapperModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
