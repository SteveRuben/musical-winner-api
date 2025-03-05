import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccessToken } from 'livekit-server-sdk';
import { v4 as uuidv4 } from 'uuid';

import { VideoProvider } from '../interfaces/video-provider.interface';

@Injectable()
export class LiveKitService implements VideoProvider {
  constructor(private configService: ConfigService) {}

  get livekitConfig() {
    return {
      apiKey: this.configService.get('LIVEKIT_API_KEY'),
      secretKey: this.configService.get('LIVEKIT_SECRET_KEY'),
    };
  }

  generateToken(roomId: string, accountId: string): string {
    const userUuid = uuidv4();
    const { apiKey, secretKey } = this.livekitConfig;

    const token = new AccessToken(apiKey, secretKey, {
      identity: `${accountId}#!${userUuid}`,
    });

    token.addGrant({
      roomJoin: true,
      room: `${process.env.NODE_ENV}_${roomId}`,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    let toJwt = '';
    token.toJwt().then((response) => (toJwt = response));
    return toJwt;
  }
}
