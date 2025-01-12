import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ExpertiseArea } from '@prisma/client';

@Injectable()
export class ExpertiseAreasService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    // Retourne les valeurs de l'enum ExpertiseArea
    return Object.values(ExpertiseArea);
  }
}
