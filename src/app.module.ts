import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ScrapperModule } from './scrapper/scrapper.module';
import {ConfigModule} from "@nestjs/config";
import { RedisModule } from './redis/redis.module';
import { ExportModule } from './export/export.module';

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env',
      }),
      PrismaModule,
      ScrapperModule,
      RedisModule,
      ExportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
