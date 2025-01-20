import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  async createTemplate(name: string, data: string, creatorId: number) {
    return await this.prisma.roomTemplate.create({
      data: {
        name,
        data,
        creatorId
      },
    });
  }

  async getTemplate(name: string) {
    return await this.prisma.roomTemplate.findFirst({
      where: { name },
    });
  }

  async updateTemplate(name: string, data: string) {
    return await this.prisma.roomTemplate.update({
      where: { name },
      data: { data },
    });
  }
}