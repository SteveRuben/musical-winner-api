import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CreateWallpaperDto, WallpaperResponseDto } from './dto';
import { WallpapersService } from './wallpapers.service';

@Controller('wallpapers')
export class WallpapersController {
  constructor(private readonly wallpapersService: WallpapersService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadWallpaper(
    @UploadedFile() file: Express.Multer.File,
    @Body() createWallpaperDto: CreateWallpaperDto,
    @Req() req: any,
  ): Promise<{ wallpaper: WallpaperResponseDto }> {
    if (!file) {
      throw new BadRequestException('A single file is required');
    }

    const wallpaper = await this.wallpapersService.createWallpaper(
      file,
      req.user,
      createWallpaperDto,
    );

    return { wallpaper };
  }

  @Delete(':id')
  async deleteWallpaper(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<void> {
    await this.wallpapersService.deleteWallpaper(id, req.user.id);
  }

  @Get()
  async listWallpapers(
    @Req() req: any,
  ): Promise<{ wallpapers: WallpaperResponseDto[] }> {
    const wallpapers = await this.wallpapersService.getWallpapersForActor(
      req.user.id,
    );
    return { wallpapers };
  }
}
