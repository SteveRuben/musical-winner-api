import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';
import { SharedModule } from '@/providers/shared/shared.module';

import { SurveysController } from './surveys.controller';
import { SurveysService } from './surveys.service';

@Module({
  imports: [PrismaModule, SharedModule],
  controllers: [SurveysController],
  providers: [SurveysService],
  exports: [SurveysService],
})
export class SurveysModule {}
