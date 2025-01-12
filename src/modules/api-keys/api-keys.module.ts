import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ElasticSearchModule } from '../../providers/elasticsearch/elasticsearch.module';

import { ApiKeyGroupController } from './api-keys-group.controller';
import { ApiKeyUserController } from './api-keys-user.controller';
import { ApiKeysService } from './api-keys.service';
import { TokensModule } from '@/providers/tokens/tokens.module';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule, TokensModule, ConfigModule, ElasticSearchModule],
  controllers: [ApiKeyGroupController, ApiKeyUserController],
  providers: [ApiKeysService],
  exports: [ApiKeysService],
})
export class ApiKeysModule {}
