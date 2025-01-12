import { Controller, Get, Query } from '@nestjs/common';
import { AuditLog } from '@prisma/client';

import { AuditLogsService } from './audit-logs.service';
import { Scopes } from '@/modules/auth/scope.decorator';
import { OptionalIntPipe } from '@/pipes/optional-int.pipe';
import { Expose } from '@/prisma/prisma.interface';
import { OrderByPipe } from '@/pipes/order-by.pipe';
import { CursorPipe } from '@/pipes/cursor.pipe';
import { WherePipe } from '@/pipes/where.pipe';

@Controller('audit-logs')
export class AuditLogController {
  constructor(private auditLogsService: AuditLogsService) {}

  /** Get audit logs for a group */
  @Get()
  @Scopes('audit-log-*:read-info')
  async getAll(
    @Query('skip', OptionalIntPipe) skip?: number,
    @Query('take', OptionalIntPipe) take?: number,
    @Query('cursor', CursorPipe) cursor?: Record<string, number | string>,
    @Query('where', WherePipe) where?: Record<string, number | string>,
    @Query('orderBy', OrderByPipe) orderBy?: Record<string, 'asc' | 'desc'>,
  ): Promise<Expose<AuditLog>[]> {
    return this.auditLogsService.getAuditLogs({
      skip,
      take,
      orderBy,
      /*  cursor, */
      where,
    });
  }
}
