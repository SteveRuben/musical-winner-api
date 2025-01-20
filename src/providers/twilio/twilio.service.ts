import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import PQueue from 'p-queue';
import pRetry from 'p-retry';
import { Twilio } from 'twilio';
import { MessageListInstanceCreateOptions } from 'twilio/lib/rest/api/v2010/account/message';
import { VideoProvider } from '../interfaces/video-provider.interface';
/* import TwilioClient from 'twilio/lib/rest/Twilio'; */
import { v4 as uuidv4 } from 'uuid';
import AccessToken, { VideoGrant } from 'twilio/lib/jwt/AccessToken';

@Injectable()
export class TwilioService implements VideoProvider {
  client: any;
  logger = new Logger(TwilioService.name);
  private queue = new PQueue({ concurrency: 1 });
  private readonly MAX_ALLOWED_SESSION_SECONDS = 14400;

  constructor(private configService: ConfigService) {
    const twilioAccountSid = this.configService.get<string>(
      'sms.twilioAccountSid',
    );
    const twilioAuthToken = this.configService.get<string>(
      'sms.twilioAuthToken',
    );
    if (!twilioAccountSid || !twilioAuthToken)
      this.logger.warn('Twilio account SID/auth token not found');
    this.client = new Twilio(
      twilioAccountSid || 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      twilioAuthToken || 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    );
  }

  send(options: MessageListInstanceCreateOptions) {
   this.queue
      .add(() =>
        pRetry(() => this.sendSms(options), {
          retries: this.configService.get<number>('sms.retries') ?? 3,
          onFailedAttempt: (error) => {
            this.logger.error(
              `SMS to ${options.to} failed, retrying (${error.retriesLeft} attempts left)`,
              error.name,
            );
          },
        }),
      )
      .then(() => {})
      .catch(() => {});
  }

  private async sendSms(options: MessageListInstanceCreateOptions) {
    return this.client.messages.create(options);
  }

  get twilioConfig() {
    return {
      accountSid: this.configService.get('TWILIO_ACCOUNT_SID'),
      apiKeySid: this.configService.get('TWILIO_API_KEY_SID'),
      apiKeySecret: this.configService.get('TWILIO_API_KEY_SECRET'),
    };
  }

  generateToken(roomId: string, accountId: string): string {
    const userUuid = uuidv4();
    
    const { accountSid, apiKeySid, apiKeySecret } = this.twilioConfig;
    
    const token = new AccessToken(
      accountSid,
      apiKeySid,
      apiKeySecret,
      { ttl: this.MAX_ALLOWED_SESSION_SECONDS,
        identity: accountId
       }
    );

    token.identity = `${accountId}#!${userUuid}`;
    const videoGrant = new VideoGrant({
      room: `${process.env.NODE_ENV}_${roomId}`
    });
    token.addGrant(videoGrant);

    return token.toJwt();
  }
}
