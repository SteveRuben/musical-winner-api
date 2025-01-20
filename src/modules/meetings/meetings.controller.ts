import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto, JoinRoomDto } from './dto';


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