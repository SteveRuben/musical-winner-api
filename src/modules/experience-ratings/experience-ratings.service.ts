import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { NotificationService } from '@/providers/shared/notification.service';

import { CreateExperienceRatingDto, UpdateExperienceRatingDto } from './dto';

@Injectable()
export class ExperienceRatingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async createRating(
    accountId: number,
    createRatingDto: CreateExperienceRatingDto,
  ) {
    const rating = await this.prisma.experienceRating.create({
      data: {
        accountId,
        rating: createRatingDto.rating,
        feedback: createRatingDto.feedback,
        roomId: createRatingDto.roomId,
        spaceId: createRatingDto.spaceId,
        submittedAt: new Date(),
      },
    });

    await this.notificationService.notifyExperienceRating(
      rating,
      accountId,
      false,
    );

    return rating;
  }

  async updateRating(
    ratingId: number,
    accountId: number,
    updateRatingDto: UpdateExperienceRatingDto,
  ) {
    const rating = await this.prisma.experienceRating.findUnique({
      where: { id: ratingId },
    });

    if (!rating) {
      throw new NotFoundException('Rating does not exist');
    }

    if (rating.accountId !== accountId) {
      throw new UnauthorizedException('You cannot update this rating');
    }

    const updated = await this.prisma.experienceRating.update({
      where: { id: ratingId },
      data: {
        rating: updateRatingDto.rating,
        feedback: updateRatingDto.feedback,
      },
    });

    await this.notificationService.notifyExperienceRating(
      updated,
      accountId,
      true,
    );

    return updated;
  }
}
