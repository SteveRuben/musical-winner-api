import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';

import { AuditLogController } from './audit-logs.controller';
import { AuditLogsService } from './audit-logs.service';
import { AuditLogGroupController } from './audit-logs-group.controller';
import { AuditLogUserController } from './audit-logs-user.controller';

@Module({
  imports: [PrismaModule],
  controllers: [
    AuditLogController,
    AuditLogGroupController,
    AuditLogUserController,
  ],
  providers: [AuditLogsService],
})
export class AuditLogsModule {}
