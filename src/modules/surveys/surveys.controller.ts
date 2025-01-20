import { Controller, Post, Get, Body, Req, Param } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { CreateSurveyResponseDto } from './dto';


@Controller('surveys')
export class SurveysController {
  constructor(private readonly surveysService: SurveysService) {}

  @Post('respond')
  async respondToSurvey(
    @Req() req,
    @Body() createResponseDto: CreateSurveyResponseDto,
  ) {
    const response = await this.surveysService.respondToSurvey(
      req.user.id,
      createResponseDto,
    );
    return { response };
  }

  @Get()
  async getSurveyResponses(@Req() req) {
    const responses = await this.surveysService.getSurveyResponses(req.user.id);
    return { responses };
  }

  @Get(':surveyName')
  async getSurveyResponse(@Req() req, @Param('surveyName') surveyName: string) {
    const response = await this.surveysService.getSurveyResponse(
      req.user.id,
      surveyName,
    );
    return { response };
  }
}