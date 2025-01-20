import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { CreateWallpaperDto, WallpaperResponseDto } from './dto';
import sharp from 'sharp';

@Injectable()
export class WallpapersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async createWallpaper(
    file: Express.Multer.File,
    user: { id: number },
    createWallpaperDto: CreateWallpaperDto
  ): Promise<WallpaperResponseDto> {
    const wallpaperDirectory = this.configService.get('WALLPAPERS_DIRECTORY');
    const fileName = `${Date.now()}-${file.originalname}`;
    const fileUrl = `/wallpapers/${fileName}`;
    const thumbnailUrl = `/wallpapers/thumbnails/${fileName}`;

    try {
      const wallpaper = await this.prisma.wallpaper.create({
        data: {
          creatorId: user.id,
          name: createWallpaperDto.name,
          url: fileUrl,
          thumbnailUrl,
          mimetype: file.mimetype,
          category: createWallpaperDto.category,
          artistName: createWallpaperDto.artistName,
          dominantColor: await this.extractDominantColor(file.buffer),
        },
      });

      // Sauvegarder le fichier
      const filePath = path.join(wallpaperDirectory, fileName);
      await this.saveFile(file, filePath);
      
      // Générer et sauvegarder la miniature
      await this.generateThumbnail(filePath, path.join(wallpaperDirectory, 'thumbnails', fileName));

      return wallpaper;
    } catch (error) {
      throw new BadRequestException('Failed to create wallpaper');
    }
  }

  extractDominantColor = async (data: Buffer) => {
    const image = sharp(data);
  
    const stats = await image.stats();
    const { r, g, b } = stats.dominant;
    return `rgb(${r}, ${g}, ${b})`;
  };

  async deleteWallpaper(id: number, userId: number): Promise<void> {
    const wallpaper = await this.prisma.wallpaper.findUnique({
      where: { id },
      include: { roomStateUsages: true }
    });

    if (!wallpaper) {
      throw new NotFoundException('Wallpaper not found');
    }

    if (wallpaper.creatorId !== userId) {
      throw new BadRequestException('Not authorized to delete this wallpaper');
    }

    if (wallpaper.roomStateUsages.length > 0) {
      throw new BadRequestException('Wallpaper is in use by one or more rooms');
    }

    try {
      await this.prisma.wallpaper.delete({
        where: { id }
      });

      // Supprimer les fichiers physiques
      await this.deleteFile(wallpaper.url);
      if (wallpaper.thumbnailUrl) {
        await this.deleteFile(wallpaper.thumbnailUrl);
      }
    } catch (error) {
      throw new BadRequestException('Failed to delete wallpaper');
    }
  }

  async getWallpapersForActor(actorId: number): Promise<WallpaperResponseDto[]> {
    return await this.prisma.wallpaper.findMany({
      where: {
        OR: [
          { creatorId: actorId },
          { category: 'system' }, // wallpapers système
        ],
      },
      include: {
        creator: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  private async saveFile(file: Express.Multer.File, filePath: string): Promise<void> {
    // Implémenter la logique de sauvegarde du fichier
  }

  private async generateThumbnail(sourcePath: string, thumbnailPath: string): Promise<void> {
    // Implémenter la logique de génération de miniature
  }

  private async deleteFile(fileUrl: string): Promise<void> {
    // Implémenter la logique de suppression du fichier
  }
}