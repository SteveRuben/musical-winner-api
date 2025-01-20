import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MeetingsConfigService {
  constructor(private configService: ConfigService) {}

  get provider(): 'twilio' | 'livekit' {
    return this.configService.get('LIVEKIT_API_KEY') ? 'livekit' : 'twilio';
  }
  
  get webUrl(): string {
    return this.configService.get('WEB_URL');
  }
}