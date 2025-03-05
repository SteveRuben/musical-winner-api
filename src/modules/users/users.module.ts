import { ApiKeysModule } from '@modules/api-keys/api-keys.module';
import { AuthModule } from '@modules/auth/auth.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from '@/prisma/prisma.module';
import { MailModule } from '@/providers/mail/mail.module';
import { S3Module } from '@/providers/s3/s3.module';
import { TokensModule } from '@/providers/tokens/tokens.module';

import { UserController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    MailModule,
    ConfigModule,
    TokensModule,
    S3Module,
    ApiKeysModule,
  ],
  controllers: [UserController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
