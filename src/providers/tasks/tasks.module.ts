import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DomainsModule } from '@/modules/domains/domains.module';
import { MetricsModule } from '@/modules/metrics/metrics.module';
import { UsersModule } from '@/modules/users/users.module';
import { PrismaModule } from '@/prisma/prisma.module';

import { ElasticSearchModule } from '../elasticsearch/elasticsearch.module';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    ElasticSearchModule,
    DomainsModule,
    UsersModule,
    MetricsModule,
  ],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
