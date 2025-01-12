import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TokensModule } from '@/providers/tokens/tokens.module';
import { DomainController } from './domains.controller';
import { DomainsService } from './domains.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { DnsModule } from '@/providers/dns/dns.module';

@Module({
  imports: [PrismaModule, TokensModule, DnsModule, ConfigModule],
  controllers: [DomainController],
  providers: [DomainsService],
  exports: [DomainsService],
})
export class DomainsModule {}
