import { ApiKeysModule } from '@modules/api-keys/api-keys.module';
import { ApprovedSubnetsService } from '@modules/approved-subnets/approved-subnets.service';
import { AuthService } from '@modules/auth/auth.service';
import { UsersService } from '@modules/users/users.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from '@/prisma/prisma.module';
import { GeolocationService } from '@/providers/geolocation/geolocation.service';
import { MailModule } from '@/providers/mail/mail.module';
import { PwnedModule } from '@/providers/pwned/pwned.module';
import { S3Module } from '@/providers/s3/s3.module';
import { TokensModule } from '@/providers/tokens/tokens.module';
import { TwilioModule } from '@/providers/twilio/twilio.module';

import { EmailController } from './emails.controller';
import { EmailsService } from './emails.service';

@Module({
  imports: [
    PrismaModule,
    MailModule,
    ConfigModule,
    TwilioModule,
    PwnedModule,
    TokensModule,
    S3Module,
    ApiKeysModule,
  ],
  controllers: [EmailController],
  providers: [
    EmailsService,
    UsersService,
    AuthService,
    GeolocationService,
    ApprovedSubnetsService,
  ],
})
export class EmailsModule {}
