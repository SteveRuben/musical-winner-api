import { Module } from '@nestjs/common';
import { SurveysController } from './surveys.controller';
import { SurveysService } from './surveys.service';
import { SharedModule } from '@/providers/shared/shared.module';
import { PrismaModule } from '@/prisma/prisma.module';


@Module({
  imports: [PrismaModule, SharedModule],
  controllers: [SurveysController],
  providers: [SurveysService],
  exports: [SurveysService],
})
export class SurveysModule {}