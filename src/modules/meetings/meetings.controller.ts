import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';

import { CreateMeetingDto, JoinRoomDto } from './dto';
import { MeetingsService } from './meetings.service';

@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Post('join')
  async joinRoom(@Req() req, @Body() joinRoomDto: JoinRoomDto) {
    return this.meetingsService.joinRoom(req.user.id, joinRoomDto.roomRoute);
  }

  @Post('create')
  async createMeeting(@Req() req, @Body() createMeetingDto: CreateMeetingDto) {
    return this.meetingsService.createMeeting(
      createMeetingDto.template,
      req.user.id,
      req.session.id,
      createMeetingDto.templateName,
    );
  }

  @Post('anonymous')
  async createAnonymousMeeting(@Body() createMeetingDto: CreateMeetingDto) {
    return this.meetingsService.createAnonymousMeeting(
      createMeetingDto.template,
      createMeetingDto.templateName,
    );
  }
}
