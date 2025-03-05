// src/reference-data/reference-data.controller.ts
import { Public } from '@modules/auth/public.decorator';
import { Controller, Get } from '@nestjs/common';
import { ExperienceLevel, ExpertiseArea } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';

@Public()
@Controller('reference-data')
export class ReferenceDataController {
  constructor(private prisma: PrismaService) {}

  @Get('/expertise-areas')
  async getExpertiseAreas() {
    return {
      expertiseAreas: Object.values(ExpertiseArea).map((area) => ({
        id: area,
        name: area,
        label: `expertise.${area.toLowerCase()}`,
      })),
    };
  }

  @Get('/experience-levels')
  async getExperienceLevels() {
    return {
      experienceLevels: Object.values(ExperienceLevel).map((level) => ({
        id: level,
        name: level,
        range: this.getExperienceRange(level),
        label: `experience.${level.toLowerCase()}`,
      })),
    };
  }

  @Get('/skills')
  async getSkills() {
    const skills = await this.prisma.skill.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        _count: {
          select: { applications: true },
        },
      },
    });

    return {
      skills: skills.map((skill) => ({
        id: skill.id,
        name: skill.name,
        usageCount: skill._count.applications,
      })),
    };
  }

  private getExperienceRange(level: string): { min: number; max?: number } {
    switch (level) {
      case 'JUNIOR':
        return { min: 1, max: 3 };
      case 'INTERMEDIATE':
        return { min: 4, max: 6 };
      case 'SENIOR':
        return { min: 7, max: 10 };
      case 'EXPERT':
        return { min: 10 };
      default:
        return { min: 0 };
    }
  }
}
