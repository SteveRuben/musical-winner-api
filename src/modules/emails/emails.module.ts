import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiKeysModule } from '@modules/api-keys/api-keys.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { MailModule } from '@/providers/mail/mail.module';
import { TwilioModule } from '@/providers/twilio/twilio.module';
import { PwnedModule } from '@/providers/pwned/pwned.module';
import { TokensModule } from '@/providers/tokens/tokens.module';
import { S3Module } from '@/providers/s3/s3.module';
import { EmailController } from './emails.controller';
import { EmailsService } from './emails.service';
import { UsersService } from '@modules/users/users.service';
import { AuthService } from '@modules/auth/auth.service';
import { GeolocationService } from '@/providers/geolocation/geolocation.service';
import { ApprovedSubnetsService } from '@modules/approved-subnets/approved-subnets.service';

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
