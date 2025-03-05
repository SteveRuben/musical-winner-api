import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from '@/prisma/prisma.module';
import { LiveKitModule } from '@/providers/livekit/livekit.module';
import { TwilioModule } from '@/providers/twilio/twilio.module';

import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';
import { MeetingsConfigService } from './meetings-config.service';
import { VideoProviderFactory } from './providers/video-provider.factory';
import { RoomRepository } from './repositories/room.repository';
import { RoomService } from './room.service';

@Module({
  imports: [ConfigModule, PrismaModule, TwilioModule, LiveKitModule],
  controllers: [MeetingsController],
  providers: [
    MeetingsService,
    MeetingsConfigService,
    VideoProviderFactory,
    RoomRepository,
    RoomService,
  ],
  exports: [MeetingsService],
})
export class MeetingsModule {}
