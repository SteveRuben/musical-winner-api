import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

import { PrismaModule } from '@/prisma/prisma.module';

import { WallpapersController } from './wallpapers.controller';
import { WallpapersService } from './wallpapers.service';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get('WALLPAPERS_DIRECTORY'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [WallpapersController],
  providers: [WallpapersService],
  exports: [WallpapersService],
})
export class WallpapersModule {}
