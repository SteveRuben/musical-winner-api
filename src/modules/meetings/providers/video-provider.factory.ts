import { Injectable } from '@nestjs/common';
import { MeetingsConfigService } from '../meetings-config.service';
import { TwilioService } from '@/providers/twilio/twilio.service';
import { LiveKitService } from '@/providers/livekit/livekit.service';
import { VideoProvider } from '@/providers/interfaces/video-provider.interface';

@Injectable()
export class VideoProviderFactory {
  constructor(
    private config: MeetingsConfigService,
    private twilioProvider: TwilioService,
    private livekitProvider: LiveKitService,
  ) {}

  getProvider(): VideoProvider {
    return this.config.provider === 'twilio' 
      ? this.twilioProvider 
      : this.livekitProvider;
  }
}