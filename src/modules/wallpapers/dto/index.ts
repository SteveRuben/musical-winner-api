export class CreateWallpaperDto {
  name?: string;
  category?: string;
  artistName?: string;
}

export class WallpaperResponseDto {
  id: number;
  creatorId?: number;
  name?: string;
  url: string;
  mimetype?: string;
  category?: string;
  artistName?: string;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
