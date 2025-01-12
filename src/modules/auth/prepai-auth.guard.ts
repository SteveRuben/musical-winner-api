import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { PREPAI_PUBLIC_ENDPOINT } from './auth.constants';

@Injectable()
export class PrepAIAuthGuard extends AuthGuard('prepai') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  public canActivate(context: ExecutionContext) {
    const decoratorSkip =
      this.reflector.get(PREPAI_PUBLIC_ENDPOINT, context.getClass()) ||
      this.reflector.get(PREPAI_PUBLIC_ENDPOINT, context.getHandler());
    if (decoratorSkip) return true;
    return super.canActivate(context);
  }
}
