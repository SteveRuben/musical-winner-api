import { Injectable } from '@nestjs/common';
import { ExperienceLevel } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class ExperiencesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    // Retourne les valeurs de l'enum ExperienceLevel
    return Object.values(ExperienceLevel);
  }
}
