import { Module } from '@nestjs/common';
import { AuditLogController } from './audit-logs.controller';
import { AuditLogGroupController } from './audit-logs-group.controller';
import { AuditLogUserController } from './audit-logs-user.controller';
import { AuditLogsService } from './audit-logs.service';
import { PrismaModule } from '@/prisma/prisma.module';

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
