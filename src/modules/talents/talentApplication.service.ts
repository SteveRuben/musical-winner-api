import { PrismaService } from '@/prisma/prisma.service';
import { MailService } from '@/providers/mail/mail.service';
import { Injectable } from '@nestjs/common';
import { ExperienceLevel, ExpertiseArea, Prisma } from '@prisma/client';

@Injectable()
export class TalentApplicationService {
  constructor(
    private prisma: PrismaService,
    private email: MailService,
  ) {}

  async create(data: {
    firstName: string;
    lastName: string;
    email: string;
    experience: ExperienceLevel;
    expertise: ExpertiseArea;
    skills: string[];
    bio: string;
    resumeUrl: string;
    resumeSize: number;
    resumeType: string;
  }) {
    const {
      firstName,
      lastName,
      skills,
      email,
      experience,
      expertise,
      ...applicationData
    } = data;
    if (!Object.values(ExperienceLevel).includes(experience)) {
      throw new Error('Invalid experience level');
    }
    if (!Object.values(ExpertiseArea).includes(expertise)) {
      throw new Error('Invalid expertise area');
    }

    const existingApplication = await this.prisma.talentApplication.findFirst({
      where: { email },
      include: { skills: true },
    });

    if (existingApplication) {
      const updated = await this.prisma.talentApplication.update({
        where: { id: existingApplication.id },
        data: {
          ...applicationData,
          email,
          firstName,
          lastName,
          experience,
          expertise,
          updatedAt: new Date(),
          skills: {
            // Déconnecter tous les skills existants
            disconnect: existingApplication.skills.map((skill) => ({
              id: skill.id,
            })),
            // Connecter ou créer les nouveaux skills
            connectOrCreate: skills.map((skillName) => ({
              where: { name: skillName },
              create: { name: skillName },
            })),
          },
        },
        include: { skills: true },
      });
      await this.sendUpdateEmail(updated);
      return updated;
    } else {
      const created = await this.prisma.talentApplication.create({
        data: {
          ...applicationData,
          email,
          firstName,
          lastName,
          experience,
          expertise,
          skills: {
            connectOrCreate: skills.map((skillName) => ({
              where: { name: skillName },
              create: { name: skillName },
            })),
          },
        },
        include: { skills: true },
      });
      await this.sendNewApplicationEmail(created);
      return created;
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.TalentApplicationWhereInput;
    orderBy?: Prisma.TalentApplicationOrderByWithRelationInput;
  }) {
    return this.prisma.talentApplication.findMany({
      ...params,
      include: {
        skills: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.talentApplication.findUnique({
      where: { id },
      include: {
        skills: true,
      },
    });
  }

  async update(id: number, data: Prisma.TalentApplicationUpdateInput) {
    return this.prisma.talentApplication.update({
      where: { id },
      data,
      include: {
        skills: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.talentApplication.delete({
      where: { id },
    });
  }

  private async sendNewApplicationEmail(application: any) {
    this.email.send({
      to: `"${application.firstName} ${application.lastName}" <${application.email}>`,
      template: 'talent/new-application',
      data: {
        name: `${application.firstName} ${application.lastName}`,
        skills: application.skills.map((s: any) => s.name).join(', '),
        expertise: `${this.getExpertiseLabel(application.expertise).toLocaleLowerCase()} ${application.experience.toLocaleLowerCase()}`,
        applicationId: application.id,
      },
    });
  }

  private async sendUpdateEmail(application: any) {
    this.email.send({
      to: `"${application.firstName} ${application.lastName}" <${application.email}>`,
      template: 'talent/update-application',
      data: {
        name: `${application.firstName} ${application.lastName}`,
        skills: application.skills.map((s: any) => s.name).join(', '),
        expertise: this.getExpertiseLabel(application.expertise),
        applicationId: application.id,
      },
    });
  }

  private getExperienceLabel(level: ExperienceLevel): string {
    const labels = {
      [ExperienceLevel.JUNIOR]: '1-3 years',
      [ExperienceLevel.INTERMEDIATE]: '4-6 years',
      [ExperienceLevel.SENIOR]: '7-10 years',
      [ExperienceLevel.EXPERT]: '10+ years',
    };
    return labels[level];
  }

  private getExpertiseLabel(area: ExpertiseArea): string {
    const labels = {
      [ExpertiseArea.FRONTEND]: 'Frontend Development',
      [ExpertiseArea.BACKEND]: 'Backend Development',
      [ExpertiseArea.FULLSTACK]: 'Full Stack Development',
      [ExpertiseArea.MOBILE]: 'Mobile Development',
      [ExpertiseArea.DEVOPS]: 'DevOps',
    };
    return labels[area];
  }
}
