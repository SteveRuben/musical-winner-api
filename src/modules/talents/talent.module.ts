import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';
import { MailModule } from '@/providers/mail/mail.module';
import { S3Module } from '@/providers/s3/s3.module';

import { ExperiencesService } from './experiences.service';
import { ExpertiseAreasService } from './expertise-areas.service';
import { ReferenceDataController } from './reference-data.controller';
import { SkillsService } from './skills.service';
import { TalentController } from './talent.controller';
import { TalentApplicationService } from './talentApplication.service';

@Module({
  imports: [PrismaModule, MailModule, S3Module],
  controllers: [TalentController, ReferenceDataController],
  providers: [
    TalentApplicationService,
    SkillsService,
    ExpertiseAreasService,
    ExperiencesService,
  ],
  exports: [
    TalentApplicationService,
    SkillsService,
    ExpertiseAreasService,
    ExperiencesService,
  ],
})
export class TalentModule {}
