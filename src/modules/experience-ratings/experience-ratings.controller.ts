import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';

import { CreateExperienceRatingDto, UpdateExperienceRatingDto } from './dto';
import { ExperienceRatingsService } from './experience-ratings.service';

@Controller('experience-ratings')
export class ExperienceRatingsController {
  constructor(private readonly ratingsService: ExperienceRatingsService) {}

  @Post('submit')
  async submitRating(
    @Req() req,
    @Body() createRatingDto: CreateExperienceRatingDto,
  ) {
    const rating = await this.ratingsService.createRating(
      req.user.id,
      createRatingDto,
    );

    return {
      ratingId: rating.id,
      rating: rating.rating,
      feedback: rating.feedback,
    };
  }

  @Post(':id/update')
  async updateRating(
    @Req() req,
    @Param('id', ParseIntPipe) ratingId: number,
    @Body() updateRatingDto: UpdateExperienceRatingDto,
  ) {
    const rating = await this.ratingsService.updateRating(
      ratingId,
      req.user.id,
      updateRatingDto,
    );

    return {
      ratingId: rating.id,
      rating: rating.rating,
      feedback: rating.feedback,
    };
  }
}
