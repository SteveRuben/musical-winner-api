import { Injectable, NotFoundException } from '@nestjs/common';
import { VideoProviderFactory } from './providers/video-provider.factory';
import { MeetingsConfigService } from './meetings-config.service';
import { RoomService } from './room.service';

@Injectable()
export class MeetingsService {
  constructor(
    private videoProviderFactory: VideoProviderFactory,
    private roomService: RoomService,
    private config: MeetingsConfigService,
  ) {}

  async joinRoom(actorId: string, roomRoute: string) {
    const room = await this.roomService.getRoomByRoute(roomRoute);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const provider = this.videoProviderFactory.getProvider();
    const token = provider.generateToken(room.id.toString(), actorId);

    return { token };
  }

  async createMeeting(template: any, actorId: string, sessionId: string, templateName: string) {
    const room = await this.roomService.createRoom(template, actorId, sessionId, templateName);
    return {
      newMeeting: room,//.serialize()
    };
  }

  async createAnonymousMeeting(template: any, templateName: string) {
    const room = await this.roomService.createRoom(template, null, null, templateName);
    return {
      warning: "don't use w/o making sure it's impossible otherwise",
      url: this.getRoomUrl(room.displayName, room.urlId),
      urlId: room.urlId,
    };
  }

  private getRoomUrl(displayName: string, urlId: string): string {
    const urlName = this.roomService.getUrlName(displayName);
    return `${this.config.webUrl}/${urlName}-${urlId}`;
  }
}