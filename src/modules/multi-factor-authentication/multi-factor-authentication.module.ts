import { AuthModule } from '@modules/auth/auth.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from '@/prisma/prisma.module';
import { MailModule } from '@/providers/mail/mail.module';
import { TokensModule } from '@/providers/tokens/tokens.module';
import { TwilioModule } from '@/providers/twilio/twilio.module';

import { MultiFactorAuthenticationController } from './multi-factor-authentication.controller';
import { MultiFactorAuthenticationService } from './multi-factor-authentication.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    TwilioModule,
    MailModule,
    ConfigModule,
    TokensModule,
  ],
  controllers: [MultiFactorAuthenticationController],
  providers: [MultiFactorAuthenticationService],
})
export class MultiFactorAuthenticationModule {}
