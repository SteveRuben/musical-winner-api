import { SetMetadata } from '@nestjs/common';

import { PREPAI_AUDIT_LOG_DATA } from './audit-log.constants';

export const AuditLog = (...value: string[]) =>
  SetMetadata(PREPAI_AUDIT_LOG_DATA, value);
