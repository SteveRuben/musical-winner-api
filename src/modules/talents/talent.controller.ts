// talent.controller.ts
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { SkillsService } from './skills.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TalentApplicationService } from './talentApplication.service';
import { ExperiencesService } from './experiences.service';
import { ExpertiseAreasService } from './expertise-areas.service';
import { CreateTalentApplicationDto } from './create-talent-application.dto';
import { Public } from '@modules/auth/public.decorator';

@Public()
@Controller('talent')
export class TalentController {
  constructor(
    private readonly talentService: TalentApplicationService,
    private readonly experiencesService: ExperiencesService,
    private readonly expertiseAreasService: ExpertiseAreasService,
    private readonly skillsService: SkillsService,
  ) {}

  // Charger les données initiales pour le formulaire
  @Get('form-data')
  async getFormData() {
    const [experiences, expertiseAreas, skills] = await Promise.all([
      this.experiencesService.findAll(),
      this.expertiseAreasService.findAll(),
      this.skillsService.findAll(),
    ]);

    return {
      experiences,
      expertiseAreas,
      skills,
    };
  }

  // Soumettre une candidature
  @Post('applications')
  @UseInterceptors(
    FileInterceptor('resume', {
      storage: diskStorage({
        destination: './uploads/resumes',
        filename: (_, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          callback(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
        },
      }),
      fileFilter: (_, file, callback) => {
        const allowedMimes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (allowedMimes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new BadRequestException('Invalid file type'), false);
        }
      },
      limits: {
        fileSize: 15 * 1024 * 1024, // 15MB max
      },
    }),
  )
  async submit(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: CreateTalentApplicationDto,
  ) {
    return this.talentService.create({
      ...data,
      skills: JSON.parse(data.skills),
      resumeUrl: file.path,
      resumeSize: file.size,
      resumeType: file.mimetype,
    });
  }
}
