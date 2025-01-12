import { Module } from '@nestjs/common';
import { S3Module } from '@/providers/s3/s3.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { TalentController } from './talent.controller';
import { TalentApplicationService } from './talentApplication.service';
import { SkillsService } from './skills.service';
import { ExpertiseAreasService } from './expertise-areas.service';
import { ExperiencesService } from './experiences.service';
import { ReferenceDataController } from './reference-data.controller';
import { MailModule } from '@/providers/mail/mail.module';

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
