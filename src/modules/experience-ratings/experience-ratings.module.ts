import { Module } from '@nestjs/common';
import { ExperienceRatingsController } from './experience-ratings.controller';
import { ExperienceRatingsService } from './experience-ratings.service';
import { SharedModule } from '@/providers/shared/shared.module';
import { PrismaModule } from '@/prisma/prisma.module';


@Module({
  imports: [PrismaModule, SharedModule],
  controllers: [ExperienceRatingsController],
  providers: [ExperienceRatingsService],
  exports: [ExperienceRatingsService],
})
export class ExperienceRatingsModule {}