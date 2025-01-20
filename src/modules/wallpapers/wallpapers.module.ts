import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WallpapersController } from './wallpapers.controller';
import { WallpapersService } from './wallpapers.service';
import { PrismaModule } from '@/prisma/prisma.module';


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