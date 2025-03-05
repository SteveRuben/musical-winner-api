// filters/all-exceptions.filter.ts
import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    this.logger.error('Exception occurred:', exception);
    if (exception instanceof Error) {
      this.logger.error('Stack trace:', exception.stack);
      this.logger.error('Error message:', exception.message);
      // Si c'est une erreur TypeORM/Prisma
      if ('code' in exception) {
        this.logger.error('Error code:', (exception as any).code);
      }
    }
    // Log the request details
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    this.logger.error('Request path:', request.path);
    this.logger.error('Request method:', request.method);
    this.logger.error('Request body:', request.body);
  }
}
