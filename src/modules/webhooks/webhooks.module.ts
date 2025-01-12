import { Module } from '@nestjs/common';
import { StripeModule } from '../stripe/stripe.module';
import { TokensModule } from '../../providers/tokens/tokens.module';
import { WebhookController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule, TokensModule, StripeModule, ConfigModule],
  controllers: [WebhookController],
  providers: [WebhooksService],
  exports: [WebhooksService],
})
export class WebhooksModule {}
