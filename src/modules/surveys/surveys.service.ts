import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { NotificationService } from '@/providers/shared/notification.service';

import { CreateSurveyResponseDto } from './dto';

@Injectable()
export class SurveysService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async respondToSurvey(
    accountId: number,
    createResponseDto: CreateSurveyResponseDto,
  ) {
    const existingResponse = await this.prisma.surveyResponse.findFirst({
      where: {
        accountId,
        surveyName: createResponseDto.surveyName,
      },
    });

    let response;
    if (existingResponse) {
      response = await this.prisma.surveyResponse.update({
        where: { id: existingResponse.id },
        data: { response: createResponseDto.response },
      });
    } else {
      response = await this.prisma.surveyResponse.create({
        data: {
          accountId,
          surveyName: createResponseDto.surveyName,
          response: createResponseDto.response,
        },
      });
    }

    await this.notificationService.notifySurveyResponse(response, accountId);
    return response;
  }

  async getSurveyResponses(accountId: number) {
    return this.prisma.surveyResponse.findMany({
      where: { accountId },
    });
  }

  async getSurveyResponse(accountId: number, surveyName: string) {
    return this.prisma.surveyResponse.findFirst({
      where: {
        accountId,
        surveyName,
      },
    });
  }
}
