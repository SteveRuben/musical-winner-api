import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';
import { SharedModule } from '@/providers/shared/shared.module';

import { ExperienceRatingsController } from './experience-ratings.controller';
import { ExperienceRatingsService } from './experience-ratings.service';

@Module({
  imports: [PrismaModule, SharedModule],
  controllers: [ExperienceRatingsController],
  providers: [ExperienceRatingsService],
  exports: [ExperienceRatingsService],
})
export class ExperienceRatingsModule {}
