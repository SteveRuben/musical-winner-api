import { ApiKeysModule } from '@modules/api-keys/api-keys.module';
import { AuthModule } from '@modules/auth/auth.module';
import { GroupsModule } from '@modules/groups/groups.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from '@/prisma/prisma.module';
import { MailModule } from '@/providers/mail/mail.module';
import { TokensModule } from '@/providers/tokens/tokens.module';

import { MembershipsService } from './memberships.service';
import { GroupMembershipController } from './memberships-group.controller';
import { UserMembershipController } from './memberships-user.controller';

@Module({
  imports: [
    PrismaModule,
    MailModule,
    ConfigModule,
    AuthModule,
    GroupsModule,
    ApiKeysModule,
    TokensModule,
  ],
  controllers: [UserMembershipController, GroupMembershipController],
  providers: [MembershipsService],
})
export class MembershipsModule {}
